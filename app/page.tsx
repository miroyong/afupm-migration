import { redirect } from "next/navigation";

// The middleware usually handles `/` (locale detection + redirect). This
// fallback guarantees the default locale even if the middleware is skipped.
export default function RootPage() {
  redirect("/pt");
}
