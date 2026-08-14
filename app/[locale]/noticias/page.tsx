import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts, getPostCategories } from "@/lib/sanity";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string | null;
  publishedAt: string;
  mainImageUrl?: string | null;
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.noticias");
  const posts = await getPosts(locale);
  const categories = await getPostCategories(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full bg-primary" />
        <h1 className="text-3xl font-bold text-primary-deep">{t("title")}</h1>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat: { _id: string; title: string; slug: { current: string } }) => (
            <Link
              key={cat._id}
              href={`/${locale}/noticias?categoria=${cat.slug.current}`}
              className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-dark transition-colors hover:bg-gray-200"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: Post) => (
          <Link
            key={post._id}
            href={`/${locale}/post/${post.slug.current}`}
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
            ) : null}
            <div className="flex flex-1 flex-col p-4">
              <h2 className="font-heading text-base font-semibold leading-snug text-navy group-hover:text-primary">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-mid">{post.excerpt}</p>
              )}
              <p className="mt-auto pt-3 text-xs text-gray-mid">
                {new Date(post.publishedAt).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && <p className="text-gray-mid">{t("empty")}</p>}
    </div>
  );
}
