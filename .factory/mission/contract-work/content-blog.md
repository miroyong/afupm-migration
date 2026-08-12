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
