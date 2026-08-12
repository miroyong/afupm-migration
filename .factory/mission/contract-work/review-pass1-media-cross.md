# Review Pass 1 — Gallery & Media, Events, Cross-Area Flows

> Contract reviewed: `/root/.factory/missions/e54118e9-6e77-4965-9f3c-39b3fe629207/validation-contract.md`
> Sections: VAL-GALLERY-*, VAL-EVENTS-*, VAL-CROSS-*
> Date: 2025-07-11

---

## Summary

- **Gallery & Media:** 7 assertions (GALLERY-001 through GALLERY-007). Gaps: no lightbox/modal flow, no image-loading failure handling, no lazy-loading or CLS requirements, misplaced assertions (YouTube embeds and external links don't belong in Gallery).
- **Events:** 6 assertions (EVENTS-001 through EVENTS-006). Gaps: no event detail page, no single-event or past-only edge cases, no event time display, no keyboard/accessibility coverage.
- **Cross-Area:** 15 assertions (CROSS-001 through CROSS-015). Gaps: no graceful degradation without JS, no loading states during navigation, no 404 page consistency check, no skip-to-content or ARIA landmarks, no hreflang/SEO structural tags, no scroll-preservation on locale switch, no focus management on client-side navigation.

---

## Gallery & Media Gaps

### MISSING: Lightbox / image detail modal on click
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-008
When a user clicks a gallery thumbnail, a lightbox or modal should open displaying the image at a larger size. No assertion currently covers what happens on image click. If images are non-interactive, the contract should explicitly state that. If a lightbox exists, it must support: (a) opening with the clicked image displayed, (b) closing via close button, Escape key, or backdrop click, (c) navigation between images (arrow keys or on-screen arrows) when multiple images exist. Without this, the gallery may be a static grid with no way to see full-resolution images — a critical user-flow gap.

### MISSING: Lightbox keyboard and screen-reader accessibility
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-009
If a lightbox/modal exists (see GALLERY-008), it must be keyboard-accessible: (a) focus is trapped inside the lightbox while it is open (Tab cycles through lightbox controls only), (b) Escape closes the lightbox, (c) Left/Right arrow keys navigate between images, (d) the lightbox uses `role="dialog"` and `aria-modal="true"`, (e) the image inside the lightbox has descriptive `alt` text. Screen reader users must be able to understand they are in a modal and navigate images.

### MISSING: Gallery image loading failure (broken CDN URL)
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-010
If an individual gallery image's `src` URL returns a 4xx/5xx or the image fails to load (network error, deleted Sanity asset), the page must handle it gracefully per-image, not as a whole-page failure. Each broken image should: (a) display a fallback placeholder (e.g., a gray box, an "image unavailable" icon, or a localized alt-text fallback), (b) not disrupt the grid layout (the placeholder must occupy the same dimensions as a loaded image), (c) not trigger an uncaught error or blank the entire gallery section. VAL-GALLERY-001 checks for whole-page crash but does not cover individual image failures.

### MISSING: Gallery image lazy loading
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-011
Gallery images that are below the fold must use native lazy loading (`loading="lazy"` on `<img>` elements) to avoid blocking the initial page render with off-screen image downloads. Verify: (a) `<img>` elements in the lower portion of the gallery have `loading="lazy"`, (b) images near or above the fold may use eager loading or omit the attribute (browser default is eager), (c) lazy-loaded images have explicit `width` and `height` attributes (or inline `aspect-ratio` via CSS) to prevent Cumulative Layout Shift (CLS) as images load in.

### MISSING: Gallery Cumulative Layout Shift (CLS) prevention
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-012
Gallery images must not cause visible layout shift as they load. Every `<img>` element must have explicit `width` and `height` dimensions (pulled from Sanity image metadata) so the browser can reserve the correct space before the image arrives. Alternatively, a CSS `aspect-ratio` must be set on the image container. Verify by loading the gallery on a throttled connection (simulated slow 3G) — gallery grid items must maintain stable positions without jumping as images populate. This is a Core Web Vital and directly impacts UX and SEO.

### MISSING: Gallery grid is responsive across breakpoints
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-013
VAL-CROSS-014 covers general responsive layout but does not specifically verify that the gallery grid adapts column count. At 375px (mobile) the gallery should show 1–2 columns, at 768px (tablet) 2–3 columns, and at 1440px+ (desktop) 3–4 columns. Images must scale proportionally within their grid cells without distortion, cropping, or overflow. Verify no horizontal scrollbar appears at any breakpoint on `/pt/galeria` and `/es/galeria`.

### MISSING: Gallery image captions / descriptions
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-014
If the Sanity `galleryImage` schema includes a `caption` or `description` field, the gallery must render those alongside or below each image. Verify: (a) captions are visible in the grid view (or at minimum in the lightbox), (b) caption text is localized per the document's `language` field, (c) long captions do not overflow or break the grid layout (text truncation with ellipsis, or wrapping within the grid cell). If the schema has no caption field, the contract should note that captions are out of scope.

### MISSING: Gallery Sanity rate limiting or query timeout
**Area:** GALLERY
**Suggested ID:** VAL-GALLERY-015
If the Sanity API request for `galleryImage` documents times out or returns a 5xx error, the gallery page must handle the failure gracefully — analogous to VAL-HOME-020 for Word of the Day but specific to the gallery data source. Verify: (a) a fallback message is displayed (e.g., "Galeria indisponível no momento" / "Galería no disponible"), (b) the rest of the page (header, footer, nav) renders normally, (c) no uncaught exception propagates. This is not covered by the existing empty-state assertion (GALLERY-005), which only tests zero documents, not network failure.

---

## Over-Specification / Misplacement in Gallery

### MISPLACED: VAL-GALLERY-006 — YouTube video embeds
**Area:** GALLERY
**Suggested ID:** N/A (relocate, not remove)
VAL-GALLERY-006 asserts that YouTube embeds render as `<iframe>` elements. This is about video content embedded in content pages (e.g., `/pt/bencao`), not about the gallery. This assertion should be moved to the Content Pages section (VAL-CONTENT-012) or into a dedicated Media/Video subsection. Keeping it under GALLERY is misleading — it creates confusion about whether `/pt/galeria` itself contains videos.

### MISPLACED: VAL-GALLERY-007 — External links (YouTube, Instagram, purewaterwave.org)
**Area:** GALLERY
**Suggested ID:** N/A (relocate, not remove)
VAL-GALLERY-007 checks external social links. This is a cross-area/global concern and belongs under VAL-CROSS, not GALLERY. VAL-CROSS-005 already covers footer social links, creating partial redundancy. Suggest merging into VAL-CROSS-005 or creating a separate VAL-CROSS assertion for external link verification that covers header, footer, and any in-content external links. The gallery page itself does not own these links — they are site-wide chrome.

---

## Events Gaps

### MISSING: Event detail page
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-007
The contract has no assertion for a dedicated event detail page. If events in the listing are clickable, clicking an event card must navigate to a detail page (e.g., `/pt/eventos/[slug]`). Verify: (a) URL updates to the detail route, (b) the detail page displays the full event information: title, date, time (if present), location (if present), full description (not just excerpt), main image (if present), (c) the detail page has a back link or breadcrumb to return to the events listing, (d) navigation is client-side (no full page reload). If there is no detail page by design, the contract should explicitly state that events are listing-only and clicking does nothing.

### MISSING: Event time display (not just date)
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-008
VAL-EVENTS-004 checks that title and date are rendered, but does not cover the event time. If the Sanity `event` schema includes a `time` field (start time, or start/end times), each event must display the time alongside the date. Verify: (a) time is formatted in a locale-appropriate way (e.g., "14:00" or "2:00 PM" for PT, "14:00" for ES), (b) timezone ambiguity is handled or noted, (c) if both start and end times exist, they are displayed as a range (e.g., "14:00 – 16:00").

### MISSING: Multi-day event date range display
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-009
VAL-EVENTS-004 mentions optional `endDate` but does not assert how a date range is rendered. Verify: (a) if `endDate` differs from `date`, the event displays a date range (e.g., "10–12 de janeiro de 2025" or "10/01/2025 – 12/01/2025"), (b) same-day events (date == endDate or endDate is null) do not show a redundant range, (c) the range format is locale-appropriate for both PT and ES.

### MISSING: Single event in listing
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-010
VAL-EVENTS-006 covers zero events (empty state), but not the edge case of exactly one event. When exactly one event exists: (a) the listing renders that single event card correctly, (b) no pagination or "load more" controls appear (they would be broken/hanging), (c) sort logic does not crash, (d) no misleading UI text like "0 events" or pluralization issues (e.g., "1 eventos" should read "1 evento" in Portuguese and Spanish).

### MISSING: All events are in the past
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-011
When all events have `date` values in the past, the listing must still be functional. Verify: (a) all events render (not hidden by a future-only filter), (b) a visual indicator communicates that these are past events (e.g., "Eventos passados" section heading), (c) the page does not display a confusing "no events" message when past events DO exist, (d) the sort order is still chronological (most recent past event first, or oldest first — the contract should specify). This is a distinct case from the empty state in EVENTS-006.

### MISSING: Event with missing optional fields
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-012
If an event document has `location: null`, `description: null`, or `image: null`, the event card (and detail page, if one exists) must render without broken elements. Verify: (a) a missing location does not render an empty "Local: " label or a broken map embed, (b) missing description does not leave a blank body area or raw `null` text, (c) missing image does not render a broken `<img>` tag with empty or null `src`. Each optional field must be conditionally rendered only when data exists.

### MISSING: Non-existent event slug returns 404
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-013
If event detail pages exist (see EVENTS-007), navigating to a non-existent slug (e.g., `/pt/eventos/evento-inexistente-999`) must return HTTP 404 with a user-friendly 404 page — not a 500 error, not a blank page, and not an unhandled GROQ query error. The 404 page must include navigation back to `/pt/eventos` and the home page. This mirrors VAL-CONTENT-009 and VAL-BLOG-009 for their respective content types.

### MISSING: Event keyboard accessibility in listing
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-014
Event cards in the listing must be keyboard-navigable. Verify: (a) each event card is focusable (if it is a link/button), (b) the Tab order follows visual order, (c) a visible focus indicator (focus ring) appears on the currently focused card, (d) Enter or Space activates the card (navigates to detail, if applicable). If event cards are not interactive (listing-only), this should be noted.

### MISSING: Event image loading failure
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-015
If an event has an `image` field but the image fails to load (broken CDN URL, deleted Sanity asset), the page must handle it gracefully. Verify: (a) the event card does not collapse or break layout, (b) a fallback placeholder replaces the broken image, (c) the event's title, date, and other info remain visible and intact.

---

## Events: Missing Cross-Feature Interactions

### MISSING: Event linking to related blog post
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-016
If the Sanity `event` schema supports a `relatedPost` reference field, or if an event description mentions a blog post, verify that links from events to blog posts navigate correctly and preserve locale. Even if not explicitly designed, the contract should note whether event-to-blog linking is expected or out of scope. This is a common content-pattern gap: users reading about an event may want to read related news.

### MISSING: Event sharing / Add-to-calendar
**Area:** EVENTS
**Suggested ID:** VAL-EVENTS-017
If event sharing or calendar integration is expected: (a) each event detail page should have a share URL that resolves correctly, (b) an "Add to Google Calendar" or "Download .ics" link should be present and generate a valid iCalendar file with the correct date, time, title, and description. If this is out of scope for the migration, the contract should state it. The mission context mentions events listing but is silent on calendar integration.

---

## Cross-Area Gaps

### MISSING: 404 page consistency with site chrome
**Area:** CROSS
**Suggested ID:** VAL-CROSS-016
The 404 page (tested by VAL-CONTENT-009 and VAL-BLOG-009 for specific routes) must be verified for general routes and must include all site chrome. Verify: (a) navigating to any non-existent route (e.g., `/pt/pagina-inexistente`, `/es/ruta-invalida`) renders the 404 page, (b) the 404 page includes the global header with working navigation links, (c) the footer is present with all social links and copyright, (d) the language switcher is functional on the 404 page (switch to ES shows Spanish 404 text), (e) the 404 page renders correctly at mobile, tablet, and desktop breakpoints. Current contract only checks 404 for content subpages and blog posts, not for arbitrary routes or for chrome consistency on the 404 page itself.

### MISSING: Scroll position preservation on locale switch
**Area:** CROSS
**Suggested ID:** VAL-CROSS-017
When the user switches locale (PT ↔ ES) on a long page scrolled partway down, the current scroll position should be preserved after the locale switch. Verify: (a) scroll to the middle of `/pt/noticias`, switch to ES — the page should restore approximately the same scroll offset, (b) the user should not be jolted to the top of the page on every locale switch. This is a common i18n UX regression and is not covered by VAL-CROSS-003 (which only checks URL path preservation).

### MISSING: Browser back/forward navigation with locale routing
**Area:** CROSS
**Suggested ID:** VAL-CROSS-018
Browser native back and forward buttons must work correctly with the Next.js + next-intl locale routing. Verify: (a) navigate `/pt` → `/pt/galeria` → `/pt/noticias`, then press Back — URL and page content return to `/pt/galeria` without a full reload, (b) Forward returns to `/pt/noticias`, (c) switching locale and pressing Back returns to the previous locale and page (e.g., `/pt/galeria` → switch to `/es/galeria` → Back returns to `/pt/galeria`), (d) no redirect loops or history corruption.

### MISSING: Focus management on client-side page transitions
**Area:** CROSS
**Suggested ID:** VAL-CROSS-019
When navigating between pages via Next.js `<Link>` (client-side transition), keyboard focus must be managed for accessibility. Verify: (a) after a client-side navigation, focus moves to the top of the new page content (e.g., a skiplink target, the `<main>` element, or the `<h1>`), (b) focus does NOT remain on the nav link that was clicked (which would trap the user at the top of the page), (c) screen readers announce the new page title after navigation. This is critical for keyboard-only and screen-reader users and is not covered by any existing assertion.

### MISSING: Skip-to-main-content link
**Area:** CROSS
**Suggested ID:** VAL-CROSS-020
Every page must include a "skip to main content" link as the first focusable element. Verify: (a) pressing Tab on page load reveals a visible "Skip to content" (or localized equivalent: "Ir para o conteúdo" / "Ir al contenido") link, (b) activating the link moves focus to the `<main>` element, bypassing the navigation, (c) the skip link is visible on focus (not permanently hidden with `display: none` which removes it from the accessibility tree). This is a WCAG 2.1 Level A requirement and missing from the contract.

### MISSING: ARIA landmark roles on all pages
**Area:** CROSS
**Suggested ID:** VAL-CROSS-021
Every page must use ARIA landmark roles to help screen reader users navigate. Verify: (a) `<header>` or `role="banner"` wraps the site header, (b) `<nav>` or `role="navigation"` wraps primary navigation, (c) `<main>` or `role="main"` wraps the primary content, (d) `<footer>` or `role="contentinfo"` wraps the site footer, (e) if there is secondary navigation (sidebar, breadcrumbs), it is inside a `<nav>` with a unique `aria-label`. Verify this holds on every page type: home, content pages, blog listing, blog post, gallery, events, and 404.

### MISSING: JavaScript disabled — graceful degradation
**Area:** CROSS
**Suggested ID:** VAL-CROSS-022
With JavaScript disabled in the browser, the site must still render meaningful content. Verify: (a) static content (headings, paragraphs, images with `src`) renders without JS, (b) the language switcher works via server-side redirect or fallback links (not just JS-driven), (c) navigation links are standard `<a href>` elements that work without JS (full page reload is acceptable), (d) critical information (CIG calendar, solar date, word of the day) is either server-rendered or shows a graceful fallback, (e) no completely blank white page. This validates that the site uses server components appropriately and does not rely entirely on client-side hydration.

### MISSING: Loading states during client-side navigation
**Area:** CROSS
**Suggested ID:** VAL-CROSS-023
When navigating between pages via client-side routing, if the next page's data takes time to load (Sanity API latency, slow network), a loading indicator must be shown. Verify: (a) clicking a link triggers a visual loading indicator (top-of-page progress bar, skeleton, or spinner) within 200ms, (b) the indicator is removed when the page content renders, (c) if navigation completes in under 200ms, no flash of the loading indicator occurs. This is especially important for blog posts and content pages that fetch from Sanity. Next.js `loading.js` or `Suspense` boundaries are the expected implementation.

### MISSING: hreflang tags for multilingual SEO
**Area:** CROSS
**Suggested ID:** VAL-CROSS-024
Every page must include `<link rel="alternate" hreflang="...">` tags in the `<head>` so search engines understand the bilingual structure. Verify: (a) `/pt/...` pages include `<link rel="alternate" hreflang="es" href="[full ES URL]">`, (b) `/es/...` pages include `<link rel="alternate" hreflang="pt" href="[full PT URL]">`, (c) each page includes a self-referencing hreflang tag, (d) the `x-default` hreflang points to the default locale (`/pt`). Without this, search engines may index the wrong language version or treat the two locales as duplicate content.

### MISSING: Canonical URL tag on every page
**Area:** CROSS
**Suggested ID:** VAL-CROSS-025
Every page must include a `<link rel="canonical">` tag pointing to the canonical URL for that page in its locale. Verify: (a) `/pt/galeria` has `<link rel="canonical" href="https://familias.org.br/pt/galeria">`, (b) the canonical URL uses the production domain, not localhost, (c) there are no conflicting canonical tags on the same page. This prevents duplicate-content SEO penalties.

### MISSING: Structured data / JSON-LD for rich results
**Area:** CROSS
**Suggested ID:** VAL-CROSS-026
Key page types should include JSON-LD structured data for search engine rich results. Verify: (a) the home page includes `Organization` or `WebSite` schema with name, URL, and social links, (b) blog post detail pages include `Article` or `BlogPosting` schema with headline, datePublished, author, and image, (c) event pages include `Event` schema with name, startDate, location (if applicable). If structured data is out of scope for the migration, the contract should state that. It is a standard SEO deliverable for content-heavy sites.

### MISSING: Sitemap.xml and robots.txt
**Area:** CROSS
**Suggested ID:** VAL-CROSS-027
The site must serve `/sitemap.xml` and `/robots.txt` at the root. Verify: (a) `GET /sitemap.xml` returns HTTP 200 with valid XML listing all major pages in both locales with correct `<xhtml:link rel="alternate" hreflang="...">` annotations, (b) `GET /robots.txt` returns HTTP 200 and references the sitemap, (c) neither file is blocked by authentication or returns HTML instead of plain text/XML.

### MISSING: Color contrast meets WCAG AA minimum
**Area:** CROSS
**Suggested ID:** VAL-CROSS-028
Text content across the site must meet WCAG 2.1 AA color contrast requirements. Verify: (a) body text has at least 4.5:1 contrast ratio against its background, (b) large text (>= 18px or >= 14px bold) has at least 3:1 contrast, (c) navigation links, buttons, and form elements have at least 3:1 contrast against adjacent colors, (d) focus indicators have at least 3:1 contrast. Test on key pages: home, blog listing, gallery, and events — especially on any custom-colored sections (hero, CIG calendar, word of the day).

### MISSING: Visible focus indicators on all interactive elements
**Area:** CROSS
**Suggested ID:** VAL-CROSS-029
All interactive elements (links, buttons, form inputs, language switcher, hamburger menu, category filters, pagination) must have a visible focus indicator when focused via keyboard. Verify: (a) no element uses `outline: none` without providing an alternative focus style, (b) the focus indicator is clearly visible (minimum 2px outline or equivalent contrast), (c) focus indicators are consistent across all pages. Test by tabbing through the home page, blog listing, and gallery.

### MISSING: Font loading strategy — no invisible text during load
**Area:** CROSS
**Suggested ID:** VAL-CROSS-030
If custom web fonts are used, the site must use `font-display: swap` (or equivalent) so text remains visible during font load. Verify: (a) on a throttled connection, text content renders immediately in a fallback font rather than being invisible (FOIT — Flash of Invisible Text), (b) once the custom font loads, text swaps without layout shift, (c) the swap does not cause CLS beyond acceptable thresholds. This is a Core Web Vital consideration and directly affects perceived performance.

### MISSING: Network offline — previously loaded pages remain navigable
**Area:** CROSS
**Suggested ID:** VAL-CROSS-031
If the network goes offline after the initial page load (simulated via DevTools offline mode), verify: (a) client-side navigation between already-visited pages (via Next.js prefetch/cache) continues to work, (b) navigating to a page not in cache shows a user-friendly offline message, not a blank page or cryptic error, (c) the browser does not show a "No Internet" dinosaur for same-origin navigations that are served from the client-side cache. This is a stretch goal but increasingly expected of modern Next.js sites.

### MISSING: Error boundary behavior on each page type
**Area:** CROSS
**Suggested ID:** VAL-CROSS-032
If a React component throws an unhandled error during render, an error boundary should catch it and display a fallback UI rather than a blank white page. Verify: (a) each major page section (hero, CIG calendar, word of the day, gallery grid, event list, blog list, content body) is wrapped in an error boundary, (b) an error in one section does not crash the entire page — other sections above and below the error boundary render normally, (c) the error fallback UI is localized and includes a way to recover (e.g., a "try again" button or a link to reload). This is distinct from VAL-CROSS-010 which only checks that no errors *occur* — it doesn't check what happens *if* an error occurs.

---

## Over-Specification / Redundancy in Cross-Area

### PARTIALLY REDUNDANT: VAL-CROSS-009 and VAL-CROSS-010
**Area:** CROSS
**Suggested ID:** N/A (tighten, not remove)
VAL-CROSS-009 (no broken links or images on any page) and VAL-CROSS-010 (no JS errors on every page) are broad crawls that partly duplicate per-page assertions. Every page assertion already checks console-errors. VAL-CROSS-009 adds value by checking all pages holistically for broken links, but VAL-CROSS-010 mostly re-checks what individual assertions already verify. Suggested: merge into a single "Full-site integrity sweep" assertion that covers: (a) zero internal 404s across all pages, (b) zero broken images, (c) zero console errors (all three in one crawl). This reduces test-execution redundancy without losing coverage.

### OVER-SPECIFIED: VAL-CROSS-014 minimum tap target and font size thresholds
**Area:** CROSS
**Suggested ID:** N/A (soften language)
VAL-CROSS-014 specifies "tap targets (>= 44x44px)" and "text is readable (>= 14px equivalent)". These are specific WCAG recommendations but the exact pixel values are implementation details that may vary by design. Suggested: rephrase as "interactive elements must have adequate touch target size (not visibly too small to tap on mobile)" and "text must be comfortably readable at default zoom." The spirit of the assertion (readability on mobile) is correct, but hard thresholds risk false failures over a 1px deviation.

---

## Cross-Feature Interaction Gaps

### MISSING: Gallery navigation to home and back
**Area:** CROSS
**Suggested ID:** VAL-CROSS-033
VAL-CROSS-001 checks that nav links work, but does not verify a specific round-trip: (a) from `/pt/galeria`, click the site logo or "Home" link → navigates to `/pt`, (b) from `/pt`, click "Galeria" → navigates to `/pt/galeria`, (c) the browser Back button after (b) returns to `/pt` with the correct scroll position. This is a basic UX flow that should be verified for all major sections (also: home ↔ events, home ↔ blog, blog post ↔ listing, gallery ↔ home, events ↔ home).

### MISSING: Event detail back-link to events listing
**Area:** CROSS
**Suggested ID:** VAL-CROSS-034
If event detail pages exist (see EVENTS-007), verify that navigating from the events listing to a detail page and then clicking a "Back to events" link or breadcrumb returns the user to `/pt/eventos` (or `/es/eventos`) with the correct locale preserved. Without this, users can get trapped on a detail page with no clear way back to the listing. This pattern should also hold for blog posts (blog listing ↔ post detail), covered partially by VAL-XCUT-001 but not for events.

### MISSING: Locale-switch from 404 preserves the non-existent path
**Area:** CROSS
**Suggested ID:** VAL-CROSS-035
When on a 404 page for a non-existent route (e.g., `/pt/rota-invalida`), switching locale should navigate to `/es/rota-invalida` (preserving the path but switching the locale prefix), which should also render a 404 in Spanish. The locale switcher must not redirect to the home page when on a 404, nor crash. This is an edge case not covered by VAL-CROSS-003.

---

## Summary of Findings

| # | Area | Suggested ID | Type |
|---|---|---|---|
| 1 | GALLERY | VAL-GALLERY-008 | Missing flow: lightbox/modal |
| 2 | GALLERY | VAL-GALLERY-009 | Missing a11y: lightbox keyboard/screen-reader |
| 3 | GALLERY | VAL-GALLERY-010 | Missing error: broken image per-item |
| 4 | GALLERY | VAL-GALLERY-011 | Missing perf: lazy loading |
| 5 | GALLERY | VAL-GALLERY-012 | Missing perf: CLS prevention |
| 6 | GALLERY | VAL-GALLERY-013 | Missing: responsive grid |
| 7 | GALLERY | VAL-GALLERY-014 | Missing flow: captions/descriptions |
| 8 | GALLERY | VAL-GALLERY-015 | Missing error: Sanity timeout |
| 9 | GALLERY | (relocate) | Misplaced: GALLERY-006 YouTube |
| 10 | GALLERY | (relocate) | Misplaced: GALLERY-007 external links |
| 11 | EVENTS | VAL-EVENTS-007 | Missing flow: event detail page |
| 12 | EVENTS | VAL-EVENTS-008 | Missing: time display |
| 13 | EVENTS | VAL-EVENTS-009 | Missing: multi-day range |
| 14 | EVENTS | VAL-EVENTS-010 | Missing edge: single event |
| 15 | EVENTS | VAL-EVENTS-011 | Missing edge: all past events |
| 16 | EVENTS | VAL-EVENTS-012 | Missing edge: null optional fields |
| 17 | EVENTS | VAL-EVENTS-013 | Missing error: 404 for bad event slug |
| 18 | EVENTS | VAL-EVENTS-014 | Missing a11y: keyboard nav |
| 19 | EVENTS | VAL-EVENTS-015 | Missing error: broken event image |
| 20 | EVENTS | VAL-EVENTS-016 | Missing cross: event ↔ blog linking |
| 21 | EVENTS | VAL-EVENTS-017 | Missing flow: add-to-calendar |
| 22 | CROSS | VAL-CROSS-016 | Missing: 404 chrome consistency |
| 23 | CROSS | VAL-CROSS-017 | Missing: scroll preservation on locale switch |
| 24 | CROSS | VAL-CROSS-018 | Missing: back/forward navigation |
| 25 | CROSS | VAL-CROSS-019 | Missing a11y: focus management on nav |
| 26 | CROSS | VAL-CROSS-020 | Missing a11y: skip-to-content |
| 27 | CROSS | VAL-CROSS-021 | Missing a11y: ARIA landmarks |
| 28 | CROSS | VAL-CROSS-022 | Missing: JS-disabled graceful degradation |
| 29 | CROSS | VAL-CROSS-023 | Missing: loading states during nav |
| 30 | CROSS | VAL-CROSS-024 | Missing SEO: hreflang tags |
| 31 | CROSS | VAL-CROSS-025 | Missing SEO: canonical URLs |
| 32 | CROSS | VAL-CROSS-026 | Missing SEO: JSON-LD structured data |
| 33 | CROSS | VAL-CROSS-027 | Missing SEO: sitemap.xml + robots.txt |
| 34 | CROSS | VAL-CROSS-028 | Missing a11y: color contrast |
| 35 | CROSS | VAL-CROSS-029 | Missing a11y: focus indicators |
| 36 | CROSS | VAL-CROSS-030 | Missing perf: font-display strategy |
| 37 | CROSS | VAL-CROSS-031 | Missing: offline handling |
| 38 | CROSS | VAL-CROSS-032 | Missing: error boundary behavior |
| 39 | CROSS | VAL-CROSS-033 | Missing cross: round-trip navigation flows |
| 40 | CROSS | VAL-CROSS-034 | Missing cross: event back-to-listing |
| 41 | CROSS | VAL-CROSS-035 | Missing edge: locale switch from 404 |
| 42 | CROSS | (tighten) | Redundant: merge CROSS-009 + CROSS-010 |
| 43 | CROSS | (soften) | Over-specified: CROSS-014 pixel thresholds |
