// Shared navigation configuration used by the desktop header nav and the
// mobile menu. Keys map to `header.nav.<key>` in the message files. The
// structure mirrors the original Wix masthead: SOBRE and MÍDIA and CENTRAL DE
// ANÚNCIOS are dropdowns, BÊNÇÃO is a plain link.
export type NavChild = { key: string; href: string };

export type NavItem = {
  key: string;
  href: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "sobre",
    href: "/sobre",
    children: [
      { key: "visao", href: "/sobre" },
      { key: "fundadores", href: "/sobre/fundadores" },
      { key: "mensagemPresidente", href: "/sobre/mensagem-presidente" },
      { key: "resolucao", href: "/sobre/resolucao" },
      { key: "novaVerdade", href: "/sobre/nova-verdade" },
      { key: "escrituras", href: "/sobre/escrituras" },
      { key: "historia", href: "/sobre/historia" },
      { key: "atividadesMissionarias", href: "/sobre/atividades-missionarias" },
      { key: "sedes", href: "/sedes" },
    ],
  },
  {
    key: "centralAnuncios",
    href: "/anuncios",
    children: [
      { key: "anuncios", href: "/anuncios" },
      { key: "eventos", href: "/eventos" },
    ],
  },
  { key: "bencao", href: "/bencao" },
  {
    key: "midia",
    href: "/galeria",
    children: [{ key: "galeria", href: "/galeria" }],
  },
];

export type NavKey = NavItem["key"] | NavChild["key"];

// next-intl's usePathname() returns the path without the locale prefix, so
// active-state matching can compare against the raw hrefs.
export function isPathActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Whether a dropdown item is "active" (used to highlight its parent). */
export function isDropdownActive(pathname: string, item: NavItem): boolean {
  if (isPathActive(pathname, item.href)) return true;
  return (item.children ?? []).some((c) => isPathActive(pathname, c.href));
}
