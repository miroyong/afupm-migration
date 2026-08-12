import { setRequestLocale } from "next-intl/server";
import { getGalleryImages } from "@/lib/sanity";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const images = await getGalleryImages(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="mb-8 text-3xl font-bold">{locale === "es" ? "Galería" : "Galeria"}</h1>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img: { _id: string; image: { asset: { url: string } }; alt: string }) => (
            <img key={img._id} src={img.image.asset.url} alt={img.alt}
              className="h-64 w-full rounded-lg object-cover" loading="lazy" />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{locale === "es" ? "No hay fotos disponibles" : "Nenhuma foto disponível"}</p>
      )}
    </div>
  );
}
