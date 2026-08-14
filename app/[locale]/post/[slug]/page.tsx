import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPost } from "@/lib/sanity";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.post");
  const post = await getPost(slug, locale);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <Link href={`/${locale}/noticias`} className="mb-6 inline-block text-sm text-primary hover:underline">
        ← {t("back")}
      </Link>
      <h1 className="mb-4 text-3xl font-bold text-navy">{post.title}</h1>
      <p className="mb-6 text-sm text-gray-mid">{new Date(post.publishedAt).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}</p>
      {post.mainImageUrl && <img src={post.mainImageUrl} alt={post.title} className="mb-6 w-full rounded-lg shadow-sm" />}
      <div className="prose max-w-none"><PortableText value={post.body} /></div>
      {post.categories && (
        <div className="mt-8 flex gap-2">
          {post.categories.map((cat: { _id: string; title: string; slug: { current: string } }) => (
            <Link key={cat._id} href={`/${locale}/noticias?categoria=${cat.slug.current}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-dark hover:bg-gray-200">
              {cat.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
