import { getLocale, getTranslations } from "next-intl/server";
import { client } from "@/lib/sanity";
import { pickWordOfDay } from "@/lib/word-of-day";

type WordOfTheDayDoc = {
  _id: string;
  phrase?: string | null;
  order?: number | null;
};

// Sorted by `order` in JS so documents without an order sort last, keeping the
// rotation deterministic by UTC date.
const WORD_OF_THE_DAY_QUERY = `*[_type == "wordOfTheDay" && language == $language][0...100] {
  _id,
  phrase,
  order
}`;

/**
 * Server-rendered "Palavra do Dia" card, styled after the original Wix widget
 * (a warm, colored card with a centered quote). Fetches the language-scoped
 * collection from Sanity and rotates deterministically by UTC date.
 */
export async function WordOfTheDay() {
  const locale = (await getLocale()) as "pt" | "es";
  const t = await getTranslations("home.wordOfTheDay");

  let phrase: string | null = null;
  try {
    const docs = await client.fetch<WordOfTheDayDoc[]>(WORD_OF_THE_DAY_QUERY, {
      language: locale,
    });
    const sorted = [...docs].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
    );
    const raw = pickWordOfDay(sorted)?.phrase;
    phrase = raw && raw.trim() ? raw.trim() : null;
  } catch {
    phrase = null;
  }

  return (
    <section className="mx-auto -mt-10 w-full max-w-3xl px-6">
      <div className="relative overflow-hidden rounded-2xl border border-terracotta-pale bg-cream px-6 py-8 shadow-md sm:px-10">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
          {t("title")}
        </h2>
        {phrase ? (
          <blockquote className="mt-5 text-center font-heading text-2xl font-medium italic leading-relaxed text-navy">
            “{phrase}”
          </blockquote>
        ) : (
          <p className="mt-5 text-center text-gray-mid">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
