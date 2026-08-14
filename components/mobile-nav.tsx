"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { isPathActive, NAV_ITEMS } from "@/components/nav-config";

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
        className="rounded-md p-2 text-gray-dark transition-colors hover:bg-gray-100"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-20 border-b border-gray-light bg-white shadow-lg"
        >
          <div className="mx-auto flex max-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col gap-1 overflow-y-auto px-4 py-4 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const children = item.children ?? [];
              return (
                <div key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isPathActive(pathname, item.href) ? "page" : undefined}
                    className={`block rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                      isPathActive(pathname, item.href)
                        ? "bg-green-pale text-green-deeper"
                        : "text-gray-dark hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                  {children.length > 0 && (
                    <div className="ml-4 border-l border-gray-light pl-2">
                      {children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          aria-current={isPathActive(pathname, child.href) ? "page" : undefined}
                          className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                            isPathActive(pathname, child.href)
                              ? "font-medium text-primary"
                              : "text-gray-mid hover:text-primary"
                          }`}
                        >
                          {t(`nav.${child.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
