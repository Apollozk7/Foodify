import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      } as any,
    });

    // Create initial credit balance (3 free credits)
    await db.creditBalance.create({
      data: { userId: user.id, credits: 3 },
    });

    await db.creditTransaction.create({
      data: {
        userId: user.id,
        type: "BONUS",
        amount: 3,
        description: "Créditos iniciais de boas-vindas",
      },
    });

    return NextResponse.json(
      { message: "Conta criada com sucesso!", userId: user.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { error: "Erro interno ao criar conta" },
      { status: 500 }
    );
  }
}
