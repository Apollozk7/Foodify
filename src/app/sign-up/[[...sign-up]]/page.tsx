import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#020617] overflow-hidden">
      {/* Left Side - Visual Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-[#020617]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" 
            alt="Product Photography" 
            fill 
            className="object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/80 to-transparent z-10" />
        </div>

        {/* Branding */}
        <Link href="/" className="relative z-20 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white italic text-xl shadow-lg shadow-blue-900/40">
            E
          </div>
          <span className="font-work-sans font-bold text-2xl tracking-tight text-white">
            Estúdio IA Pro
          </span>
        </Link>

        {/* Content */}
        <div className="relative z-20 space-y-6 max-w-md">
          <h1 className="text-5xl font-bold font-work-sans text-white leading-tight">
            Crie sua conta e <br />
            <span className="text-blue-500">comece grátis.</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Junte-se a centenas de restaurantes que já usam a IA para valorizar seus produtos.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-20 flex items-center gap-6 text-xs text-slate-500 font-medium">
          <span>Nano Banana 2 Engine</span>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <span>Professional I2I Technology</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
            E
          </div>
        </div>

        <SignUp 
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
