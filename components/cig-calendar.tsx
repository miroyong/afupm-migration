"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatCigDate, getCigDate } from "@/lib/lunar";

/**
 * CIG (Cheon Il Guk) lunar calendar display. Computed client-side from the
 * visitor's local date via moment-lunar. Renders a fallback if the
 * computation fails, so the section never crashes the page.
 */
export function CigCalendar() {
  const locale = useLocale() as "pt" | "es";
  const t = useTranslations("home.cig");
  const [label, setLabel] = useState<string>("—");

  useEffect(() => {
    setLabel(formatCigDate(getCigDate(new Date()), locale));
  }, [locale]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-blue-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-gray-500">{t("description")}</p>
      <p
        className="mt-6 text-center text-2xl font-semibold text-gray-900"
        aria-live="polite"
      >
        {label}
      </p>
    </section>
  );
}
