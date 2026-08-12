import { setRequestLocale } from "next-intl/server";
import { getEvents } from "@/lib/sanity";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const events = await getEvents(locale);

  const now = new Date();
  const upcomingEvents = events.filter((e: { date: string }) => new Date(e.date) >= now);
  const pastEvents = events.filter((e: { date: string }) => new Date(e.date) < now);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="mb-8 text-3xl font-bold">{locale === "es" ? "Eventos" : "Eventos"}</h1>
      {upcomingEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{locale === "es" ? "Próximos eventos" : "Próximos eventos"}</h2>
          <div className="space-y-4">
            {upcomingEvents.map((e: { _id: string; title: string; date: string; location?: string; description?: unknown[] }) => (
              <div key={e._id} className="rounded-lg border p-4">
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}</p>
                {e.location && <p className="text-sm text-gray-500">{e.location}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-400">{locale === "es" ? "Eventos pasados" : "Eventos passados"}</h2>
          <div className="space-y-4 opacity-60">
            {pastEvents.map((e: { _id: string; title: string; date: string; location?: string }) => (
              <div key={e._id} className="rounded-lg border p-4">
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString(locale === "es" ? "es-ES" : "pt-BR")}</p>
                {e.location && <p className="text-sm text-gray-500">{e.location}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {events.length === 0 && <p className="text-gray-500">{locale === "es" ? "No hay eventos" : "Nenhum evento"}</p>}
    </div>
  );
}
