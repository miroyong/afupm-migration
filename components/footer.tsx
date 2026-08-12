import { getTranslations } from "next-intl/server";

// Defaults used until the siteSettings singleton is populated in Sanity.
// Editors can override these via siteSettings.socialLinks.
const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/channel/UCxRwNt76-Hvj1rIEKqfsikA",
  instagram: "https://www.instagram.com/afupm",
};

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center">
        <div>
          <p className="text-lg font-bold text-blue-900">{t("siteName")}</p>
          <p className="mt-1 max-w-md text-sm text-gray-600">{t("tagline")}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-gray-800">{t("followUs")}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition-colors hover:text-blue-900"
            >
              YouTube
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition-colors hover:text-blue-900"
            >
              Instagram
            </a>
            <a
              href="https://purewaterwave.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition-colors hover:text-blue-900"
            >
              {t("pureWaterWave")}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {year} {t("siteName")}. {t("rights")}
      </div>
    </footer>
  );
}
