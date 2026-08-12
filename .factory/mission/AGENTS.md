# AGENTS.md — AFUPM Migration Mission

## Mission Boundaries (NEVER VIOLATE)

**Port Range:** 3000 only. Next.js dev server on port 3000.

**External Services:**
- Sanity project `d67qfgu8` — read/write via @sanity/client
- Supabase `maxfivbyozkpaouazesq` — NOT used in this mission (reserved for future auth)
- No other external APIs

**Off-Limits:**
- Do NOT modify Wix site (familias.org.br) — it's the source of truth for content migration
- Do NOT create Supabase tables or use Supabase — it's for future auth only

## Mission Directives

**Tools:**
- `pnpm` for package management
- `npx sanity` CLI for Sanity operations
- `npx next` for Next.js dev server
- `npx vitest` for testing

**Dependencies:**
- next 14.x, react 18.x, typescript 5.x
- tailwindcss 3.x, @tailwindcss/typography
- next-intl 3.x
- sanity 3.x, @sanity/client, @sanity/image-url, next-sanity
- moment, moment-lunar (for CIG calendar)
- vitest (testing)

**Skills:**
- `mission-worker-base` — invoked at session start (automatic)
- `fullstack-worker` — invoked for all implementation features

**Other:**
- All pages use `[locale]` prefix (pt, es). Default locale: pt.
- Content is bilingual — Sanity documents have a `language` field.
- UI strings use next-intl message files (messages/pt.json, messages/es.json).
- Server Components by default. Client Components only for interactivity.
- Sanity Studio is embedded at `/studio` route.

## Coding Conventions

- TypeScript strict mode
- Functional components with named exports
- Sanity schemas in `sanity/schemas/` directory
- GROQ queries co-located with the components that use them
- Tailwind utility classes; no CSS modules
- Path aliases: `@/` maps to project root
- Commit messages in English, descriptive
- Each page component fetches its own data (no prop drilling across routes)

## Testing & Validation Guidance

- Run `pnpm typecheck && pnpm lint && pnpm test` before handoff
- Test CIG calendar logic in isolation (pure functions)
- Test Sanity GROQ queries against the real Sanity dataset (no mocks)
- Verify all pages render in both PT and ES locales
- agent-browser is the primary validation tool for user-facing flows
