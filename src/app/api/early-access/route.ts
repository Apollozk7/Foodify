import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env";
import { z } from "zod";
import { redis } from "@/lib/redis";

const resend = new Resend(env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    // Secure IP extraction: prefer x-real-ip or take the last appended IP in x-forwarded-for
    // taking the first IP is vulnerable to spoofing (users passing arbitrary X-Forwarded-For values)
    const ip = request.headers.get("x-real-ip") || (forwardedFor ? forwardedFor.split(",").pop()?.trim() : "127.0.0.1") || "127.0.0.1";
    const ipKey = `rate_limit:early_access:${ip}`;

    const requestCount = await redis.incr(ipKey);

    // Set expiry on the first request (1 hour = 3600 seconds)
    if (requestCount === 1) {
      await redis.expire(ipKey, 3600);
    }

    // Limit to 3 requests per hour per IP
    if (requestCount > 3) {
      return NextResponse.json({ error: "Muitas requisições. Tente novamente mais tarde." }, { status: 429 });
    }

    const body = await request.json();
    const { email } = schema.parse(body);

    // Enviar notificação de que o usuário entrou na lista de espera
    const data = await resend.emails.send({
      from: "Estúdio IA Pro <onboarding@resend.dev>",
      to: [email],
      subject: "Você está na lista! Mas as vagas são limitadas... 🎉",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #f8fafc; padding: 40px 30px; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 40px; height: 40px; background-color: #2563eb; border-radius: 10px; line-height: 40px; font-weight: bold; color: white; font-style: italic; font-size: 20px;">E</div>
            <h1 style="font-size: 24px; font-weight: 800; margin-top: 15px; color: #ffffff; letter-spacing: -0.025em;">Estúdio IA Pro</h1>
          </div>

          <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 20px; text-align: center;">Seu bilhete para a elite do delivery foi reservado.</h2>
          
          <p style="color: #94a3b8; line-height: 1.6; font-size: 16px;">Olá,</p>
          
          <p style="color: #94a3b8; line-height: 1.6; font-size: 16px;">Confirmamos sua inscrição na nossa lista de espera exclusiva. Você deu o primeiro passo para parar de depender de fotos amadoras e começar a vender com <strong>visual de cinema</strong>.</p>

          <div style="background-color: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 16px; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; color: #60a5fa; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Atenção:</p>
            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 15px; line-height: 1.5;">Liberaremos o acesso para apenas <strong>5 proprietários selecionados</strong> nesta primeira semana de MVP. Isso garante que daremos suporte total para transformar cada cardápio em uma obra de arte.</p>
          </div>

          <p style="color: #94a3b8; line-height: 1.6; font-size: 16px;"><strong>O que acontece agora?</strong></p>
          <ul style="color: #94a3b8; line-height: 1.6; font-size: 15px;">
            <li>Fique atento à sua caixa de entrada (e confira o spam/promoções).</li>
            <li>Se você for selecionado, enviaremos um convite direto com o link de criação de conta.</li>
            <li>Já separe as 3 melhores fotos do seu prato principal para testar a nossa IA.</li>
          </ul>

          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #64748b; font-size: 12px; margin-bottom: 10px;">Enquanto espera, veja o que estamos aprontando:</p>
            <a href="https://instagram.com/estudioia.pro" style="color: #3b82f6; text-decoration: none; font-size: 14px; font-weight: 600;">Siga-nos no Instagram →</a>
          </div>

          <p style="text-align: center; color: #475569; font-size: 11px; margin-top: 40px;">
            © 2024 Estúdio IA Pro. Todos os direitos reservados.<br/>
            Este e-mail é exclusivo para convidados da lista de acesso antecipado.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao processar e-mail. Tente novamente." }, { status: 500 });
  }
}
