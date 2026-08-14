import type { ReactNode } from "react";

/**
 * Home-specific layout for the replicated Wix home page.
 *
 * The home page has its own full-page markup (the shared Header/Footer come
 * from the parent `[locale]/layout.tsx`); this group only adds a scoping root
 * so any home-only styling can be targeted via `.wix-home` without leaking to
 * the other routes (which keep the existing shared layout).
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return <div className="wix-home">{children}</div>;
}
