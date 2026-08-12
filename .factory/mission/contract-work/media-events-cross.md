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
