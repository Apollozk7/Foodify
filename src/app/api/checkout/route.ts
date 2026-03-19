import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { env } from '@/env';

const CREDIT_PACKAGES = {
  starter: {
    name: 'Pacote Starter - 20 Créditos',
    credits: 20,
    price: 19.90,
  },
  pro: {
    name: 'Pacote Pro - 60 Créditos',
    credits: 60,
    price: 49.90,
  },
  growth: {
    name: 'Pacote Growth - 150 Créditos',
    credits: 150,
    price: 99.90,
  },
} as const;

type PackageId = keyof typeof CREDIT_PACKAGES;

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { packageId } = body as { packageId: PackageId };

    if (!packageId || !CREDIT_PACKAGES[packageId]) {
      return new NextResponse('Invalid packageId', { status: 400 });
    }

    const selectedPackage = CREDIT_PACKAGES[packageId];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: selectedPackage.name,
              description: `Adicione ${selectedPackage.credits} créditos à sua conta Estúdio IA Pro.`,
            },
            unit_amount: Math.round(selectedPackage.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('test') ? 'http://localhost:3000' : 'https://estudio-ia-pro.vercel.app'}/dashboard?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('test') ? 'http://localhost:3000' : 'https://estudio-ia-pro.vercel.app'}/billing?canceled=true`,
      metadata: {
        clerkId,
        credits: selectedPackage.credits.toString(),
        packageId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
