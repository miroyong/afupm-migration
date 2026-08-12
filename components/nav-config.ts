// Shared navigation configuration used by both the desktop header nav and the
// mobile menu. Keys map to `header.nav.<key>` in the message files.
export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/sobre", key: "sobre" },
  { href: "/noticias", key: "noticias" },
  { href: "/eventos", key: "eventos" },
  { href: "/galeria", key: "galeria" },
  { href: "/bencao", key: "bencao" },
  { href: "/anuncios", key: "anuncios" },
  { href: "/sedes", key: "sedes" },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]["key"];

// next-intl's usePathname() returns the path without the locale prefix, so
// active-state matching can compare against the raw hrefs.
export function isPathActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
