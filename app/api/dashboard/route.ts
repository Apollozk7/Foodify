import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBalance } from "@/modules/credits";
import { getUserImages } from "@/modules/generation";

/**
 * GET /api/dashboard — retorna dados do dashboard do usuário:
 * - saldo de créditos
 * - imagens geradas recentes
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;

    const [balance, images] = await Promise.all([
      getBalance(userId),
      getUserImages(userId, 20),
    ]);

    return NextResponse.json({
      credits: balance,
      images,
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    });
  } catch (err) {
    console.error("[DASHBOARD]", err);
    return NextResponse.json(
      { error: "Erro ao carregar dashboard" },
      { status: 500 }
    );
  }
}
