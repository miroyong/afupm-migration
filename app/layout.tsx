import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFUPM",
  description:
    "Associação das Famílias para a Unificação e a Paz Mundial",
};

// The <html> element is rendered in app/[locale]/layout.tsx so the `lang`
// attribute always reflects the active locale. This root layout only imports
// global styles and passes children through (recommended next-intl pattern).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
