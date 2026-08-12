# AFUPM Site Migration

Migração do site AFUPM (familias.org.br) de Wix Studio para **Next.js + Sanity CMS + Tailwind CSS**.

## Stack

- **Next.js 16** (App Router) — frontend SSR/SSG
- **Sanity CMS** — conteúdo editorial (projeto `d67qfgu8`)
- **Tailwind CSS 4** — estilização
- **next-intl** — internacionalização PT/ES
- **moment + moment-lunar** — calendário CIG (Cheon Il Guk)
- **Vercel** — deploy

## Setup no Codespace

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com as credenciais do Sanity

# 3. Rodar dev server
pnpm dev
```

## Estrutura

```
app/[locale]/          # Rotas PT e ES
  page.tsx             # Home (CIG + Palavra do Dia)
  sobre/[...slug]/     # Sobre (8 subpáginas)
  bencao/              # Bênção
  noticias/            # Blog listing
  post/[slug]/         # Blog post detail
  eventos/             # Eventos
  galeria/             # Galeria de fotos
  anuncios/            # Quadro de avisos
  sedes/               # Localizações
  studio/              # Sanity Studio (embutido)
lib/                   # Utilitários (lunar.ts, sanity.ts)
sanity/schemas/        # Schemas Sanity
messages/              # Traduções next-intl (pt.json, es.json)
components/            # Componentes React
.factory/mission/      # Artefatos da missão Droid
```

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID do projeto Sanity (`d67qfgu8`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (`production`) |
| `SANITY_API_TOKEN` | Token com permissão de escrita |

## Comandos

```bash
pnpm dev          # Dev server (porta 3000)
pnpm build        # Build de produção
pnpm typecheck    # Checagem de tipos
pnpm lint         # Lint
pnpm test         # Testes (Vitest)
```
