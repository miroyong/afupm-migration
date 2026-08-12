import { setRequestLocale } from "next-intl/server";
import { CigCalendar } from "@/components/cig-calendar";
import { Hero } from "@/components/hero";
import { SolarDate } from "@/components/solar-date";
import { WordOfTheDay } from "@/components/word-of-the-day";

// The "Palavra do Dia" rotates daily (UTC date), so the home page is rendered
// per request rather than statically at build time.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14">
        <CigCalendar />
        <SolarDate />
        <WordOfTheDay />
      </div>
    </div>
  );
}
