import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPosts } from "@/lib/sanity";

type PostCard = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string | null;
  publishedAt: string;
  mainImageUrl?: string | null;
};

type NewsSectionProps = {
  titleKey: string;
  category?: string;
  moreHref?: string;
  max?: number;
  tone?: "blue" | "green" | "warm";
};

const TONE: Record<string, { bar: string; title: string }> = {
  blue: { bar: "bg-primary", title: "text-primary-deep" },
  green: { bar: "bg-green-dark", title: "text-green-deeper" },
  warm: { bar: "bg-terracotta", title: "text-terracotta" },
};

/**
 * A "news" section (e.g. "NOTÍCIAS NACIONAIS", "INFORMES HYOJEONG") rendering
 * a list of post cards filtered by Sanity category. Includes an optional
 * "+MAIS" link.
 */
export async function NewsSection({
  titleKey,
  category,
  moreHref,
  max = 3,
  tone = "blue",
}: NewsSectionProps) {
  const locale = (await getLocale()) as "pt" | "es";
  const t = await getTranslations("home.sections");

  const posts = await getPosts(locale, category);
  const shown = posts.slice(0, max);

  const toneStyle = TONE[tone] ?? TONE.blue;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`h-8 w-1.5 rounded-full ${toneStyle.bar}`} />
          <h2 className={`text-xl font-bold tracking-wide sm:text-2xl ${toneStyle.title}`}>
            {t(titleKey)}
          </h2>
        </div>
        {moreHref ? (
          <Link
            href={moreHref}
            className="shrink-0 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
          >
            {t("more")}
          </Link>
        ) : null}
      </div>

      {shown.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post: PostCard) => (
            <Link
              key={post._id}
              href={`/post/${post.slug.current}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-light bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {post.mainImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.mainImageUrl}
                  alt={post.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-green-pale text-green-dark">
                  <span className="text-xs font-semibold uppercase tracking-widest">AFUPM</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-heading text-base font-semibold leading-snug text-navy group-hover:text-primary">
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-mid">{post.excerpt}</p>
                ) : null}
                <p className="mt-auto pt-3 text-xs text-gray-mid">
                  {new Date(post.publishedAt).toLocaleDateString(
                    locale === "es" ? "es-ES" : "pt-BR"
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-mid">{t("noPosts")}</p>
      )}
    </section>
  );
}
