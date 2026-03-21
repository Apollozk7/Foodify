import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env";
import { z } from "zod";

const resend = new Resend(env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    // Enviar notificação de que o usuário entrou na lista de espera
    const data = await resend.emails.send({
      from: "Estúdio IA Pro <onboarding@resend.dev>", // Será atualizado para o domínio verificado depois
      to: [email],
      subject: "Acesso Antecipado Confirmado! 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #020617;">Olá! Você está na lista de espera oficial do Estúdio IA Pro.</h2>
          <p>Ficamos muito felizes com o seu interesse.</p>
          <p>Nós liberaremos as <strong>5 vagas exclusivas</strong> muito em breve, e você será um dos primeiros a ser notificado.</p>
          <p>Prepare as fotos do seu cardápio, a revolução visual do seu delivery está chegando.</p>
          <br/>
          <p>Um abraço,<br/><strong>Equipe Estúdio IA Pro</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao processar e-mail. Tente novamente." }, { status: 500 });
  }
}
