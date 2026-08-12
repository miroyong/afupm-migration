"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { isPathActive, NAV_LINKS } from "@/components/nav-config";

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function MobileNav() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-gray-200 bg-white shadow-lg"
        >
          <div className="mx-auto flex max-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col gap-1 overflow-y-auto px-4 py-4 sm:px-6">
            {NAV_LINKS.map(({ href, key }) => {
              const active = isPathActive(pathname, href);
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-blue-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-900"
                  }`}
                >
                  {t(`nav.${key}`)}
                </Link>
              );
            })}
            <div className="mt-2 flex items-center justify-start border-t border-gray-100 pt-3">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
