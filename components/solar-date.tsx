"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatSolarDate } from "@/lib/lunar";

/**
 * Gregorian ("solar") date display, formatted as DD.MM.YYYY weekday per
 * locale. Computed client-side from the visitor's system clock.
 */
export function SolarDate() {
  const locale = useLocale() as "pt" | "es";
  const t = useTranslations("home.solar");
  const [label, setLabel] = useState<string>("—");

  useEffect(() => {
    setLabel(formatSolarDate(new Date(), locale));
  }, [locale]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-blue-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-gray-500">{t("description")}</p>
      <p className="mt-6 text-center text-2xl font-semibold text-gray-900">
        {label}
      </p>
    </section>
  );
}
