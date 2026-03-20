import type { Metadata } from "next";
import { Work_Sans, Inter, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
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
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#020617",
          colorInputBackground: "rgba(255, 255, 255, 0.05)",
          colorInputText: "#ffffff",
          borderRadius: "1rem",
          fontFamily: "var(--font-inter)",
        },
        elements: {
          card: "bg-[#020617] border border-white/10 shadow-2xl",
          headerTitle: "font-work-sans font-bold",
          headerSubtitle: "text-slate-400",
          socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 transition-all",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-500 transition-all",
          footerActionLink: "text-blue-400 hover:text-blue-300",
        }
      }}
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
}
