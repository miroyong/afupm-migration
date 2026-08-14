"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatCigDate, formatSolarDate, getCigDate } from "@/lib/lunar";

/**
 * Full-bleed hero replicating the original Wix masthead banner. Shows the CIG
 * (Cheon Il Guk) lunar date and the solar date over a dark overlay on the
 * banner image. Dates are computed client-side from the visitor's clock.
 */
export function Hero() {
  const locale = useLocale() as "pt" | "es";
  const t = useTranslations("home.hero");
  const [cig, setCig] = useState<string>("—");
  const [solar, setSolar] = useState<string>("—");

  useEffect(() => {
    setCig(formatCigDate(getCigDate(new Date()), locale));
    setSolar(formatSolarDate(new Date(), locale));
  }, [locale]);

  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-navy sm:min-h-[480px]">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-bg.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 text-center text-white">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">
          {t("kicker")}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {cig}
        </h1>
        <p className="mt-4 text-lg text-white/90 sm:text-xl">{solar}</p>
        <p className="mx-auto mt-8 max-w-2xl text-base text-white/75 sm:text-lg">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}
