import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BackToTop } from "@/components/back-to-top";
import { getSiteSettings } from "@/lib/sanity";

// Defaults used until the siteSettings singleton is populated in Sanity.
const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@afupmmedia",
  facebook: "https://www.facebook.com/afupm",
};

type FooterColumn = { title: string; links: { key: string; href: string }[] };

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.5-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");
  const nt = await getTranslations("header");
  const year = new Date().getFullYear();

  let youtube = SOCIAL_LINKS.youtube;
  let facebook = SOCIAL_LINKS.facebook;
  try {
    const settings = await getSiteSettings();
    youtube = settings?.socialLinks?.youtube || youtube;
    facebook = settings?.socialLinks?.facebook || facebook;
  } catch {
    // fall back to defaults
  }

  const columns: FooterColumn[] = [
    {
      title: t("columns.sobre"),
      links: [
        { key: "visao", href: "/sobre" },
        { key: "fundadores", href: "/sobre/fundadores" },
        { key: "mensagemPresidente", href: "/sobre/mensagem-presidente" },
        { key: "resolucao", href: "/sobre/resolucao" },
        { key: "novaVerdade", href: "/sobre/nova-verdade" },
        { key: "historia", href: "/sobre/historia" },
        { key: "atividadesMissionarias", href: "/sobre/atividades-missionarias" },
      ],
    },
    {
      title: t("columns.anuncios"),
      links: [
        { key: "centralAnuncios", href: "/anuncios" },
        { key: "eventos", href: "/eventos" },
        { key: "bencao", href: "/bencao" },
      ],
    },
    {
      title: t("columns.sedes"),
      links: [
        { key: "sedes", href: "/sedes" },
        { key: "galeria", href: "/galeria" },
      ],
    },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          {/* Brand + columns */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="inline-flex" aria-label="AFUPM">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-bottom.png"
                alt="AFUPM"
                className="h-9 w-auto"
              />
            </Link>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                    {col.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {col.links.map((link) => (
                      <li key={link.key}>
                        <Link
                          href={link.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                        >
                          {nt(`nav.${link.key}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Social + back-to-top */}
          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex gap-3">
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <FacebookIcon />
              </a>
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <YoutubeIcon />
              </a>
            </div>
            <BackToTop />
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {year} {t("siteName")}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
