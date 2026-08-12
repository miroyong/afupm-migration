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
 * Server-rendered "Palavra do Dia" section. Fetches the language-scoped
 * collection from Sanity and rotates deterministically by UTC date. Falls back
 * to a localized message for empty collections or query failures.
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
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-blue-900">{t("title")}</h2>
      {phrase ? (
        <blockquote className="mt-6 text-center text-2xl font-medium italic leading-relaxed text-gray-800">
          “{phrase}”
        </blockquote>
      ) : (
        <p className="mt-6 text-center text-gray-500">{t("empty")}</p>
      )}
    </section>
  );
}
