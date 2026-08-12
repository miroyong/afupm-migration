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
The phrase displayed must change each calendar day according to a deterministic rotation based on the fixed epoch 2020-01-01. The index calculation `Math.floor((today − epoch) / msPerDay) % collectionSize` must select a phrase. Verify that:
- The same day (same UTC date) always returns the same phrase across multiple page loads.
- A different UTC date returns a different phrase (or the same phrase only if `collectionSize` divides the day delta).
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
