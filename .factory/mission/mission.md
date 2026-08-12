# Replicar site AFUPM (Wix → Next.js + Sanity)

# Replicar site AFUPM — Wix Studio → Next.js + Sanity

## Plan Overview

Migrar o site institucional da AFUPM (familias.org.br) do Wix Studio para uma stack moderna e gratuita: **Next.js 14 + Sanity CMS + Tailwind CSS**, hospedado na Vercel. O site preserva 100% das funcionalidades atuais (calendário CIG, palavra do dia, blog, galeria bilíngue, eventos) com Sanity como CMS headless para edição de conteúdo. Supabase fica reservado para a futura área de membros.

## Expected Functionality

### Milestone 1: Foundation + Home (~2 dias)
- Scaffold Next.js 14 App Router + TypeScript + Tailwind CSS + `next-intl` (PT/ES)
- Sanity Studio embutido em `/studio`
- Schemas Sanity: `wordOfTheDay`, `siteSettings`
- Layout global: header com navegação, footer, troca de idioma
- Home page: CIG calendar (cálculo lunar), Palavra do Dia (rotação diária), hero section
- Deploy inicial na Vercel

### Milestone 2: Content Pages + Blog (~2 dias)
- Schemas Sanity: `page`, `post`, `postCategory`
- Páginas: `/sobre/[...slug]` (8 subpáginas), `/bencao`, `/anuncios`, `/sedes`
- Sistema de blog: listagem, categorias (Notícias Nacionais, Informe HJ, Distritos), página de post
- Migração dos 11 posts existentes + tags
- Breadcrumbs e navegação entre páginas

### Milestone 3: Media + Events (~1.5 dias)
- Schemas Sanity: `galleryImage`, `event`, `video`
- Galeria de fotos com toggle PT/ES
- Embed de vídeos (YouTube)
- Página de eventos com listagem
- Busca no site
- Links externos (Instagram, YouTube, purewaterwave.org)

### Milestone 4: Migration + Launch (~1.5 dias)
- Migração completa de conteúdo Wix → Sanity (importação via CLI)
- SEO: metadata, og:image, sitemap, robots.txt
- Configuração de domínio familias.org.br na Vercel
- Testes cross-browser e mobile
- Polish visual (animações, transições, responsividade)

## Architecture

```
┌─────────────────────────────────────────────┐
│                 Vercel                       │
│  ┌──────────────────────────────────────┐   │
│  │     Next.js 14 (App Router)           │   │
│  │                                       │   │
│  │  app/[locale]/                        │   │
│  │  ├── layout.tsx      (header/footer)  │   │
│  │  ├── page.tsx        (Home)           │   │
│  │  ├── sobre/[...slug] (8 subpáginas)   │   │
│  │  ├── bencao/         (Bênção)         │   │
│  │  ├── noticias/       (Blog list)      │   │
│  │  ├── post/[slug]/    (Blog post)      │   │
│  │  ├── eventos/        (Eventos)        │   │
│  │  ├── galeria/        (Galeria)        │   │
│  │  ├── anuncios/       (Avisos)         │   │
│  │  ├── sedes/          (Sedes)          │   │
│  │  └── studio/[[...tool]] (Sanity)      │   │
│  │                                       │   │
│  │  lib/                                 │   │
│  │  ├── sanity.ts       (Sanity client)  │   │
│  │  ├── lunar.ts        (CIG calendar)   │   │
│  │  └── i18n.ts         (next-intl)      │   │
│  │                                       │   │
│  │  sanity/                              │   │
│  │  ├── schemas/        (document types) │   │
│  │  └── sanity.config.ts                 │   │
│  └──────────────────────────────────────┘   │
│                      │                       │
│                 ┌────▼────┐                  │
│                 │  Sanity  │                  │
│                 │  (CMS)   │                  │
│                 └─────────┘                  │
└─────────────────────────────────────────────┘
```

**Content Model (Sanity):**

| Document Type | Fields | Purpose |
|---|---|---|
| `page` | title, slug, body (block content), language | Static pages |
| `post` | title, slug, body, excerpt, category, tags, publishedAt, featuredImage, language | Blog posts |
| `postCategory` | title, slug | Blog categories |
| `wordOfTheDay` | phrase, order | Daily rotating phrase |
| `galleryImage` | image, alt, language (pt/es) | Photo gallery |
| `event` | title, description, date, location, image | Events |
| `video` | title, url (YouTube), language | Embedded videos |
| `siteSettings` | siteName, socialLinks, footerText | Global config |

## Environment Setup

1. **Contas já existentes:** Sanity (`d67qfgu8`), Supabase (`maxfivbyozkpaouazesq`)
2. **Node.js:** v22.23.2, pnpm 11.18.0 (já instalado)
3. **Vercel:** Deploy via GitHub + Vercel CLI
4. **Domínio:** familias.org.br (configurar na Vercel)

## Infrastructure

**Serviços em desenvolvimento:**
- Next.js dev server: porta 3000
- Sanity Studio: embutido no Next.js (mesma porta)

**Sem dependências locais:** Sanity e Vercel são serviços cloud.

**Off-limits:** Nenhuma restrição específica — projeto greenfield.

## Testing Strategy

- **Unitários:** Testes com Vitest para funções críticas (CIG calendar, formatação de datas)
- **Componentes:** Verificação visual no dev server
- **Integração:** Sanity GROQ queries testadas contra o dataset real
- **Milestone gate (scrutiny):** `pnpm typecheck && pnpm lint && pnpm test`
- **User testing (agent-browser):** Navegação completa pelo site, troca PT/ES, verificação de todas as páginas e funcionalidades

## User Testing Strategy

- **Superfície:** Navegador (agent-browser)
- **Fluxos:** Home → Sobre → Blog → Galeria → Eventos, troca PT↔ES
- **Verificações:** CIG calendar mostra data correta, palavra do dia rotaciona, blog lista posts, galeria alterna por idioma
- **Concorrência:** Até 5 validadores agent-browser em paralelo (app é SSG/SSR leve, ~300MB por instância)

## Non-functional Requirements

- Performance: Lighthouse ≥ 90
- Responsivo: Mobile-first (Tailwind breakpoints)
- SEO: Metadata por página, sitemap.xml, robots.txt
- Acessibilidade: HTML semântico, ARIA labels
- i18n: URLs com prefixo de locale (/pt/..., /es/...), redirect automático
