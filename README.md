# Estúdio IA Pro

Plataforma de transformação de fotos culinárias em imagens profissionais usando inteligência artificial.

## 🎯 Visão Geral

Estúdio IA Pro é uma aplicação Next.js que permite restaurantes e profissionais de food photography transformarem fotos amadoras em imagens de estúdio profissionais de alta qualidade. Utiliza tecnologias de ponta como FAL.ai para geração de imagens, Clerk para autenticação, Stripe para pagamentos e Supabase como banco de dados.

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Server Actions
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Clerk
- **Pagamentos:** Stripe
- **IA:** FAL.ai (fluxai), OpenRouter (DeepSeek)
- **Cache:** Upstash Redis
- **Email:** Resend

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── checkout/      # Stripe checkout
│   │   ├── generate/      # Geração de imagens IA
│   │   ├── user/          # Gestão de usuários
│   │   ├── webhooks/      # Webhooks Clerk/Stripe
│   │   └── early-access/  # Lista de espera
│   ├── dashboard/         # Área autenticada
│   ├── early-access/      # Página de early access
│   ├── sign-in/           # Login Clerk
│   └── sign-up/           # Registro Clerk
├── components/
│   ├── dashboard/          # Componentes do dashboard
│   ├── landing/           # Componentes da landing page
│   └── ui/                # Componentes UI (shadcn)
├── hooks/
│   └── use-generation.ts  # Hook para geração de imagens
└── lib/
    ├── ai/                # Integração IA (refiner)
    ├── fal/               # Cliente FAL.ai
    ├── redis.ts           # Cliente Upstash
    ├── stripe.ts          # Cliente Stripe
    └── supabase/          # Clientes Supabase
```

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm/bun
- Conta Supabase
- Conta Clerk
- Conta Stripe
- Conta FAL.ai
- Redis (Upstash)

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e preencha

# Executar desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Consulte `src/env.ts` para todas as variáveis necessárias:

```env
# Clerk
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...

# Supabase
SUPABASE_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# FAL.ai
FAL_KEY=...

# OpenRouter (DeepSeek)
OPENROUTER_API_KEY=...

# Upstash Redis
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Resend
RESEND_API_KEY=re_...
```

## 📱 Funcionalidades

### Landing Page

- Hero section com galeria visual
- Showcase de transformações antes/depois
- Seção de preços (Avulso, Starter, Pro, Scale)
- FAQ
- Call-to-action para cadastro

### Dashboard

- **Estúdio de Criação:** Interface de chat para upload de imagens e geração IA
- **Arquivo Digital:** Histórico completo de gerações
- **Configurações:**
  - Perfil do usuário
  - Gestão de créditos e plano
  - Configurações de qualidade IA (SD/HD/4K)

### Sistema de Créditos

- Créditos funcionam como moeda virtual
- Cada geração consome 1 crédito
- Planos: Avulso (R$19,90/10 fotos), Starter (R$49,90/40 fotos), Pro (R$99,90/120 fotos), Scale (R$189,90/300 fotos)
- Refund automático em caso de falha na geração

## 🗄️ Banco de Dados

O schema do banco está em `supabase/migrations/`:

- **profiles:** Usuários (clerk_id, email, créditos)
- **generations:** Registros de geração (status, prompts, URLs)
- **transactions:** Compras de créditos via Stripe
- **prompt_templates:** Templates de prompts pré-definidos

### RPCs (Procedures)

- `consume_user_credits`: Consome créditos atomicamente
- `refund_user_credits`: Estorna créditos
- `handle_generation_failure`: Trata falha e estorna
- `add_user_credits`: Adiciona créditos após pagamento

## 🎨 UI/UX

O projeto utiliza:

- **shadcn/ui** para componentes base
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Lucide React** para ícones

## 📄 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting ESLint
```

## 🧪 Testes

```bash
npm run test     # Executar testes Vitest
```

## 📄 Licença

MIT
