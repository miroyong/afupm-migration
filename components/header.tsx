"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { isDropdownActive, isPathActive, NAV_ITEMS } from "@/components/nav-config";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-light bg-white">
      <nav
        aria-label={t("navLabel")}
        className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="AFUPM">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-top.png"
            alt="AFUPM"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isDropdownActive(pathname, item);
            const hasChildren = item.children && item.children.length > 0;

            if (!hasChildren) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isPathActive(pathname, item.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
                    active
                      ? "text-primary"
                      : "text-gray-dark hover:text-primary"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              );
            }

            return (
              <div key={item.key} className="group relative">
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
                    active ? "text-primary" : "text-gray-dark hover:text-primary"
                  }`}
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {t(`nav.${item.key}`)}
                  <ChevronIcon />
                </button>
                <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-lg border border-gray-light bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children!.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      aria-current={isPathActive(pathname, child.href) ? "page" : undefined}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isPathActive(pathname, child.href)
                          ? "bg-green-pale font-medium text-green-deeper"
                          : "text-gray-dark hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      {t(`nav.${child.key}`)}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right cluster: search, locale, login, mobile toggle */}
        <div className="flex items-center gap-2">
          <label className="hidden items-center gap-2 rounded-full border border-gray-light bg-gray-50 px-3 py-1.5 md:flex">
            <SearchIcon />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="w-36 bg-transparent text-sm text-gray-dark placeholder:text-gray-mid focus:outline-none"
            />
          </label>

          <LocaleSwitcher />

          <button
            type="button"
            className="hidden rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-deep sm:block"
          >
            {t("login")}
          </button>

          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
