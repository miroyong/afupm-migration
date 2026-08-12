import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-6xl font-bold text-blue-900">404</p>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="max-w-md text-gray-600">{t("description")}</p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-blue-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-800"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
