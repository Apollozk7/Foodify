# 1. OBJECTIVE

Analisar o repositório "Estúdio IA Pro" e identificar melhorias possíveis em termos de qualidade de código, developer experience (DX), testes, CI/CD e configurações do projeto.

# 2. CONTEXT SUMMARY

O repositório é uma aplicação **Next.js 16** com React 19, TypeScript e Tailwind CSS para transformar fotos culinárias em imagens profissionais usando IA. A aplicação utiliza:

- Clerk para autenticação
- Stripe para pagamentos
- Supabase como banco de dados
- FAL.ai para geração de imagens
- Upstash Redis para cache
- Resend para emails

### Arquivos e componentes identificados:

- `package.json`: dependencies e scripts limitados (sem teste)
- `vitest.config.ts`: configurado mas subutilizado
- `eslint.config.mjs`: configuração básica
- `src/env.ts`: validação de variáveis com zod
- Arquivos de teste existem (`*.test.ts`) mas não há script para rodá-los

# 3. APPROACH OVERVIEW

A análise foi feita explorando a estrutura do projeto, arquivos de configuração e dependências. Identifiquei 8 áreas principais de melhoria:

1. **Testes** - Vitest configurado mas sem script no package.json
2. **Prettier** - Não há configuração de formatação
3. **Git Hooks** - Não há validação antes de commits
4. **CI/CD** - Não há GitHub Actions
5. **Dockerfile** - Faltando container para produção
6. **.env.example** - Faltando template de variáveis
7. **TypeScript** - Configuração pode ser melhorada
8. **Railway** - Configuração pode ser otimizada

# 4. IMPLEMENTATION STEPS

## Step 1: Scripts de Teste (Alta Prioridade)

- **Goal**: Permitir execução de testes unitários
- **Method**: Adicionar scripts "test", "test:run" e "test:coverage" no package.json
- **Reference**: package.json

## Step 2: Arquivo .env.example (Alta Prioridade)

- **Goal**: Facilitar configuração de variáveis de ambiente para novos desenvolvedores
- **Method**: Criar arquivo com todas as variáveis necessárias (sem valores reais)
- **Reference**: src/env.ts (para listar todas as variáveis)

## Step 3: CI/CD com GitHub Actions (Alta Prioridade)

- **Goal**: Validar código automaticamente em push/pull requests
- **Method**: Criar .github/workflows/ci.yml com steps: checkout, setup-node, install, lint, build, test
- **Reference**: railway.json (referência para ambiente)

## Step 4: Prettier para Formatação (Média Prioridade)

- **Goal**: Padronizar formato do código automaticamente
- **Method**:
  1. Instalar prettier como devDependency
  2. Criar .prettierrc com configurações do projeto
  3. Adicionar scripts "format" e "format:check"
  4. Integrar com ESLint usando eslint-config-prettier
- **Reference**: eslint.config.mjs

## Step 5: Git Hooks com Husky (Média Prioridade)

- **Goal**: Validar código antes de commits
- **Method**:
  1. Instalar e configurar husky
  2. Criar pre-commit hook que executa lint, format:check e test
- **Reference**: package.json

## Step 6: Dockerfile para Produção (Média Prioridade)

- **Goal**: Permitir deploy em containers
- **Method**: Criar Dockerfile multi-stage otimizado para Next.js
- **Reference**: next.config.mjs

## Step 7: Melhorias no TypeScript (Baixa Prioridade)

- **Goal**: Aumentar rigor na verificação de tipos
- **Method**: Adicionar strict mode options (noUnusedLocals, noUnusedParameters)
- **Reference**: tsconfig.json

## Step 8: Otimizar Railway Config (Baixa Prioridade)

- **Goal**: Melhorar configuração de deploy
- **Method**: Revisar e adicionar variáveis necessárias no railway.json
- **Reference**: railway.json

# 5. TESTING AND VALIDATION

Para validar a implementação:

1. **Testes**: Executar `npm run test` - deve rodar os testes existentes sem erros
2. **Lint**: Executar `npm run lint` - deve passar sem erros
3. **Build**: Executar `npm run build` - deve compilar sem erros
4. **CI**: GitHub Actions deve executar em push/pull requests
5. **Formato**: `npm run format:check` deve validar formatação do código
