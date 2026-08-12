---
name: fullstack-worker
description: Full-stack feature implementation for AFUPM migration — Next.js pages, Sanity schemas, i18n, and content components.
---

# Fullstack Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## Required Skills and Tools

- `pnpm` for package management
- `npx next dev` for development server
- `npx vitest` for testing
- `agent-browser` for manual verification

## Work Procedure

### 1. Understand the Feature
- Read the feature description, `architecture.md`, and `library/sanity-schemas.md`
- Identify which pages, Sanity schemas, and i18n strings are needed
- Identify which Sanity dataset to query (production)

### 2. Test-Driven Development
- Write failing tests FIRST before any implementation
- For pure logic (CIG calendar, date formatting): unit tests with Vitest
- For Sanity schemas: verify they compile and validate
- For pages: verify they render in both locales without errors

### 3. Implementation
- **Sanity schemas** go in `sanity/schemas/` — follow patterns in `library/sanity-schemas.md`
- **Pages** go in `app/[locale]/` — use Server Components, fetch from Sanity via GROQ
- **Components** go in `components/` — Client Components only when interactivity needed
- **i18n** strings go in `messages/pt.json` and `messages/es.json`
- **GROQ queries** are co-located with the page/component that uses them
- Reference `architecture.md` for the complete system design

### 4. Manual Verification
- Start dev server: `pnpm dev`
- Verify each page renders in PT and ES locales
- Take screenshots of key pages
- Verify navigation works (header links, language switcher)
- Test responsive layout at mobile breakpoint

### 5. Programmatic Verification
- Run `pnpm typecheck` — must pass with zero errors
- Run `pnpm lint` — must pass with zero errors
- Run `pnpm test` — all tests must pass

### 6. Handoff
- Commit all changes with descriptive message
- Include commit ID in handoff

## Example Handoff

```json
{
  "salientSummary": "Implemented home page with CIG lunar calendar, Palavra do Dia (daily rotation), and hero section. Created wordOfTheDay Sanity schema, lunar.ts utility, and PT/ES i18n strings. All 8 Vitest tests pass, page renders correctly in both locales.",
  "whatWasImplemented": "Home page at app/[locale]/page.tsx with three sections: CIG lunar calendar (client component using moment-lunar), Palavra do Dia (server component fetching from Sanity wordOfTheDay collection with daily index rotation), and hero section (server component with static content). Created Sanity schemas: wordOfTheDay, siteSettings. Added i18n strings for home page UI in messages/pt.json and messages/es.json. Created lib/lunar.ts with formatLunarDate and formatSolarDate utilities.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "pnpm typecheck", "exitCode": 0, "observation": "No type errors" },
      { "command": "pnpm lint", "exitCode": 0, "observation": "No lint errors" },
      { "command": "pnpm test", "exitCode": 0, "observation": "8 tests passed: 4 for lunar.ts, 4 for wordOfTheDay query" }
    ],
    "interactiveChecks": [
      { "action": "Open /pt — verify CIG date, solar date, and word of the day render", "observed": "All three sections render correctly. CIG shows '29º dia do 6º mês do 14º ano do CIG'. Word of the day shows a phrase from Sanity." },
      { "action": "Switch to /es — verify Spanish translations", "observed": "CIG shows '29º día del 6º mes del 14º año del CIG'. UI elements in Spanish." },
      { "action": "Screenshot home page PT and ES", "observed": "Both locales render identically in layout, content correctly localized." }
    ]
  },
  "tests": {
    "added": [
      { "file": "lib/__tests__/lunar.test.ts", "cases": [
        { "name": "formats CIG date correctly for Portuguese", "description": "Given a date in 2026, returns PT format with correct CIG year (gregorian year - 2012)" },
        { "name": "formats CIG date correctly for Spanish", "description": "Given a date in 2026, returns ES format with día/mes/año" },
        { "name": "handles January (lunar year boundary)", "description": "Early January dates may belong to previous lunar year" },
        { "name": "returns fallback on error", "description": "When moment-lunar throws, returns fallback text in correct language" }
      ]},
      { "file": "lib/__tests__/wordOfDay.test.ts", "cases": [
        { "name": "returns correct phrase for today's index", "description": "Given a fixed date and a list of phrases, returns the phrase at (days since epoch % total)" },
        { "name": "handles empty collection", "description": "Returns fallback text when Sanity returns no phrases" },
        { "name": "wraps around correctly", "description": "When day index exceeds collection size, wraps to beginning" }
      ]}
    ]
  },
  "discoveredIssues": [],
  "commitId": "abc123def456"
}
```

## When to Return to Orchestrator

- Feature depends on a Sanity schema that doesn't exist yet
- Sanity API token is missing and content can't be created
- Requirements are ambiguous or contradictory about content layout/navigation
- Package installation fails or conflicts
