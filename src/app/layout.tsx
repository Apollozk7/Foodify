import type { Metadata } from 'next';
import { Work_Sans, Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import './globals.css';

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Estúdio IA Pro - Transforme suas fotos de comida',
  description:
    'Fotos profissionais para o seu delivery em segundos usando Inteligência Artificial.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      localization={ptBR}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html
        lang="pt-BR"
        className={`${workSans.variable} ${inter.variable} h-full antialiased dark scroll-smooth`}
      >
        <body className="min-h-full flex flex-col bg-black text-white selection:bg-primary/20 selection:text-primary">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
