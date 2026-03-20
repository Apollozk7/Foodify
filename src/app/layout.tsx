import type { Metadata } from "next";
import { Work_Sans, Inter, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { shadesOfPurple } from "@clerk/themes";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Estúdio IA Pro - Transforme suas fotos de comida",
  description: "Fotos profissionais para o seu delivery em segundos usando Inteligência Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      localization={ptBR}
      appearance={{ baseTheme: shadesOfPurple }}
    >
      <html
        lang="pt-BR"
        className={`${workSans.variable} ${inter.variable} ${poppins.variable} h-full antialiased dark`}
      >
        <body className="min-h-full flex flex-col bg-[#020617] text-white selection:bg-white/10">
          <MeshGradientBackground />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
