import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { addCredits } from "@/modules/credits";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const credits = parseInt(session.metadata?.credits ?? "0", 10);

    if (!userId || !planId || !credits) {
      console.error("[WEBHOOK] Missing metadata", session.metadata);
      return NextResponse.json({ received: true });
    }

    try {
      // Update purchase status
      const purchase = await db.purchase.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (purchase) {
        await db.purchase.update({
          where: { id: purchase.id },
          data: {
            status: "COMPLETED",
            stripePaymentIntentId: session.payment_intent as string,
          },
        });

        // Add credits
        await addCredits(userId, credits, "PURCHASE", {
          purchaseId: purchase.id,
          description: `Compra de ${credits} créditos`,
        });
      }
    } catch (err) {
      console.error("[WEBHOOK] Error processing payment", err);
      return NextResponse.json(
        { error: "Processing error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
