import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/lib/sanity";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = await getPage(slug.join("/"), locale);
  if (!page) notFound();
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="mb-6 text-3xl font-bold">{page.title}</h1>
      <div className="prose max-w-none"><PortableText value={page.body} /></div>
    </div>
  );
}
