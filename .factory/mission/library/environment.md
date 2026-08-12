# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required env vars, external API keys/services, dependency quirks, platform-specific notes.
**What does NOT belong here:** Service ports/commands (use `services.yaml`).

---

## Required Environment Variables

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `d67qfgu8` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Sanity dataset |
| `SANITY_API_TOKEN` | (user-provided) | Token with write access for content migration |

## External Services

- **Sanity:** Project `d67qfgu8`, dataset `production`. Managed at sanity.io/manage.
- **Vercel:** Deployment target. Domain: familias.org.br.
- **Supabase:** Project `maxfivbyozkpaouazesq`. Reserved for future auth — NOT used in this mission.

## Node.js Environment

- Node v22.23.2
- pnpm 11.18.0
- 8 CPU cores, 7.5 GiB RAM (2 GiB available)
