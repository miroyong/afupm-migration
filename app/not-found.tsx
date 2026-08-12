import { redirect } from "next/navigation";

// Root-level 404 fallback for paths that don't reach the [locale] segment
// (the middleware normally redirects those to the default locale).
export default function NotFound() {
  redirect("/pt");
}
