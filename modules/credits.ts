import { db } from "@/lib/db";

/**
 * Retorna o saldo de créditos do usuário.
 */
export async function getBalance(userId: string): Promise<number> {
  const balance = await db.creditBalance.findUnique({
    where: { userId },
  });
  return balance?.credits ?? 0;
}

/**
 * Debita créditos do saldo do usuário. Retorna true se bem-sucedido.
 */
export async function debitCredits(
  userId: string,
  amount: number,
  opts?: { imageId?: string; description?: string }
): Promise<boolean> {
  return await db.$transaction(async (tx) => {
    const balance = await tx.creditBalance.findUnique({
      where: { userId },
    });

    if (!balance || balance.credits < amount) return false;

    await tx.creditBalance.update({
      where: { userId },
      data: { credits: { decrement: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        type: "GENERATION",
        amount: -amount,
        imageId: opts?.imageId,
        description: opts?.description ?? `Geração de imagem (-${amount})`,
      },
    });

    return true;
  });
}

/**
 * Adiciona créditos ao saldo (compra ou bônus).
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: "PURCHASE" | "BONUS" | "REFUND",
  opts?: { purchaseId?: string; description?: string }
): Promise<void> {
  await db.$transaction([
    db.creditBalance.upsert({
      where: { userId },
      create: { userId, credits: amount },
      update: { credits: { increment: amount } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        type,
        amount,
        purchaseId: opts?.purchaseId,
        description: opts?.description ?? `+${amount} créditos`,
      },
    }),
  ]);
}

/**
 * Histórico de transações do usuário (últimas N).
 */
export async function getTransactionHistory(userId: string, take = 20) {
  return db.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}
