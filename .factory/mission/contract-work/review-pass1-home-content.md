# Contract Review — Home + Content/Blog: Missing Assertions

Review of `/root/.factory/missions/e54118e9-6e77-4965-9f3c-39b3fe629207/validation-contract.md`
Sections reviewed: VAL-HOME-*, VAL-CONTENT-*, VAL-BLOG-*, VAL-XCUT-*
Existing assertions in scope: 46 (HOME: 20, CONTENT: 11, BLOG: 13, XCUT: 2)

---

## Missing User Flows

### MISSING: Hero call-to-action click behavior
**Area:** HOME
**Suggested ID:** VAL-HOME-021
The hero section is validated for visual rendering only (VAL-HOME-016). No assertion covers whether the hero contains interactive elements (CTA buttons, links) or where they lead. If the hero has a "Saiba mais" / "Learn more" button or a donation/contact CTA, its destination and behavior must be validated. A hero without validated interactivity is a dead end for the primary landing flow.

### MISSING: Word of the Day click behavior
**Area:** HOME
**Suggested ID:** VAL-HOME-022
The Word of the Day section is validated for data loading and rotation (VAL-HOME-011 through VAL-HOME-015), but no assertion covers what happens when a user clicks or taps the phrase. Does it link to an archive page? A detail view with an explanation? Is it non-interactive display-only? This is a gap in the primary user interaction model for a prominent home-page element.

### MISSING: Home page recent content previews (blog posts, events)
**Area:** HOME
**Suggested ID:** VAL-HOME-023
Many organization home pages surface recent blog posts, upcoming events, or announcements. The contract does not mention whether the home page includes previews/teasers from other sections (recent notícias, próximos eventos). If the original Wix site has these, their absence is a migration regression. If intentionally absent, this should be stated as a scope exclusion.

### MISSING: CIG calendar section — explanation link or tooltip
**Area:** HOME
**Suggested ID:** VAL-HOME-024
The CIG lunar calendar is a specialized date system unfamiliar to most visitors. No assertion covers whether the CIG section provides an explanation link ("O que é o CIG?"), a tooltip, or a link to an about page describing the Cheon Il Guk calendar. If the original Wix site has explanatory content for the calendar, its presence or absence in the migration must be validated.

### MISSING: Word of the Day midnight crossover behavior
**Area:** HOME
**Suggested ID:** VAL-HOME-025
The Word of the Day rotates daily at UTC midnight (epoch-based in VAL-HOME-013). If a user has the home page open when the UTC date rolls over, the displayed phrase may become stale. The contract should specify the expected behavior: (a) the phrase stays frozen until the next full page load, (b) a client-side timer updates it at midnight, or (c) a "new phrase available" indicator appears. Without this, the user experience at day boundary is undefined.

### MISSING: Content page with embedded YouTube videos in portable text
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-012
VAL-CONTENT-010 validates images, bold/italic, links, and lists within portable text, but omits embedded video blocks. If a content page (e.g., `/pt/bencao`) includes YouTube embeds in its Sanity body field, the rendering of `<iframe>` elements within portable text must be validated. CSP must not block the embed, and the iframe must be responsive.

### MISSING: Blog post detail — related/suggested posts
**Area:** BLOG
**Suggested ID:** VAL-BLOG-014
Most blogs display related or suggested posts at the bottom of a post detail page (by same category, by tag, or recent). No assertion covers whether the post detail page includes a "Leia também" / "Read also" section that links to other posts. This is a primary content-discovery flow and its absence is a significant UX gap.

### MISSING: Blog post detail — social sharing buttons
**Area:** BLOG
**Suggested ID:** VAL-BLOG-015
Given the organization's presence on YouTube and Instagram (validated in VAL-GALLERY-007), blog posts likely warrant social sharing. No assertion covers whether share buttons (Facebook, Twitter, WhatsApp, Telegram — WhatsApp is critical for Brazilian audiences) are present on post detail pages. Share URLs, share text, and OG meta tag correctness for shared previews should be validated.

### MISSING: Blog listing — search/filter by text within blog
**Area:** BLOG
**Suggested ID:** VAL-BLOG-016
VAL-CROSS-011 covers site-wide search generically. But the blog listing itself may have a text search input scoped to blog posts (title + excerpt + body). No assertion covers whether the blog listing at `/pt/noticias` has a search bar that filters posts by keyword, or whether the category filter is the only filtering mechanism.

### MISSING: Blog post — author display
**Area:** BLOG
**Suggested ID:** VAL-BLOG-017
The contract does not mention author information at all. If the Sanity `post` schema includes an `author` field (reference or string), the post detail page should display it. Even if author is absent from the schema, this should be confirmed as an intentional omission rather than an oversight.

### MISSING: Blog post — estimated reading time
**Area:** BLOG
**Suggested ID:** VAL-BLOG-018
Reading time estimates ("X min de leitura") are a common blog UX pattern. If present on the original Wix site or expected in the migration, this should be validated on both listing cards and the detail page.

### MISSING: Content page — table of contents for long-form content
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-013
Pages like `/pt/sobre/historia` or `/pt/sobre/escrituras` may contain long-form content with multiple heading levels. If the page includes a table of contents or anchor-link navigation generated from portable text headings, this must be validated. If absent by design, it should be noted.

### MISSING: Sedes page — map embed or address formatting
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-014
VAL-CONTENT-006 only validates that `/pt/sedes` renders with "location information." If the page includes embedded Google Maps, address blocks, contact phone numbers, or district-specific sections (matching the original Wix site's 3 districts), each of these must be validated. The current assertion is too vague to catch regressions.

### MISSING: Anuncios — nature of content (single page vs. listing)
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-015
VAL-CONTENT-005 treats Anuncios as a single content page. But "Quadro de Avisos" (Bulletin Board) may be a chronological listing of announcements — similar to blog posts but for time-sensitive notices. If the original Wix site has multiple announcements with dates, the migration should replicate this as a listing, not a static page. The contract should validate this distinction.

### MISSING: Blog listing — sort options beyond newest-first
**Area:** BLOG
**Suggested ID:** VAL-BLOG-019
VAL-BLOG-001 mandates newest-first ordering. No assertion covers whether users can change the sort order (oldest first, alphabetical by title). If the original site offers sort controls, this is a regression. If not, it should be stated as a scope exclusion.

### MISSING: Blog RSS/Atom feed
**Area:** BLOG
**Suggested ID:** VAL-BLOG-020
Organizational blogs frequently offer RSS/Atom feeds for syndication. If the original Wix site has an RSS feed, the migration must provide one at a predictable URL (e.g., `/pt/noticias/rss.xml`). If out of scope, this should be explicitly noted.

### MISSING: Browser back/forward navigation across home, content, and blog
**Area:** HOME + CONTENT + BLOG
**Suggested ID:** VAL-XCUT-003
No assertion validates that the browser's back and forward buttons work correctly across the full navigation graph: home → blog listing → post detail → content page → about subpage → home. Client-side navigation via Next.js `<Link>` must integrate correctly with the History API so back/forward restore scroll position and page state.

### MISSING: Deep-link bookmarking and direct URL access
**Area:** HOME + CONTENT + BLOG
**Suggested ID:** VAL-XCUT-004
Users bookmark deep URLs (`/pt/post/algum-artigo`, `/es/sobre/historia`) and return to them later. No assertion validates that a cold load (no client-side cache, no prior session) of any deep URL renders the complete page with all data (not a loading skeleton that never resolves, not a hydration mismatch). This is distinct from VAL-CONTENT-009 and VAL-BLOG-009 which only cover non-existent URLs.

### MISSING: Keyboard navigation — tab order and focus indicators
**Area:** HOME + CONTENT + BLOG (Accessibility)
**Suggested ID:** VAL-XCUT-005
No assertion covers keyboard navigation: tab order through nav links, skip-to-content link, focus rings on interactive elements, and whether the hamburger menu is operable via keyboard (Enter/Escape). These are WCAG baseline requirements.

### MISSING: Screen reader heading hierarchy
**Area:** HOME + CONTENT + BLOG (Accessibility)
**Suggested ID:** VAL-XCUT-006
No assertion validates the heading hierarchy (h1 → h2 → h3 without skipping levels) on any page. A screen reader user must be able to navigate by headings. The home page should have exactly one h1; content pages and blog posts should have a single h1 for the page/post title. VAL-CONTENT-002 mentions `<h1>` for about subpages but does not check hierarchy.

### MISSING: Print styles for content pages and blog posts
**Area:** CONTENT + BLOG
**Suggested ID:** VAL-XCUT-007
Users may print content pages or blog posts. No assertion validates that print stylesheets hide navigation, footer, and sidebars while preserving readable typography. Printed output should show the page title, body content, and URL. This is especially relevant for content like "Resolução" or "Escrituras."

### MISSING: Scroll position restoration on browser back
**Area:** HOME + CONTENT + BLOG
**Suggested ID:** VAL-XCUT-008
When a user scrolls down the blog listing, clicks a post, then presses back, the scroll position on the listing page should be restored. Next.js handles this by default with the pages router but behavior with `app` router can vary. This must be validated.

---

## Missing Error States

### MISSING: Word of the Day — malformed or missing body field
**Area:** HOME
**Suggested ID:** VAL-HOME-026
VAL-HOME-014 covers empty collection and VAL-HOME-015 covers single-document collections. But what if a wordOfTheDay document exists but has a `null` body, an empty string body, or a body containing only whitespace? What if the body field is absent from the document entirely? The page must render a graceful fallback without displaying "null," "undefined," or a blank card.

### MISSING: Word of the Day — excessively long phrase text
**Area:** HOME
**Suggested ID:** VAL-HOME-027
If a wordOfTheDay document has a body field with thousands of characters (e.g., a multi-paragraph essay), the home page layout must not break. Text should either be truncated with an ellipsis or the card should expand to accommodate it without overlapping adjacent sections (hero, CIG calendar, solar date).

### MISSING: Word of the Day — special characters and RTL content in phrase
**Area:** HOME
**Suggested ID:** VAL-HOME-028
If a wordOfTheDay document contains special characters (emoji, Unicode symbols, HTML entities, angle brackets), they must render correctly without XSS vectors. If the phrase text contains characters outside Latin-1 (e.g., Korean Hangul for Cheon Il Guk terms, Japanese, Arabic), they must render without garbled text or font fallback issues.

### MISSING: CIG calendar — system clock skew or extreme timezone offset
**Area:** HOME
**Suggested ID:** VAL-HOME-029
The CIG calendar and solar date rely on the client's system clock. If the user's clock is significantly skewed (hours or days off) or the timezone offset is extreme (UTC+14, UTC-12), the displayed dates may be incorrect relative to Brazil's timezone (UTC-3). The contract should specify which timezone the CIG date calculation uses (client-local? UTC? Brazil/America-Sao_Paulo?). VAL-HOME-008 says "system clock of the client browser" but this is ambiguous about timezone.

### MISSING: Content page — Sanity returns null/undefined for a valid slug
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-016
If a slug exists in the Sanity dataset but the GROQ query returns `null` (e.g., the document is a draft, or the `language` filter excludes it), the page must not crash with a "Cannot read properties of null" error. It should return either a 404 or a localized "content unavailable" message. VAL-CONTENT-009 covers non-existent slugs but not slugs that resolve to null results.

### MISSING: Content page — portable text block with unknown/unsupported type
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-017
Sanity portable text can contain custom block types defined in the schema. If a content page includes a block type that the frontend's portable text serializer does not handle (e.g., a new `callout` type added after initial development), the page must not crash. It should either skip the unknown block silently or render a fallback (raw text if available), not throw an unhandled React error.

### MISSING: Content page — very large body (hundreds of blocks)
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-018
If a content page has an extremely long body (e.g., 500+ portable text blocks for a page like `/pt/sobre/escrituras`), the page must render completely without truncation, without excessive DOM nodes causing layout thrash, and within a reasonable time. The GROQ query must not hit Sanity's default document-size limits.

### MISSING: Content page — missing optional fields (body, excerpt)
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-019
VAL-CONTENT-002 requires "at least one paragraph of visible text" but does not cover the case where a content page document has a title but zero body blocks. The page must render the title and a graceful empty body area without "undefined" or a blank white section. Similarly, if the `excerpt` or `mainImage` fields are null, they must not produce broken markup.

### MISSING: Blog post — missing optional fields (excerpt, mainImage, tags, category)
**Area:** BLOG
**Suggested ID:** VAL-BLOG-021
VAL-BLOG-003 says fields are "displayed if present" but only validates the positive case. A post with null excerpt, null mainImage, empty tags array, and null category must render without broken layout on both the listing card and the detail page. The post card on the listing must have a placeholder or text-only fallback when mainImage is absent.

### MISSING: Blog listing — all posts are drafts (no published posts)
**Area:** BLOG
**Suggested ID:** VAL-BLOG-022
If every post in Sanity has `_status: "draft"` or the GROQ filter for published posts returns zero results, the blog listing must show the empty-state message (like VAL-BLOG-006) for the unfiltered view as well. VAL-BLOG-006 only covers the filtered-category empty state.

### MISSING: Blog post detail — post with publishedAt in the future
**Area:** BLOG
**Suggested ID:** VAL-BLOG-023
If a post has `publishedAt` set to a future date (scheduled post), the GROQ query must exclude it from the listing. Direct URL access to a scheduled post should return 404 or a "not yet published" message. The current contract has no assertion distinguishing draft from scheduled.

### MISSING: Blog post — portable text with nested/interactive embeds
**Area:** BLOG
**Suggested ID:** VAL-BLOG-024
Blog post bodies may contain complex portable text: nested lists (3+ levels deep), blockquotes with citations, code blocks, horizontal rules, or embedded tweets/Instagram posts. Each block type must render correctly without raw JSON leakage. The contract only validates basic rich text on content pages (VAL-CONTENT-010), not blog posts.

### MISSING: Blog listing — category slug mismatch (URL vs Sanity value)
**Area:** BLOG
**Suggested ID:** VAL-BLOG-025
The category filter relies on matching URL query parameters to Sanity category references. If a category name contains special characters (spaces, accents: "Notícias Nacionais"), the URL encoding/decoding must be consistent. A mismatch between the URL-encoded slug and the Sanity category value could silently return zero results.

### MISSING: Blog post — slug with Portuguese/Spanish special characters
**Area:** BLOG
**Suggested ID:** VAL-BLOG-026
Post slugs may contain accented characters common in Portuguese and Spanish (ç, ã, õ, ñ, ü, é, á). The URL must be properly encoded, the GROQ query must match the slug correctly, and the browser must display the URL in a readable form (percent-encoded or decoded depending on browser). Slugs with leading/trailing hyphens or multiple consecutive hyphens should also be tested.

### MISSING: All Sanity-dependent pages — complete Sanity outage
**Area:** HOME + CONTENT + BLOG
**Suggested ID:** VAL-XCUT-009
VAL-HOME-020 covers wordOfTheDay timeout only. No assertion covers a complete Sanity API outage (all queries fail with 5xx, network error, or CDN unreachable). Every page that depends on Sanity (home, all content pages, blog listing, blog detail) must either render with cached/static fallback content or show a localized error message without crashing. Next.js ISR with stale-while-revalidate may mask this — the contract should specify whether stale cached pages are acceptable.

### MISSING: Sanity GROQ query hits document limit (100 default)
**Area:** CONTENT + BLOG
**Suggested ID:** VAL-XCUT-010
Sanity GROQ queries default to returning at most 100 documents. The blog listing query must include an explicit `[0...N]` slice with pagination. If the blog grows beyond 100 posts, the listing query must not silently truncate results. The content page listing (about subpages navigation) must not be affected, but the contract should validate that pagination correctly handles boundaries near the 100-document default.

### MISSING: Sanity image URL — very large source images
**Area:** HOME + CONTENT + BLOG
**Suggested ID:** VAL-XCUT-011
Sanity image URLs support transformation parameters (width, height, format). If a content editor uploads a 6000×4000px original image, the frontend must request a resized variant via Sanity's image URL builder, not the raw original. Failing to do so causes poor LCP and bandwidth waste. No assertion validates that `<img>` elements use Sanity image URL parameters (e.g., `?w=800&auto=format`).

---

## Missing Cross-Feature Interactions

### MISSING: Home → click Word of Day → destination page → back to home
**Area:** HOME → ??? → HOME
**Suggested ID:** VAL-XCUT-012
The Word of the Day is rendered on the home page, but its click target (if any) is undefined. If it links to a Word of the Day archive or detail page, the full round-trip flow must be validated: home → WOTD destination → back to home. If it does not link anywhere, this should be explicitly stated in scope.

### MISSING: Home → nav to blog → read post → nav to about → nav to home
**Area:** HOME → BLOG → CONTENT → HOME
**Suggested ID:** VAL-XCUT-013
A complete user journey spanning all three areas: landing on home, navigating via header to blog listing, clicking into a post, using the header to visit an about subpage, then returning home. Each transition must preserve the locale, the active nav state must update at each step, and no errors may accumulate in the console.

### MISSING: Blog post → click category → filtered listing preserves locale
**Area:** BLOG → BLOG
**Suggested ID:** VAL-XCUT-014
VAL-BLOG-011 validates that clicking a category on a post detail navigates to a filtered listing. But it does not verify that the locale is preserved through this navigation. From `/pt/post/artigo` clicking a category must go to `/pt/noticias?categoria=...`, not `/es/noticias?categoria=...`.

### MISSING: Language switch on blog filtered listing preserves filter state
**Area:** BLOG + i18n
**Suggested ID:** VAL-XCUT-015
When viewing `/pt/noticias?categoria=noticias-nacionais` and switching to Spanish, the URL should become `/es/noticias?categoria=noticias-nacionais` (preserving the category filter across locale switch). If the category doesn't exist in ES, a graceful empty state should appear. The contract does not cover filter-state preservation across locale switches.

### MISSING: Language switch on post detail page
**Area:** BLOG + i18n
**Suggested ID:** VAL-XCUT-016
When viewing `/pt/post/artigo-X`, switching to ES should navigate to `/es/post/artigo-X`. But the ES version may have a different slug (if slugs are language-specific) or may not exist at all. The contract should specify expected behavior when a post has no translation: redirect to blog listing with a message? Show the PT version as fallback? Return 404?

### MISSING: Search results spanning content pages and blog posts
**Area:** HOME + CONTENT + BLOG
**Suggested ID:** VAL-XCUT-017
VAL-CROSS-011 covers site search generically but does not validate that search returns results from BOTH content pages AND blog posts in a unified result set. A search for "fundadores" should return the `/pt/sobre/fundadores` page. A search for a blog post title should return that post. The result type (page vs. post) should be visually distinguishable.

### MISSING: Home page CIG calendar consistency when accessed via client-side navigation vs. direct URL
**Area:** HOME
**Suggested ID:** VAL-HOME-030
The CIG calendar computes the lunar date client-side (moment-lunar). If the user navigates to home via client-side routing from another page (no full reload), the computation may differ from a cold page load (e.g., stale `Date.now()` capture in a Server Component vs. fresh client-side render). The displayed CIG date must be identical regardless of how the home page was reached.

---

## Redundancy and Over-Specification

### REDUNDANT: VAL-HOME-013 algorithm is implementation detail, not behavioral contract
**Area:** HOME
**Suggested ID:** N/A (revision to VAL-HOME-013)
The assertion mandates `Math.floor((today − epoch) / msPerDay) % collectionSize` as the rotation formula. This is over-specified: the contract should require the behavior (same UTC date → same phrase; different UTC dates → deterministic rotation through the collection) without prescribing the exact algorithm. The epoch (2020-01-01) and use of `%` are implementation choices. If the team changes the rotation to use a seeded PRNG or a different epoch, the test breaks even though the behavior is still correct.

**Suggested rewrite:** "The phrase displayed must change each calendar day according to a deterministic rotation. The same UTC date must always return the same phrase across multiple page loads. A different UTC date must return a different phrase (or the same phrase only if the collection size is 1 or the rotation naturally cycles). The rotation must be based on calendar date, not request time or random selection."

### REDUNDANT: VAL-HOME-005 ordinal formatting partially duplicates VAL-HOME-003/004
**Area:** HOME
**Suggested ID:** N/A (merge into VAL-HOME-003/004)
VAL-HOME-003 and VAL-HOME-004 already define the exact format strings including the `º` ordinal indicator. VAL-HOME-005 then re-verifies the same `º` placement with additional detail about no-space. The no-space requirement ("1º" not "1 º") could be folded into VAL-HOME-003 and VAL-HOME-004 by adding one sentence to each: "The ordinal indicator `º` must appear directly adjacent to the number with no intervening space."

### REDUNDANT: VAL-HOME-010 format consistency is split across three assertions
**Area:** HOME
**Suggested ID:** N/A (restructure)
VAL-HOME-008 (PT format), VAL-HOME-009 (ES format), and VAL-HOME-010 (separators and padding) could be two assertions: one for locale-specific format strings, one for shared numeric formatting rules. The current three-way split creates overlap: VAL-HOME-010's zero-padding and separator requirements apply to both VAL-HOME-008 and VAL-HOME-009.

### REDUNDANT: VAL-HOME-001 and VAL-HOME-002 are structurally identical
**Area:** HOME
**Suggested ID:** N/A (consider parameterization)
These are the same test for PT and ES. While both locales must be validated, a parameterized approach ("Home page loads without console errors in both locales") would reduce duplication. This is minor but worth noting if the contract grows.

### OVER-SPECIFIED: VAL-BLOG-001(e) data-dependent count
**Area:** BLOG
**Suggested ID:** N/A (revision to VAL-BLOG-001)
The assertion says "if the dataset has 11 posts, all 11 should appear." This ties the test to a specific data count that may change as content editors add or remove posts. The contract should instead require that all published posts for the locale appear (paginated if necessary), determined dynamically by counting the GROQ results, not by asserting a hardcoded number.

### OVER-SPECIFIED: VAL-BLOG-003 bundles too many independent checks
**Area:** BLOG
**Suggested ID:** N/A (consider splitting)
VAL-BLOG-003 validates title, date format, body content, categories, tags, and mainImage in a single assertion. If the mainImage is broken, the entire assertion fails without clarity on which sub-check caused the failure. Consider splitting into separate assertions: post metadata (title + date), post body rendering, post taxonomy display (categories + tags), and post featured image.

### OVER-SPECIFIED: VAL-CONTENT-002 validates 8 subpages in one assertion
**Area:** CONTENT
**Suggested ID:** N/A (consider looping or parametrizing)
This assertion iterates over all 8 about subpages in a single test case. If one subpage fails, the assertion fails without specifying which subpage broke. Consider either splitting into per-subpage assertions (VAL-CONTENT-002a through 002h) or specifying that the test runner must report per-subpage pass/fail independently.

### NOTED: VAL-HOME-016 bundles hero rendering, localization, imagery, and responsive layout
**Area:** HOME
**Suggested ID:** N/A
This one assertion covers four distinct concerns (visual rendering, i18n, image loading, responsive overflow). If the hero image is broken but everything else works, the failure message is ambiguous. Consider splitting into separate assertions for each concern.

---

## Additional Observations

### MISSING: Home page — loading states (skeleton/spinner) during Sanity fetch
**Area:** HOME
**Suggested ID:** VAL-HOME-031
No assertion covers what the user sees while the Word of the Day is being fetched from Sanity. If the page renders with a blank section that suddenly populates, this causes layout shift (bad CLS). A skeleton placeholder or spinner should be validated. This applies equally to content pages and blog listing.

### MISSING: Home page — CIG calendar uses correct timezone (not UTC for day boundary)
**Area:** HOME
**Suggested ID:** VAL-HOME-032
VAL-HOME-008 says the solar date "must match the system clock of the client browser." But the CIG lunar calculation must also be timezone-aware. If the site's audience is primarily in Brazil (UTC-3), the CIG date should be computed for Brazil's date, not UTC. A visitor in Japan at 01:00 JST (still the previous day in Brazil) should see the same CIG date as someone in São Paulo. The contract must specify the reference timezone.

### MISSING: Content page — slug changes in Sanity (redirect from old slug)
**Area:** CONTENT
**Suggested ID:** VAL-CONTENT-020
If a content editor changes a page's slug in Sanity (e.g., "visao" → "visao-geral"), the old URL should redirect (301) to the new one or return 404. The contract does not specify slug-mutation behavior. This is relevant for bookmarked URLs and SEO.

### MISSING: Blog post — reading progress indicator
**Area:** BLOG
**Suggested ID:** VAL-BLOG-027
If the original Wix site or design spec includes a reading progress bar at the top of blog post pages, this must be validated. Not universally required but worth checking against the source site.

### MISSING: Blog post — copy link / share URL button
**Area:** BLOG
**Suggested ID:** VAL-BLOG-028
A "copy link" button on the post detail page (for sharing the canonical URL) is a common pattern. If present, it must copy the correct locale-prefixed URL to the clipboard.

---

## Summary

| Category | Missing | Redundant/Over-specified |
|---|---|---|
| HOME | 12 new suggested (VAL-HOME-021 through VAL-HOME-032) | 4 noted |
| CONTENT | 9 new suggested (VAL-CONTENT-012 through VAL-CONTENT-020) | 1 noted |
| BLOG | 12 new suggested (VAL-BLOG-014 through VAL-BLOG-025, plus 027-028) | 3 noted |
| XCUT (Home+Content+Blog) | 11 new suggested (VAL-XCUT-003 through VAL-XCUT-017, minus gaps filled by CROSS assertions) | 0 noted |
| **Total suggested additions** | **44** | **8** |

The existing 46 assertions provide solid coverage of happy-path rendering and basic error states. The primary gaps are:
1. **Interactive affordances**: What is clickable, where does it lead, and does it work?
2. **Multi-page user journeys**: Flows that span home → blog → content and back.
3. **Edge-case data**: Missing optional fields, very large content, special characters, draft documents.
4. **Accessibility**: Keyboard nav, screen reader hierarchy, focus management.
5. **Content discovery**: Related posts, cross-linking between sections, search spanning both content pages and blog.
6. **Locale interactions**: What happens when switching languages on filtered/paginated views or when a translation is missing.
