import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getBalance } from "@/modules/credits";
import { generateFoodImage } from "@/modules/generation";

const generateSchema = z.object({
  prompt: z.string().min(3, "Descreva seu prato com pelo menos 3 caracteres").max(500),
  quality: z.enum(["standard", "pro"]).optional().default("standard"),
});

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;

    // 2. Parse body
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // 3. Check credits
    const balance = await getBalance(userId);
    if (balance < 1) {
      return NextResponse.json(
        { error: "Créditos insuficientes. Adquira mais créditos." },
        { status: 402 }
      );
    }

    // 4. Generate
    const result = await generateFoodImage({
      userId,
      prompt: parsed.data.prompt,
      quality: parsed.data.quality,
    });

    if (result.status === "FAILED") {
      return NextResponse.json(
        { error: result.error ?? "Falha na geração", imageId: result.imageId },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageId: result.imageId,
      imageUrl: result.r2Url,
      status: result.status,
    });
  } catch (err) {
    console.error("[GENERATE]", err);
    return NextResponse.json(
      { error: "Erro interno na geração" },
      { status: 500 }
    );
  }
}
