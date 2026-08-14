import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGalleryImages } from "@/lib/sanity";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.galeria");
  const images = await getGalleryImages(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full bg-primary" />
        <h1 className="text-3xl font-bold text-primary-deep">{t("title")}</h1>
      </div>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img: { _id: string; url: string; alt: string }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img._id}
              src={img.url}
              alt={img.alt}
              className="h-64 w-full rounded-lg object-cover shadow-sm"
              loading="lazy"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-mid">{t("empty")}</p>
      )}
    </div>
  );
}
