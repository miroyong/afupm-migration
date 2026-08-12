"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * PT/ES language switcher. Preserves the current path (and route params) when
 * switching locales, e.g. `/pt/sobre/visao` -> `/es/sobre/visao`.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const target = locale === "pt" ? "es" : "pt";
  const targetLabel = target === "es" ? "Español" : "Português";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: target })}
      aria-label={t("switchToLocale", { locale: targetLabel })}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50"
    >
      {target.toUpperCase()}
    </button>
  );
}
