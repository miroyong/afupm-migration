"use client";

import { useTranslations } from "next-intl";

/** "Ir para o Topo" button that smooth-scrolls the window to the top. */
export function BackToTop() {
  const t = useTranslations("footer");

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      {t("backToTop")}
    </button>
  );
}
