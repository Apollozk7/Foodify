import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodSnap AI — Fotos profissionais de comida com IA",
  description:
    "Crie fotos de comida profissionais em segundos com Inteligência Artificial. Perfeito para restaurantes, lanchonetes e delivery.",
  keywords: ["food photography", "ia", "inteligência artificial", "fotos comida", "restaurante"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
