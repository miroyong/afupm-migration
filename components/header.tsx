"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { isPathActive, NAV_LINKS } from "@/components/nav-config";

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav
        aria-label={t("navLabel")}
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center text-xl font-extrabold tracking-tight text-blue-900"
        >
          AFUPM
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ href, key }) => {
            const active = isPathActive(pathname, href);
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-900"
                }`}
              >
                {t(`nav.${key}`)}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
