import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

const checkoutSchema = z.object({
  planId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    // Look up plan
    const plan = await db.plan.findUnique({
      where: { id: parsed.data.planId },
    });

    if (!plan || !plan.isActive || !plan.stripePriceId) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId: plan.id,
        credits: plan.credits.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancel`,
    });

    // Create pending purchase
    await db.purchase.create({
      data: {
        userId,
        planId: plan.id,
        status: "PENDING",
        stripeSessionId: checkoutSession.id,
        amountPaid: plan.price,
        creditsGranted: plan.credits,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[CHECKOUT]", err);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}
