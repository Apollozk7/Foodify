import type { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

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
    <html lang="pt-BR" className={`${inter.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
