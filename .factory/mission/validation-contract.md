# Validation Contract — AFUPM Site Migration

> **Mission:** Replicate AFUPM Wix site (familias.org.br) to Next.js + Sanity
> **Surfaces:** Browser (agent-browser)
> **Total assertions:** 74

---

# AFUPM Home Page — Validation Contract

## Scope
The home page (`/pt` and `/es`) is the primary landing experience for famlias.org.br. It includes the CIG lunar calendar display, Gregorian solar date, rotating Word of the Day from Sanity, a static hero section, and full Portuguese/Spanish bilingual support via `next-intl`.

---

## Assertions

### VAL-HOME-001: Home page loads without console errors (PT)
The home page at `/pt` must load and render all core sections without throwing uncaught JavaScript exceptions or logging error-level messages to the browser console. Network requests for critical resources (Sanity CDN, next-intl messages, fonts) must all resolve with HTTP 2xx status codes.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors, network-errors

---

### VAL-HOME-002: Home page loads without console errors (ES)
The home page at `/es` must load and render all core sections without throwing uncaught JavaScript exceptions or logging error-level messages to the browser console. Network requests for critical resources must all resolve with HTTP 2xx status codes.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors, network-errors

---

### VAL-HOME-003: CIG lunar calendar displays correct date (PT)
Navigating to `/pt`, the CIG calendar section must compute and display the current Cheon Il Guk lunar date. The format must follow `"[N]º dia do [M]º mês do [Y]º ano do CIG"` where N is the lunar day (1–30), M is the lunar month (1–12), and Y is the CIG year (years since 2013). Each numeric component must use the Portuguese ordinal indicator `º`. The calculated date must be consistent with the `moment-lunar` library's conversion from the current Gregorian date. A manual spot-check: on 2026-08-11 the expected CIG year is 14 (2026 − 2013 + 1 = 14； the 14º ano began on lunar new year 2026).
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-004: CIG lunar calendar displays correct date (ES)
Navigating to `/es`, the CIG calendar section must compute and display the same underlying CIG lunar date as `/pt`, but formatted in Spanish: `"[N]º día del [M]º mes del [Y]º año del CIG"`. The day, month, and year values must match those returned for the Portuguese locale (i.e., the calculation is locale-independent; only the label strings differ). Each numeric component must use the Spanish ordinal indicator `º`.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-005: CIG calendar ordinal formatting is correct across edge-case days
The ordinal indicator `º` must appear directly adjacent to every numeric value (day, month, year) with no space or other character intervening. Verify this holds for single-digit values (e.g., `1º`, `9º`) and double-digit values (e.g., `10º`, `29º`). Test by manipulating the system clock or checking the current date's values — if the current day is 1–9, confirm `Nº` not `N º`； if the current day is 10+, confirm `NNº` not `NN º`.
**Tool:** agent-browser
**Evidence:** screenshot

---

### VAL-HOME-006: CIG calendar graceful degradation on calculation failure
If the CIG date computation throws an error or returns `null`/`undefined` (simulated by mocking `moment-lunar` or by blocking the script), the page must not crash or render a blank section. Instead, the CIG calendar container must either render a fallback message (e.g., "—" or a localized "unavailable" string) or hide the section entirely without affecting the layout of the remaining home-page sections (hero, solar date, word of the day).
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-007: CIG calendar respects lunar month boundaries
The CIG lunar month and day must reflect actual lunar cycles, not a simplified 30-day approximation. Verify that on known boundary dates (e.g., a lunar new moon day that `moment-lunar` maps to day 1 of a new month), the displayed month and day reset correctly. The year must increment only at the CIG new year (lunar new year), not on January 1 of the Gregorian calendar.
**Tool:** agent-browser
**Evidence:** screenshot

---

### VAL-HOME-008: Solar date displays correct Gregorian date (PT)
Navigating to `/pt`, the solar date section must display the current Gregorian date in Portuguese format: `"DD.MM.YYYY [weekday]"` where weekday is the full Portuguese weekday name in lowercase (e.g., `terça-feira`, `sábado`). Example: `"11.08.2026 terça-feira"`. The date must match the system clock of the client browser.
**Tool:** agent-browser
**Evidence:** screenshot

---

### VAL-HOME-009: Solar date displays correct Gregorian date (ES)
Navigating to `/es`, the solar date section must display the current Gregorian date in Spanish format: `"DD.MM.YYYY [weekday]"` where weekday is the full Spanish weekday name in lowercase (e.g., `martes`, `sábado`). Example: `"11.08.2026 martes"`. The date must match the system clock and the underlying Gregorian date shown in `/pt`； only the weekday name differs by locale.
**Tool:** agent-browser
**Evidence:** screenshot

---

### VAL-HOME-010: Solar date format is consistent (leading zeros and separators)
Both locales must use the exact same numeric format: two-digit day, two-digit month, four-digit year, separated by dots (`.`). Single-digit days and months (1–9) must be zero-padded to two digits (e.g., `01.03.2026`, not `1.3.2026`). The weekday name must follow the date with a single space, no comma or parentheses.
**Tool:** agent-browser
**Evidence:** screenshot

---

### VAL-HOME-011: Word of the Day loads a phrase from Sanity (PT)
Navigating to `/pt`, the "Palavra do Dia" section must fetch a phrase document from the Sanity `wordOfTheDay` collection via the Sanity CDN or GROQ API. The phrase must include at minimum a text body (the word/phrase content) displayed prominently. The section title must read "Palavra do Dia" (Portuguese). The network call to the Sanity API must return HTTP 200.
**Tool:** agent-browser
**Evidence:** screenshot, network-calls (filter: `wordOfTheDay` or Sanity API)

---

### VAL-HOME-012: Word of the Day loads a phrase from Sanity (ES)
Navigating to `/es`, the "Palabra del Día" section must fetch a phrase document from the same Sanity `wordOfTheDay` collection. The section title must read "Palabra del Día" (Spanish). The phrase content must be localized (either fetched as separate locale-specific documents, or using Sanity's built-in locale fields with `pt`/`es` variants). The network call must return HTTP 200.
**Tool:** agent-browser
**Evidence:** screenshot, network-calls (filter: `wordOfTheDay` or Sanity API)

---

### VAL-HOME-013: Word of the Day rotation is deterministic by date
The phrase displayed must change each calendar day according to a deterministic rotation. The same UTC date must always return the same phrase across multiple page loads. A different UTC date must return a different phrase (or the same phrase only if the collection has a single document or the rotation naturally cycles). The rotation must be based on calendar date, not request time or random selection.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-014: Word of the Day handles empty collection gracefully
If the Sanity `wordOfTheDay` collection returns zero documents, the "Palavra do Dia" / "Palabra del Día" section must render a graceful fallback: either a localized placeholder message (e.g., "Nenhuma frase disponível" / "Ninguna frase disponible") or the section must hide without disrupting page layout. The page must not throw an uncaught error, show a blank white screen, or render `undefined`/`NaN` in the phrase area.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-015: Word of the Day handles single-phrase collection
If the Sanity `wordOfTheDay` collection contains exactly one document, every day must show that same phrase (since `index % 1 === 0` always). The rotation logic must not divide by zero or produce `NaN`. The phrase must render correctly with no console errors.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-016: Hero section renders in both locales
The hero section (top-of-page branding banner) must render correctly on both `/pt` and `/es`. Key elements to verify:
- The site name/logo "AFUPM" or "Famílias" is visible and not broken.
- Any hero tagline or subtitle is localized (Portuguese text on `/pt`, Spanish on `/es`).
- Hero imagery or background renders without broken image links (HTTP 200 for all hero image assets).
- The hero layout does not overflow the viewport horizontally at 360px, 768px, and 1440px widths.
**Tool:** agent-browser
**Evidence:** screenshot, network-errors

---

### VAL-HOME-017: Bilingual locale routing works correctly
The home page must be served at both `/pt` and `/es` paths via `next-intl` locale routing. Accessing `/` (root) must redirect to either a default locale (PT or ES) or show a locale selector. Verify:
- `/pt` renders all static chrome (nav, footer, headings) in Portuguese.
- `/es` renders all static chrome in Spanish.
- The `<html lang>` attribute reflects the active locale (`lang="pt"` or `lang="es"`).
- Switching locales (clicking a language toggle, if present) navigates to the alternate path and re-renders all localized content without a full-page hard reload.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

### VAL-HOME-018: All home-page sections are visible and non-overlapping (both locales)
At viewport widths 360px (mobile), 768px (tablet), and 1440px (desktop), all major sections — hero, CIG calendar, solar date, and word of the day — must be:
- Visible (not `display: none`, not zero-height, not scrolled out of the initial viewport if they are above-the-fold by design).
- Non-overlapping: no two sections' bounding boxes intersect horizontally.
- Text content must not be truncated or clipped by overflow-hidden containers.
This must hold for both `/pt` and `/es`.
**Tool:** agent-browser
**Evidence:** screenshot (mobile, tablet, desktop)

---

### VAL-HOME-019: CIG calendar and solar date cross-locale consistency
The underlying Gregorian date (day, month, year) shown in the solar date section and used as input to the CIG lunar calculation must be identical across `/pt` and `/es` when loaded simultaneously. The CIG year, month, and day values must also be identical across locales (only the label strings differ). This ensures the date logic is locale-agnostic.
**Tool:** agent-browser
**Evidence:** screenshot (side-by-side or sequential comparison)

---

### VAL-HOME-020: Network resilience — Sanity CDN timeout or failure
If the Sanity CDN request for `wordOfTheDay` times out or returns a 4xx/5xx status, the page must handle the failure gracefully. The Word of the Day section must show a fallback state (placeholder text or hidden section). Other sections (hero, CIG calendar, solar date) must render normally and independently. No uncaught exceptions may propagate to crash the page.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors, network-errors

# Validation Contract: Content Pages + Blog — AFUPM Site Migration

## Scope
- **Content pages:** `/sobre/[...slug]` (8 subpages), `/bencao`, `/anuncios`, `/sedes`
- **Blog:** `/noticias` (listing), `/post/[slug]` (detail)
- **Locales:** `/pt` (default) and `/es`
- **Tool:** agent-browser
- **Start URL:** `http://localhost:3000`

---

## Content Page Assertions

### VAL-CONTENT-001: About section root redirects or shows navigation hub
Navigate to `/pt/sobre`. The page must either redirect to the first subpage (`/pt/sobre/visao`) or display a navigation hub listing all 8 subpages (visão, fundadores, mensagem-presidente, resolucao, nova-verdade, escrituras, historia, atividades-missionarias) with working links. No blank page or 500 error.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-CONTENT-002: Each about subpage renders with correct title and body content
For each of the 8 about subpages (`visao`, `fundadores`, `mensagem-presidente`, `resolucao`, `nova-verdade`, `escrituras`, `historia`, `atividades-missionarias`), navigate to `/pt/sobre/[slug]` and verify: (a) the page returns HTTP 200, (b) an `<h1>` or equivalent heading displays the page title from Sanity, (c) the body block content renders at least one paragraph of visible text, (d) no Sanity GROQ error or broken portable-text rendering appears.
**Tool:** agent-browser
**Evidence:** screenshot per subpage, console-errors

### VAL-CONTENT-003: About sibling subpage navigation works
From any about subpage (e.g. `/pt/sobre/visao`), verify that navigation links to sibling subpages are present (sidebar, breadcrumbs, or in-page nav list). Click one sibling link and confirm: (a) URL updates to the correct `/pt/sobre/[other-slug]`, (b) the new subpage content loads with a different heading from the previous page, (c) no full-page reload (client-side navigation via Next.js `<Link>`).
**Tool:** agent-browser
**Evidence:** screenshot (before click + after click), console-errors

### VAL-CONTENT-004: Bênção page renders
Navigate to `/pt/bencao`. Verify: (a) HTTP 200, (b) page heading or title is present, (c) body content with block text renders, (d) no broken portable-text rendering or GROQ error.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-CONTENT-005: Anúncios (Quadro de Avisos) page renders
Navigate to `/pt/anuncios`. Verify: (a) HTTP 200, (b) page heading is present, (c) body content renders with block text, (d) no rendering errors.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-CONTENT-006: Sedes (Locations) page renders
Navigate to `/pt/sedes`. Verify: (a) HTTP 200, (b) page heading is present, (c) body content renders with location information, (d) no rendering errors.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-CONTENT-007: Content pages render in both PT and ES locales
For each content page type (pick at least: one sobre subpage, bencao, anuncios, sedes), navigate to the PT version then switch locale to ES (click language toggle, or navigate to `/es/...` directly). Verify: (a) the ES page returns HTTP 200, (b) page heading and body content are in Spanish, (c) the content is different from the PT version (different language field in Sanity), (d) UI chrome (header labels, footer) is also in Spanish. If no ES version exists for a page in Sanity, the page should still render gracefully (fallback to PT or show "content not available in Spanish" message — not a 500).
**Tool:** agent-browser
**Evidence:** screenshot (PT + ES side-by-side or sequential), console-errors

### VAL-CONTENT-008: Language toggle persists across content page navigation
From `/pt/sobre/visao`, switch locale to ES. Verify the URL changes to `/es/sobre/visao`. Then click a link to another about subpage. Verify the URL stays in the `/es/` locale prefix, the new page renders in Spanish, and the language toggle shows ES as active.
**Tool:** agent-browser
**Evidence:** screenshot (after toggle + after navigation), console-errors

### VAL-CONTENT-009: Non-existent content page returns 404
Navigate to `/pt/sobre/pagina-inexistente` (a slug that does not exist in Sanity). Verify: (a) HTTP 404 status, (b) a user-friendly 404 page is displayed (not a blank page or unhandled error), (c) the 404 page includes navigation back to home or other valid pages, (d) no 500 error in console.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-CONTENT-010: Content page body renders rich portable text correctly
On a content page with known rich text (e.g., `/pt/sobre/historia` or another subpage expected to have formatting), verify that portable text blocks render correctly: (a) bold and italic text display properly, (b) links are clickable and have correct href, (c) lists (bullet or numbered) render with proper indentation, (d) if images are embedded in body, they load without broken src. No raw JSON or unrendered portable-text annotations visible.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-CONTENT-011: All 8 about subpages have unique slugs and no collision
Navigate sequentially through all 8 subpages at `/pt/sobre/[slug]` and confirm each one: (a) loads distinct content (different heading text from all others), (b) returns HTTP 200, (c) the browser URL slug matches the expected Sanity slug. No two pages should display identical content.
**Tool:** agent-browser
**Evidence:** screenshot (last page visited), console-errors

---

## Blog Assertions

### VAL-BLOG-001: Blog listing shows all published posts, newest first
Navigate to `/pt/noticias`. Verify: (a) HTTP 200, (b) at least one post card is visible, (c) the first visible post has a `publishedAt` date more recent than or equal to posts below it (newest first ordering), (d) each post card shows at minimum: title, excerpt or truncated body, and published date, (e) if the dataset has 11 posts, all 11 should appear (or the first page of pagination shows a reasonable count like 6-9).
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-BLOG-002: Post card links navigate to post detail page
On the blog listing at `/pt/noticias`, click the title or "read more" link of any post card. Verify: (a) URL updates to `/pt/post/[slug]`, (b) the post detail page loads with the same title as the card that was clicked, (c) navigation is client-side (no full page reload).
**Tool:** agent-browser
**Evidence:** screenshot (listing + detail), console-errors

### VAL-BLOG-003: Post detail page shows full content and metadata
Navigate to any published post at `/pt/post/[slug]`. Verify: (a) the post title is displayed prominently (h1), (b) `publishedAt` date is visible and formatted (e.g., "12 de janeiro de 2025"), (c) the full body content renders (block text, portable text), (d) categories are displayed and link to filtered listing, (e) tags are displayed if present, (f) mainImage is rendered if the post has one (no broken image).
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-BLOG-004: Category filter filters blog listing correctly
On `/pt/noticias`, identify the category filter controls (buttons, dropdown, or tag cloud). Click on a category (e.g., "Notícias Nacionais"). Verify: (a) the URL updates to reflect the filter (e.g., `/pt/noticias?categoria=noticias-nacionais` or similar), (b) only posts belonging to that category are displayed, (c) a visual indicator shows which category is active/selected, (d) clicking a different category updates the list, (e) a "clear filter" or "all" option returns to the full unfiltered list.
**Tool:** agent-browser
**Evidence:** screenshot (before filter + after filter), console-errors

### VAL-BLOG-005: Featured posts have distinct visual treatment
On the blog listing at `/pt/noticias`, if any posts have `featured: true` in Sanity, verify they are visually distinguishable from non-featured posts (e.g., larger card, "Destaque" badge, different border/background, or pinned to top of list). If no featured posts exist in the dataset, verify the page still renders correctly without errors (no broken conditional logic).
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-BLOG-006: Empty state when no posts in a filtered category
Filter the blog listing by a category that has no published posts in the current locale. Verify: (a) HTTP 200 (not 404 or 500), (b) a user-friendly empty state message is displayed (e.g., "Nenhum artigo encontrado nesta categoria" or similar), (c) a call-to-action is present to return to all posts or clear the filter, (d) no blank page or unhandled error.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-BLOG-007: Blog listing respects locale — PT and ES posts are separated
Navigate to `/pt/noticias`. Note the posts displayed (titles, count). Then navigate to `/es/noticias`. Verify: (a) the ES listing shows only posts with `language: "es"` in Sanity, (b) posts shown in the PT listing are different from those in the ES listing (unless a post exists in both languages, in which case it should appear in each listing with its respective language content), (c) no Portuguese posts leak into the Spanish listing and vice versa, (d) the locale prefix in the URL is consistent with the listing language.
**Tool:** agent-browser
**Evidence:** screenshot (PT listing + ES listing), console-errors

### VAL-BLOG-008: Post detail page respects locale in URL and content
From `/pt/noticias`, click a PT post. Verify the URL is `/pt/post/[slug]`. Then from `/es/noticias`, click an ES post. Verify the URL is `/es/post/[slug]`. The post body content language should match the locale prefix (Portuguese for /pt/, Spanish for /es/).
**Tool:** agent-browser
**Evidence:** screenshot (PT post + ES post), console-errors

### VAL-BLOG-009: Non-existent post slug returns 404
Navigate to `/pt/post/post-que-nao-existe-99999`. Verify: (a) HTTP 404 status, (b) a user-friendly 404 page is displayed, (c) the 404 page offers navigation back to `/pt/noticias` or home, (d) no unhandled GROQ error or 500.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-BLOG-010: Blog pagination or "load more" works
On `/pt/noticias`, if the total number of published posts exceeds the page size, verify that a pagination control or "load more" button is present. If pagination: click page 2 and verify new posts load with correct offset (different posts from page 1). If "load more": click it and verify additional posts append to the listing without removing existing ones. If only one page of posts exists, verify no broken pagination controls appear.
**Tool:** agent-browser
**Evidence:** screenshot (before + after), console-errors

### VAL-BLOG-011: Category links from post detail navigate to filtered listing
On any post detail page at `/pt/post/[slug]`, click on a category link displayed in the post metadata. Verify: (a) navigation goes to the blog listing filtered by that category, (b) the URL reflects the category filter, (c) only posts in that category are shown in the listing.
**Tool:** agent-browser
**Evidence:** screenshot (post detail + filtered listing), console-errors

### VAL-BLOG-012: Blog post tags are rendered and clickable (if interactive)
On a post detail page that has tags, verify: (a) each tag is displayed visually (e.g., badge/pill), (b) tags are rendered in a list or inline group. If tags are interactive (clickable links to filtered listing), verify clicking a tag navigates to the blog listing filtered by that tag. If tags are non-interactive labels, verify they render without broken elements.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-BLOG-013: Blog listing category filter shows all expected categories
On `/pt/noticias`, identify the category filter UI. Verify it displays at minimum these categories: "Notícias Nacionais", "Informe HJ", "Distrito 1", "Distrito 2", "Distrito 3". The category names should be readable and not truncated. Each should be interactive (clickable).
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

## Cross-Cutting Assertions (Content + Blog)

### VAL-XCUT-001: Breadcrumbs are correct for content pages and blog
On `/pt/sobre/visao`, verify breadcrumbs show something like: Home > Sobre > Visão. On `/pt/post/[slug]`, verify breadcrumbs show: Home > Notícias > [Post Title]. Each breadcrumb segment (except the current page) should be a clickable link.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

### VAL-XCUT-002: Global header navigation links to content pages and blog
From any page on the site, verify the global header/nav includes links to: Sobre (or its subpages), Notícias, and at least two other content sections (e.g., Bênção, Anúncios). Click each nav link and verify it navigates to the correct section.
**Tool:** agent-browser
**Evidence:** screenshot, console-errors

---

## Summary

| Category | Assertions | IDs |
|---|---|---|
| Content Pages | 11 | VAL-CONTENT-001 through VAL-CONTENT-011 |
| Blog | 13 | VAL-BLOG-001 through VAL-BLOG-013 |
| Cross-cutting | 2 | VAL-XCUT-001, VAL-XCUT-002 |
| **Total** | **26** | |

# Contract: Media, Events, Cross-Area — AFUPM Site Migration

> Covers `/galeria`, `/eventos`, navigation, i18n switching, search, footer, responsive layout, SEO, and error-free operation.
> All routes are prefixed with `/[locale]` where locale is `pt` or `es`.

---

## Gallery & Media

### VAL-GALLERY-001: Gallery page loads and displays images
Navigate to `/pt/galeria`. The page must render a grid or list of gallery images fetched from Sanity `galleryImage` documents for the `pt` locale. Each image must have a visible `<img>` element with a non-empty `src` attribute resolving to the Sanity CDN.
- **Pass:** At least 3 visible `<img>` elements with `src` containing `cdn.sanity.io` or `images.sanity.io`.
- **Fail:** Zero images, or all images are broken (HTTP 4xx/5xx), or the page crashes with an error boundary.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-GALLERY-002: Language toggle — Portuguese images
On `/pt/galeria`, verify that all rendered gallery images belong to the `pt` locale. Each image's `alt` text should be in Portuguese (or at minimum, images should not display Spanish-only alt text). The Sanity query must filter `language == "pt"`.
- **Pass:** All visible images have Portuguese or language-neutral alt text. No image has Spanish-only alt text mixed in.
- **Fail:** Any image with Spanish-only alt text appears on the PT gallery page.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-GALLERY-003: Language toggle — Spanish images
Navigate to `/es/galeria`. Verify that all rendered gallery images belong to the `es` locale. The gallery content must be different from the PT version (different image set, or empty if no ES images exist). The Sanity query must filter `language == "es"`.
- **Pass:** Images rendered are different from `/pt/galeria` (different src URLs) or the page shows a valid empty state. No Portuguese-only images appear.
- **Fail:** The same PT images appear, or PT-specific alt text is visible.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-GALLERY-004: Images render with alt text
On both `/pt/galeria` and `/es/galeria`, every `<img>` element must have a non-empty `alt` attribute sourced from the Sanity `galleryImage.alt` field. Alt text provides accessibility and must not be a placeholder like "image" or the filename.
- **Pass:** Every `<img>` in the gallery has an `alt` attribute with meaningful, human-readable text (>= 3 characters, not just the file name).
- **Fail:** Any `<img>` has an empty `alt=""` (missing alt), or alt text is a raw filename like "DSC_001.jpg" or "image".
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-GALLERY-005: Empty gallery state when no images exist for a language
If no `galleryImage` documents exist for a given language (e.g., ES has no images yet), the gallery page must display a user-friendly empty-state message (e.g., "Nenhuma foto disponível" / "No hay fotos disponibles") instead of a blank page or error.
- **Pass:** The empty-state message is visible and the page does not crash. No broken `<img>` tags with missing `src`.
- **Fail:** A blank white area, a JavaScript error, or a 404 page.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-GALLERY-006: YouTube video embeds render correctly
On any page that includes embedded videos from Sanity `video` documents (e.g., `/pt/bencao` or a dedicated media section), verify that YouTube embeds render as functional `<iframe>` elements with `src` pointing to `youtube.com/embed/...`. The embed must be visible and not blocked by CSP.
- **Pass:** At least one `<iframe>` with `src` containing `youtube.com/embed/` is present and renders. No CSP errors in the console.
- **Fail:** Missing iframe, CSP blocking the embed, or a blank embed area.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors, network calls (YouTube iframe load)

### VAL-GALLERY-007: External links point to correct destinations
Verify that external links on the site navigate to the correct destinations:
- YouTube channel link points to AFUPM's YouTube channel URL
- Instagram link points to AFUPM's Instagram profile
- purewaterwave.org link points to `https://purewaterwave.org`
- **Pass:** All three links have correct `href` values and open in a new tab (`target="_blank"`). Clicking does not produce a 404.
- **Fail:** Any link has a wrong URL, is missing, or opens in the same tab without user expectation.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

---

## Events

### VAL-EVENTS-001: Events listing page loads with events
Navigate to `/pt/eventos`. The page must render a list of events fetched from Sanity `event` documents filtered by `language == "pt"`. Each event card must display at minimum the event title and date.
- **Pass:** At least one event card is visible with a title and date. No console errors.
- **Fail:** Empty page with no events and no explanation, or a JavaScript error crash.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-EVENTS-002: Events are sorted by date
On `/pt/eventos`, events must be displayed in chronological order. The default sort should be ascending by the `date` field so the next upcoming event appears first or most prominently.
- **Pass:** Event dates increase monotonically as the user scrolls down the list (earliest first). No random ordering.
- **Fail:** Events appear in arbitrary or reverse-chronological order without clear user-facing controls.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-EVENTS-003: Past and future events are visually distinguishable
Events whose `date` is in the past must be visually distinct from upcoming events (e.g., grayed out, a "Past" label, or a separate "Eventos passados" section). Users must be able to tell at a glance which events have already occurred.
- **Pass:** Past events have a different visual treatment (opacity, label, or separate section heading). Upcoming events appear distinctly different.
- **Fail:** All events look identical regardless of date, with no way to distinguish past from future.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-EVENTS-004: Event shows complete information
Each event in the listing (or detail view, if one exists) must display: title, date, optional endDate (date range), optional location, optional description excerpt, and optional image. No required field (title, date) may be missing.
- **Pass:** Every visible event card shows at least title and formatted date. If the Sanity document has location or description, those are also rendered.
- **Fail:** Any event is missing its title or date in the rendered output.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-EVENTS-005: Both locales show correct language-filtered events
Navigate to `/pt/eventos` and `/es/eventos`. Each page must show only events with the matching `language` field. Events created in Portuguese must not appear on the Spanish page, and vice versa.
- **Pass:** `/pt/eventos` shows only PT events; `/es/eventos` shows only ES events. If one language has no events, an empty state is shown.
- **Fail:** Events from the wrong language appear on either page.
- **Tool:** agent-browser
- **Evidence:** screenshot (both locales), console-errors

### VAL-EVENTS-006: Events page handles empty state gracefully
If no `event` documents exist for a locale, the events page must display an appropriate message (e.g., "Nenhum evento programado" / "No hay eventos programados") instead of an error or blank page.
- **Pass:** A human-readable empty-state message is visible. The page layout remains intact (header, footer present).
- **Fail:** Blank white area, error boundary, 404, or broken layout.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

---

## Cross-Area Flows

### VAL-CROSS-001: Header navigation links work for all pages
From any page on the site, the header navigation must contain links to all major sections (Home, Sobre, Notícias, Eventos, Galeria, Bênção, Anúncios, Sedes). Clicking each link must navigate to the correct page within the same locale (i.e., clicking "Galeria" from `/pt/sobre` goes to `/pt/galeria`).
- **Pass:** All nav links have correct `href` values, are clickable, and lead to the expected page (HTTP 200). No broken links.
- **Fail:** Any link produces a 404, redirects to the wrong page, or preserves the wrong locale.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors, network calls

### VAL-CROSS-002: Active navigation state reflects current page
The current page's navigation link must have an active/highlighted visual state (e.g., different color, underline, font weight). As the user navigates between pages, the active state must update accordingly.
- **Pass:** The nav item corresponding to the current URL path has a visibly distinct style. Navigating to a different page changes the active item.
- **Fail:** No active state visible, or the wrong item is highlighted for the current page.
- **Tool:** agent-browser
- **Evidence:** screenshot (2+ pages showing different active states)

### VAL-CROSS-003: Language switcher toggles locale preserving current page path
On any page (e.g., `/pt/eventos`), clicking the language switcher to switch to Spanish must navigate to `/es/eventos` (same page, different locale prefix). The switcher must be accessible from every page.
- **Pass:** Clicking the ES toggle from `/pt/galeria` navigates to `/es/galeria`. Clicking PT from `/es/sobre/[...]` navigates to `/pt/sobre/[...]`. The URL path after the locale prefix is identical.
- **Fail:** Switching locale redirects to the home page, produces a 404, or breaks the URL.
- **Tool:** agent-browser
- **Evidence:** screenshot (before/after), console-errors, network calls

### VAL-CROSS-004: Language switcher is visible and functional on both desktop and mobile
The language toggle (PT/ES) must be visible in the header on all breakpoints. On mobile, it must still be accessible (either in the header or inside the hamburger menu).
- **Pass:** Language switcher is visible and clickable at viewport widths 1920px, 768px, and 375px.
- **Fail:** Switcher disappears, overflows, or becomes unclickable at any breakpoint.
- **Tool:** agent-browser
- **Evidence:** screenshot (desktop + mobile viewports)

### VAL-CROSS-005: Footer renders with social links and copyright
On every page, the footer must contain:
- Social media links (YouTube, Instagram) with correct URLs and icons
- A link to purewaterwave.org
- Copyright or organization text (e.g., "AFUPM © 2025" or similar)
- **Pass:** Footer is present on all pages. YouTube and Instagram links have correct `href` values. Copyright text is visible.
- **Fail:** Footer missing on any page, broken social links, or missing copyright.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-CROSS-006: Mobile hamburger menu opens, closes, and contains all nav links
At viewport width 375px (mobile), the navigation must collapse into a hamburger menu. Clicking the hamburger icon must open a menu containing all navigation links. Clicking the close button or a link must close the menu.
- **Pass:** Hamburger icon visible at 375px. Tap opens menu with all nav links (same set as desktop). Tap a link navigates and closes the menu. Tap close icon or backdrop closes the menu.
- **Fail:** No hamburger at 375px, menu missing links present on desktop, menu does not close, or menu is not scrollable if it exceeds viewport height.
- **Tool:** agent-browser
- **Evidence:** screenshot (open + closed), console-errors

### VAL-CROSS-007: Every page has a proper `<title>` and meta description
On every page in both locales, the `<head>` must contain:
- A non-empty, descriptive `<title>` tag (not just "AFUPM" — include the page name)
- A `<meta name="description">` tag with meaningful content
- Both must be in the correct language for the locale
- **Pass:** `<title>` is not empty, not just "AFUPM", and includes page context. Meta description is >= 50 characters and in the correct language.
- **Fail:** Missing or empty `<title>`, generic title on all pages, missing meta description, or wrong-language metadata.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors

### VAL-CROSS-008: OG image meta tag present for social sharing
At minimum the home page (`/pt` and `/es`) must have an `og:image` meta tag pointing to a valid, loadable image. Ideally, all content pages (blog posts, events) should also have `og:image` for social sharing.
- **Pass:** `<meta property="og:image">` exists on `/pt` and `/es` home pages, and the image URL returns HTTP 200.
- **Fail:** Missing `og:image` on the home page, or the image URL returns 404/500.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors, network calls (og:image load)

### VAL-CROSS-009: No broken links or images on any page
Crawl all major pages in both locales: Home, Sobre (all subpages), Notícias, each blog post, Eventos, Galeria, Bênção, Anúncios, Sedes. Verify that no `<a href>` produces a 404 within the site and no `<img>` tag has a broken `src`.
- **Pass:** Zero internal 404s. All images return HTTP 200 or 304. External links may exist but internal links must resolve.
- **Fail:** Any internal link returns 404, or any image has a broken/empty `src`.
- **Tool:** agent-browser
- **Evidence:** console-errors, network calls

### VAL-CROSS-010: Site loads without JavaScript errors on every page
Navigate to every major page (`/pt`, `/pt/sobre`, `/pt/noticias`, `/pt/eventos`, `/pt/galeria`, `/pt/bencao`, `/pt/anuncios`, `/pt/sedes`) and check the browser console for errors. Repeat for `/es` variants.
- **Pass:** Zero `console.error` calls and zero uncaught exceptions on all pages in both locales. Warnings are acceptable but no errors.
- **Fail:** Any `console.error` or unhandled exception on any page.
- **Tool:** agent-browser
- **Evidence:** console-errors (all pages)

### VAL-CROSS-011: Search returns relevant results
If a site search feature exists, enter a query that matches a known piece of content (e.g., a blog post title or event name). Verify that relevant results appear, ordered by relevance. Searching for a term that exists only in Portuguese should return results on `/pt` but not on `/es` (language-scoped search).
- **Pass:** Search returns >= 1 relevant result for a known query. Results link to the correct page. Language filtering works.
- **Fail:** Search returns zero results for a known term, returns wrong-language results, crashes, or is not functional.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors, network calls (search request)

### VAL-CROSS-012: Root `/` redirects to default locale `/pt`
Navigating to the root URL `/` must issue an HTTP redirect (301 or 302) to `/pt`, which then renders the home page. Similarly, `/galeria` should redirect to `/pt/galeria`.
- **Pass:** `/` → HTTP redirect → `/pt` (200). No infinite redirect loops. No flash of unstyled content.
- **Fail:** `/` returns 404, renders content without redirect, or enters a redirect loop.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors, network calls (redirect chain)

### VAL-CROSS-013: Language detection for first-visit users
On first visit (no locale cookie set), the browser's `Accept-Language` header should be respected. A user with `Accept-Language: es` should be redirected to `/es`, while `Accept-Language: pt` (or pt-BR) should go to `/pt`. If the language cannot be determined, default to `/pt`.
- **Pass:** `Accept-Language: es` → redirected to `/es`. `Accept-Language: pt-BR` → redirected to `/pt`. Unknown language → `/pt`.
- **Fail:** Language header is ignored, always redirects to the wrong locale, or causes a redirect loop.
- **Tool:** agent-browser
- **Evidence:** screenshot, console-errors, network calls

### VAL-CROSS-014: Responsive layout — all pages are readable at mobile and tablet widths
At viewport widths 375px (mobile), 768px (tablet), and 1920px (desktop), verify that every major page is fully readable: no horizontal scrollbar, no overlapping text, no content cut off, and images scale correctly within their containers.
- **Pass:** No horizontal overflow at any breakpoint. Text is readable (>= 14px equivalent). All interactive elements have adequate tap targets (>= 44x44px).
- **Fail:** Horizontal scrollbar present, overlapping elements, text too small to read, or buttons too close together on mobile.
- **Tool:** agent-browser
- **Evidence:** screenshot (3 breakpoints per page × key pages)

### VAL-CROSS-015: Cross-locale consistency — same page structure in both languages
For any given page type (e.g., `/pt/galeria` vs `/es/galeria`), the page layout, component structure, and functionality must be identical. Only the content (text, images) changes based on language. The header, footer, navigation, and all interactive elements must be present in both locales.
- **Pass:** The DOM structure (component hierarchy) is the same for PT and ES versions of the same page. All shared UI elements (nav, footer, language switcher) are present in both.
- **Fail:** Structural differences between locales (e.g., footer missing on ES, nav items differ, layout shifts).
- **Tool:** agent-browser
- **Evidence:** screenshot (both locales side by side)
