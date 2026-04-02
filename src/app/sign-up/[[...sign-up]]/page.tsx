import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background overflow-hidden font-sans">
      {/* Left Side - Visual Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden border-r border-white/5 bg-[#050505]">
        {/* Background Image with Elite Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" 
            alt="Product Photography" 
            fill 
            className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        </div>

        {/* Branding */}
        <Link href="/" className="relative z-20 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-extrabold text-white italic text-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-transform group-hover:scale-110 duration-500">
            E
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tighter text-white">
            ESTÚDIO IA PRO
          </span>
        </Link>

        {/* Content */}
        <div className="relative z-20 space-y-6 max-w-md">
          <h1 className="text-6xl font-heading font-extrabold text-white leading-[0.9] tracking-tighter">
            Crie sua conta e <br />
            <span className="text-primary italic">comece grátis.</span>
          </h1>
          <p className="text-neutral-500 text-lg font-medium leading-relaxed">
            Junte-se a empreendedores que já transformam fotos de celular em vendas reais.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-12 relative bg-background overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-extrabold text-white italic text-2xl shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
            E
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tighter text-white">
            ESTÚDIO IA PRO
          </span>
        </div>

        <div className="w-full max-w-md animate-fade-up">
          <SignUp 
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
            appearance={{
              baseTheme: dark,
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-black text-[11px] tracking-label uppercase h-12 rounded-full transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.2)]",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white font-heading font-extrabold text-2xl tracking-tight",
                headerSubtitle: "text-neutral-500 font-medium",
                socialButtonsBlockButton: "bg-white/[0.03] border-white/5 hover:bg-white/5 text-white rounded-2xl h-12 transition-all",
                formFieldLabel: "text-neutral-400 font-black text-[10px] uppercase tracking-widest",
                formFieldInput: "bg-white/[0.03] border-white/5 focus:border-primary/50 text-white rounded-2xl h-12 transition-all",
                footerActionLink: "text-primary hover:text-primary/80 font-bold",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-primary",
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}
