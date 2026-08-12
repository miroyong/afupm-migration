# User Testing

Testing surface, required testing skills/tools, and resource cost classification.

## Validation Surface

- **Browser (agent-browser):** All pages rendered in Next.js dev server. Navigate, interact, verify content and i18n.
- **No CLI or API surface** — this is a content website, not an API product.

## Required Testing Tools

- `agent-browser` — primary validation tool for all user-facing flows
- `curl` — healthcheck and static verification

## Validation Prerequisites

- Next.js dev server running on port 3000 (`pnpm dev`)
- Sanity dataset populated with content (or seeded with test data)
- Both locales (pt, es) accessible

## Validation Concurrency

**Surface: agent-browser (Next.js SSG/SSR site)**
- The Next.js dev server is lightweight (~200 MB RAM)
- Each agent-browser instance adds ~300 MB
- Available headroom: 2.0 GiB × 0.7 = ~1.4 GiB
- Max concurrent validators: **5** (5 × 300 MB + 200 MB = 1.7 GiB, within budget)

## Testing Isolation

- Content is read from Sanity (shared). Validators should test against the production dataset.
- No state mutation during testing (all pages are read-only).
- Parallel validators can run safely — each tests independent pages.
