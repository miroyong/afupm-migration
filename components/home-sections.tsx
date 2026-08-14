import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEvents, getFeaturedPosts } from "@/lib/sanity";

type FeaturedPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string | null;
  publishedAt: string;
  mainImageUrl?: string | null;
};

/** "QUADRO DE AVISOS" — upcoming events, or an empty-state message. */
export async function NoticesSection() {
  const locale = (await getLocale()) as "pt" | "es";
  const t = await getTranslations("home.sections");
  const events = await getEvents(locale);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full bg-orange-brand" />
        <h2 className="text-xl font-bold tracking-wide text-navy sm:text-2xl">
          {t("quadroDeAvisos")}
        </h2>
      </div>
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((e: { _id: string; title: string; date: string; location?: string }) => (
            <li
              key={e._id}
              className="rounded-xl border border-gray-light bg-white p-4 shadow-sm"
            >
              <p className="font-heading font-semibold text-navy">{e.title}</p>
              <p className="mt-1 text-sm text-gray-mid">
                {new Date(e.date).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}
                {e.location ? ` — ${e.location}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-gray-light bg-gray-50 px-5 py-6 text-center text-gray-mid">
          {t("noEvents")}
        </p>
      )}
    </section>
  );
}

/** "DESTAQUES" — featured (or latest) posts. */
export async function FeaturedSection() {
  const locale = (await getLocale()) as "pt" | "es";
  const t = await getTranslations("home.sections");
  const posts = await getFeaturedPosts(locale, 3);

  return (
    <section className="bg-green-pale">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-green-dark" />
          <h2 className="text-xl font-bold tracking-wide text-green-deeper sm:text-2xl">
            {t("destaques")}
          </h2>
        </div>
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: FeaturedPost) => (
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
                  <div className="flex h-44 w-full items-center justify-center bg-green-light text-green-deeper">
                    <span className="text-xs font-semibold uppercase tracking-widest">AFUPM</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-heading text-base font-semibold leading-snug text-navy group-hover:text-primary">
                    {post.title}
                  </h3>
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
      </div>
    </section>
  );
}

/** "CONHEÇA MAIS SOBRE A ASSOCIAÇÃO DAS FAMÍLIAS" — intro + CTA. */
export async function AboutSection() {
  const t = await getTranslations("home.sections");

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="grid items-center gap-8 rounded-2xl border border-gray-light bg-white p-8 shadow-sm sm:p-10 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-primary-deep sm:text-3xl">
            {t("conhecaMais")}
          </h2>
          <p className="mt-4 max-w-2xl text-gray-mid">{t("conhecaMaisText")}</p>
        </div>
        <Link
          href="/sobre"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-7 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-deep"
        >
          {t("conhecaMaisCta")}
        </Link>
      </div>
    </section>
  );
}
