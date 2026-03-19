# Design Spec: Estúdio IA Pro - Fotografia de Produtos para Microempreendedores
**Data:** 2026-03-18
**Status:** Draft (Aguardando Revisão)

## 1. Visão Geral (Executive Summary)
O **Estúdio IA Pro** é um SaaS focado em democratizar a fotografia de produtos de alta qualidade para microempreendedores e deliveries emergentes. O sistema permite que usuários transformem fotos amadoras, tiradas com celulares comuns, em imagens publicitárias de nível profissional através de Inteligência Artificial Generativa (Image-to-Image). 

O diferencial competitivo é o **Refinamento Invisível de Prompts**, onde um LLM atua nos bastidores para converter inputs simples do usuário em descrições fotográficas técnicas e detalhadas, garantindo resultados superiores sem curva de aprendizado.

## 2. Público-Alvo e Problema
- **Público:** Microempreendedores, donos de pequenos deliveries (hambúrgueres, pizzas, doces) e vendedores de e-commerce local.
- **Problema:** Falta de orçamento para fotógrafos profissionais e equipamentos de iluminação; tempo escasso para edição manual de imagens.
- **Solução:** Uma ferramenta "one-click" que eleva a estética do produto real para um cenário de estúdio gourmet.

## 3. Funcionalidades Principais (Core Features)
- **Upload I2I (Image-to-Image):** Processamento de imagem preservando a estrutura do produto original mas elevando a qualidade global.
- **Prompt Refiner Silencioso:** Integração com LLM (Gemini 3 Flash/Kimi) para expansão automática de prompts curtos em prompts fotográficos profissionais.
- **Slider Antes/Depois:** Interface interativa para comparação imediata do ganho de qualidade.
- **Galeria Privada:** Armazenamento seguro de todas as gerações do usuário.
- **Sistema de Créditos (Pay-as-you-go):** Compra de pacotes de gerações via Stripe sem compromisso mensal.

## 4. Arquitetura Técnica (Tech Stack)
- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, shadcn/ui.
- **Autenticação:** Clerk (Google/Facebook Social Login).
- **Backend:** Next.js Route Handlers (Edge/Serverless).
- **Banco de Dados:** Supabase (PostgreSQL) para metadados e logs.
- **Storage:** Supabase Storage para persistência de imagens originais e geradas.
- **Cache & Rate Limit:** Upstash Redis (Gerenciamento de saldo de créditos e proteção de API).
- **IA Engines:** 
    - **Prompting:** Gemini 3 Flash / Kimi K2.5 (via API).
    - **Imaging:** Fal.ai (Modelos Nano Banana Pro / Nano Banana 2).
- **Pagamentos:** Stripe Checkout & Webhooks.
- **Hospedagem:** Railway.

## 5. Modelo de Dados (Supabase)
### Tabela: `profiles`
- `id`: UUID (Primary Key, Clerk User ID)
- `email`: String
- `credits`: Integer (Saldo atual)
- `updated_at`: Timestamp

### Tabela: `generations`
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> profiles.id)
- `original_image_url`: Text
- `generated_image_url`: Text (Nullable)
- `user_prompt`: Text
- `refined_prompt`: Text
- `status`: String (pending, completed, failed)
- `error_message`: Text (Nullable)
- `metadata`: JSONB (Parâmetros técnicos: seed, strength, etc.)
- `created_at`: Timestamp

### Tabela: `transactions`
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> profiles.id)
- `stripe_session_id`: String (Unique/Idempotency Key)
- `amount_total`: Integer
- `credits_added`: Integer
- `status`: String (pending, completed)

## 6. Gestão de Tarefas Longas e Erros
- **Estratégia de Geração:** Devido aos limites de timeout de Serverless (Vercel/Railway), usaremos uma abordagem de **Polling**.
    1. O cliente inicia a geração (POST `/api/generate`).
    2. O servidor cria um registro com status `pending` e inicia a chamada assíncrona para Fal.ai.
    3. O cliente faz requisições periódicas (GET `/api/generate/[id]`) para verificar o status.
- **Estorno Automático:** Se o status mudar para `failed` (timeout da API ou erro de rede), um trigger no banco de dados ou a própria API Route deve devolver o crédito ao `profiles.credits`.
- **Feedback de UX:** O dashboard exibirá estados claros de progresso: "Enviando foto...", "Refinando cenário...", "Renderizando estúdio...".

## 7. Segurança e Privacidade
- **Row Level Security (RLS):** Implementada no Supabase para garantir que usuários acessem apenas suas próprias imagens e dados de saldo.
- **Privacidade por Padrão:** Nenhuma imagem é pública a menos que explicitamente solicitado pelo usuário (não previsto para o MVP).

## 7. UI/UX Design & Branding
- **Estética Visual:** Estilo "Apple & Resend.com" (Dark Mode profundo, minimalismo extremo, contrastes nítidos).
- **Tipografia:** 
    - **Headers:** `Work Sans` (Pesos Bold/Semi-bold para impacto).
    - **Body:** `Helvetica` / `Inter` (Clareza e legibilidade técnica).
- **Paleta de Cores:** 
    - Background: `#020617` (Deep Night).
    - Bordas/Cards: `#1E293B` com gradientes sutis.
    - Call to Action: Branco puro ou `Emerald-500` para destaque.
- **Landing Page (Hero Section):**
    - **Foco Central:** Slider gigante interativo de "Antes/Depois" (Foto Amadora vs. Foto IA).
    - **Copywriting:** Headlines em `Work Sans` com espaçamento generoso.
- **Dashboard (Workstation):**
    - Layout "Bento Grid" organizado.
    - Dropzone minimalista inspirada no dashboard da Resend.
    - Visualização de resultados com slider comparativo integrado.

## 8. Estratégia de Implementação
O projeto será desenvolvido em fases:
1. **Fase 1:** Setup de infra (Next.js, Clerk, Supabase, Redis).
2. **Fase 2:** Fluxo de Geração (Upload -> Prompt Refiner -> Fal.ai -> Display).
3. **Fase 3:** Sistema de Pagamentos (Stripe Integration -> Créditos).
4. **Fase 4:** Polimento de UI/UX (Landing Page, Dash, Slider).

---
