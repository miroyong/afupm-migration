import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 py-20 text-white sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 sm:text-xl">
          {t("subtitle")}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm italic text-blue-200 sm:text-base">
          {t("tagline")}
        </p>
      </div>
    </section>
  );
}
