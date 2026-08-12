import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals and files with extensions; everything
  // else (including the root `/`) gets locale-prefixed routing with
  // Accept-Language detection.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
