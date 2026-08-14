import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEvents } from "@/lib/sanity";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.eventos");
  const events = await getEvents(locale);

  const now = new Date();
  const upcomingEvents = events.filter((e: { date: string }) => new Date(e.date) >= now);
  const pastEvents = events.filter((e: { date: string }) => new Date(e.date) < now);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full bg-primary" />
        <h1 className="text-3xl font-bold text-primary-deep">{t("title")}</h1>
      </div>
      {upcomingEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-navy">{t("upcoming")}</h2>
          <div className="space-y-4">
            {upcomingEvents.map((e: { _id: string; title: string; date: string; location?: string; description?: unknown[] }) => (
              <div key={e._id} className="rounded-lg border border-gray-light p-4 shadow-sm">
                <h3 className="font-semibold text-navy">{e.title}</h3>
                <p className="text-sm text-gray-mid">{new Date(e.date).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}</p>
                {e.location && <p className="text-sm text-gray-mid">{e.location}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-mid">{t("past")}</h2>
          <div className="space-y-4 opacity-60">
            {pastEvents.map((e: { _id: string; title: string; date: string; location?: string }) => (
              <div key={e._id} className="rounded-lg border border-gray-light p-4">
                <h3 className="font-semibold text-navy">{e.title}</h3>
                <p className="text-sm text-gray-mid">{new Date(e.date).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}</p>
                {e.location && <p className="text-sm text-gray-mid">{e.location}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {events.length === 0 && <p className="text-gray-mid">{t("empty")}</p>}
    </div>
  );
}
