import { setRequestLocale } from "next-intl/server";
import { getPosts, getPostCategories } from "@/lib/sanity";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await getPosts(locale);
  const categories = await getPostCategories(locale);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-8 text-3xl font-bold">{locale === "es" ? "Noticias" : "Notícias"}</h1>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat: { _id: string; title: string; slug: { current: string } }) => (
            <Link key={cat._id} href={`/${locale}/noticias?categoria=${cat.slug.current}`}
              className="rounded-full bg-gray-100 px-4 py-1 text-sm hover:bg-gray-200">
              {cat.title}
            </Link>
          ))}
        </div>
      )}
      <div className="grid gap-8">
        {posts.map((post: { _id: string; title: string; slug: { current: string }; excerpt?: string; publishedAt: string; mainImage?: { asset: { url: string } } }) => (
          <Link key={post._id} href={`/${locale}/post/${post.slug.current}`} className="group block rounded-lg border p-6 hover:border-gray-400">
            <h2 className="mb-2 text-xl font-semibold group-hover:text-blue-600">{post.title}</h2>
            {post.excerpt && <p className="mb-2 text-gray-600">{post.excerpt}</p>}
            <p className="text-sm text-gray-400">{new Date(post.publishedAt).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}</p>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <p className="text-gray-500">{locale === "es" ? "No hay artículos" : "Nenhum artigo"}</p>}
    </div>
  );
}
