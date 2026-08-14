import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { WordOfTheDay } from "@/components/word-of-the-day";
import { NewsSection } from "@/components/news-section";
import {
  AboutSection,
  FeaturedSection,
  NoticesSection,
} from "@/components/home-sections";

// The "Palavra do Dia" rotates daily (UTC date) and the CIG/solar dates are
// client-computed, so the home page is rendered per request.
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
      <WordOfTheDay />

      <div className="mt-12">
        <NewsSection
          titleKey="noticiasNacionais"
          category="noticias-nacionais"
          moreHref="/noticias"
        />
        <NewsSection
          titleKey="informesHyojeong"
          category="informe-hj"
          moreHref="/noticias"
          tone="warm"
        />
        <NoticesSection />
      </div>

      <FeaturedSection />
      <AboutSection />
    </div>
  );
}
