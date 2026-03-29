import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { env } from '@/env';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { setCredits } from '@/lib/redis';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Webhook Error', { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Stripe Webhook verification failed: ${error.message}`);
    } else {
      console.error('Stripe Webhook verification failed: Unknown error');
    }
    return new NextResponse('Webhook Error', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle both completed and async payment success (essential for PIX)
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    // SECURITY: Only fulfill if the payment is actually confirmed as 'paid'
    // This prevents fulfillment of pending PIX QR codes
    if (session.payment_status !== 'paid') {
      return new NextResponse('Webhook Received: Payment not yet paid', { status: 200 });
    }

    const clerkId = session?.metadata?.clerkId;
    const credits = parseInt(session?.metadata?.credits || '0');

    if (!clerkId || !credits) {
      return new NextResponse('Webhook Error', { status: 400 });
    }

    // 1. Update credits in Supabase using the atomic and idempotent RPC
    // This RPC handles transaction recording and idempotency internally
    const { data, error: rpcError } = await supabaseAdmin.rpc('add_user_credits', {
      p_clerk_id: clerkId,
      p_stripe_session_id: session.id,
      p_credits_added: credits,
      p_amount_brl: (session.amount_total || 0) / 100,
    });

    if (rpcError) {
      console.error('[STRIPE_WEBHOOK_RPC_ERROR]', rpcError);
      return new NextResponse('Internal Error', { status: 500 });
    }

    const fulfillmentSuccess = data?.[0]?.success;
    const newTotalCredits = data?.[0]?.total_credits;

    // 2. Synchronize Redis ONLY if the RPC reports a successful new fulfillment
    if (fulfillmentSuccess && newTotalCredits !== undefined) {
      await setCredits(clerkId, newTotalCredits);
    }
  }

  return new NextResponse(null, { status: 200 });
}
