# Architecture: AFUPM Site Migration (Wix → Next.js + Sanity)

## Overview

This mission migrates the AFUPM institutional website (familias.org.br) from Wix Studio to a modern, free-stack architecture: **Next.js 14 App Router + Sanity CMS + Tailwind CSS**, deployed on **Vercel**.

The site is bilingual (PT/ES), content-heavy, and includes dynamic features like the CIG lunar calendar and a daily rotating phrase from a CMS collection.

## System Components

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 14 (App Router)               │  │
│  │                                                    │  │
│  │  app/[locale]/                                     │  │
│  │  ├── layout.tsx        Global layout (header/nav,  │  │
│  │  │                       footer, i18n provider)    │  │
│  │  ├── page.tsx          Home page                   │  │
│  │  ├── sobre/[...slug]/  About subpages (8 routes)  │  │
│  │  ├── bencao/           Bênção page                 │  │
│  │  ├── noticias/         Blog listing                │  │
│  │  ├── post/[slug]/      Blog post detail            │  │
│  │  ├── eventos/          Events listing              │  │
│  │  ├── galeria/          Photo gallery               │  │
│  │  ├── anuncios/         Announcements               │  │
│  │  ├── sedes/            Locations                   │  │
│  │  └── studio/           Sanity Studio (embedded)    │  │
│  │                                                    │  │
│  │  lib/                                              │  │
│  │  ├── sanity.ts         Sanity client (query/parse) │  │
│  │  ├── lunar.ts          CIG calendar logic          │  │
│  │  └── i18n.ts           next-intl configuration     │  │
│  │                                                    │  │
│  │  sanity/                                           │  │
│  │  ├── schemas/          Document type definitions   │  │
│  │  └── sanity.config.ts  Studio configuration        │  │
│  │                                                    │  │
│  │  messages/                                          │  │
│  │  ├── pt.json           Portuguese translations     │  │
│  │  └── es.json           Spanish translations        │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                    ┌────▼─────┐                          │
│                    │  Sanity   │  (cloud CMS)            │
│                    │  Project  │                          │
│                    │  d67qfgu8 │                          │
│                    └──────────┘                          │
└─────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Next.js App Router
- **Routing:** File-based with `[locale]` prefix (pt, es). Root layout redirects to default locale.
- **Data fetching:** Server Components query Sanity via GROQ at request time. Static pages use `generateStaticParams` for SSG.
- **i18n:** `next-intl` provides translations for UI strings. Content is stored in Sanity with a `language` field.
- **Dynamic features:** CIG calendar is pure client-side JS (moment + moment-lunar). Word of the day queries Sanity on the server.

### Sanity CMS
- **Content storage:** All editorial content (pages, posts, events, gallery, words, settings).
- **Studio:** Embedded at `/studio` route, accessible only to authenticated Sanity users.
- **Image pipeline:** Sanity's image CDN handles optimization and transforms.

### Data Flow

```
Editor → Sanity Studio → Sanity Content Lake → GROQ query → Next.js Server Component → HTML → Browser
                                                                                              │
                                                        CIG Calendar ← moment-lunar ← client JS
                                                        Word of Day ← Sanity query ← server
```

## Content Model (Sanity Schemas)

### page
Static content pages (sobre/*, bencao, anuncios, sedes).
- `title` (string, required)
- `slug` (slug, required)
- `body` (block content, required)
- `language` (string: "pt" | "es", required)

### post
Blog/news posts.
- `title` (string, required)
- `slug` (slug, required)
- `excerpt` (text)
- `body` (block content, required)
- `mainImage` (image)
- `categories` (array of references to postCategory)
- `tags` (array of strings)
- `publishedAt` (datetime, required)
- `language` (string: "pt" | "es", required)
- `featured` (boolean)

### postCategory
Blog categories (Notícias Nacionais, Informe HJ, Distrito 1/2/3).
- `title` (string, required)
- `slug` (slug, required)

### wordOfTheDay
Daily rotating phrases (migrated from TrueParentsWordsSlideshow).
- `phrase` (text, required)
- `order` (number, required) — determines rotation sequence
- `language` (string: "pt" | "es")

### galleryImage
Photo gallery with bilingual toggle.
- `image` (image, required)
- `alt` (string, required)
- `language` (string: "pt" | "es", required)
- `order` (number)

### event
Events listing.
- `title` (string, required)
- `slug` (slug, required)
- `description` (block content)
- `date` (datetime, required)
- `endDate` (datetime)
- `location` (string)
- `image` (image)
- `language` (string: "pt" | "es", required)

### video
Embedded videos (YouTube).
- `title` (string, required)
- `url` (url, required)
- `language` (string: "pt" | "es", required)

### siteSettings
Global site configuration (singleton).
- `siteName` (string)
- `siteDescription` (text)
- `socialLinks` (object with youtube, instagram fields)
- `footerText` (text)

## Key Design Decisions

1. **Sanity-only (no Supabase yet):** All content in Sanity. Supabase reserved for future members/auth area.
2. **Embedded Sanity Studio:** Single Next.js app serves both frontend and CMS, reducing deployment complexity.
3. **Server Components by default:** Pages are Server Components that fetch from Sanity. Client Components only where interactivity is needed (CIG calendar, gallery toggle, search).
4. **Static generation where possible:** Content pages use `generateStaticParams` for SSG at build time. Blog and events use ISR (`revalidate`).
5. **next-intl for i18n:** Industry-standard for Next.js App Router i18n. UI strings in message files; content in Sanity with language field.
6. **Tailwind CSS:** Utility-first CSS, consistent with modern Next.js patterns.

## Port Boundaries

- **Next.js dev server:** port 3000
- **No other local services needed** (Sanity and Vercel are cloud)

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 14.x (App Router) |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| CMS | Sanity | 3.x |
| i18n | next-intl | 3.x |
| Calendar | moment + moment-lunar | latest |
| Testing | Vitest | latest |
| Package manager | pnpm | latest |
| Deployment | Vercel | — |
