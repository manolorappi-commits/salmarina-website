import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ReservationForm } from "@/components/ReservationForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reservierungen",
  description: "Tisch reservieren bei Salmarina in Hombrechtikon.",
};

export default function ReservierungenPage() {
  return (
    <div className="pb-16">
      <PageHero
        title="Reservierungen"
        intro="Teilen Sie uns Personenzahl, Datum und Uhrzeit mit — wir melden uns zur Bestätigung."
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-12">
        <ReservationForm />
        <aside className="space-y-4 text-brand-blue/85">
          <h2 className="font-serif text-2xl text-brand-blue">Direkt kontaktieren</h2>
          <p>
            Telefon:{" "}
            <a className="underline underline-offset-2" href={site.phoneHref}>
              {site.phone}
            </a>
          </p>
          <p>
            E-Mail:{" "}
            <a className="underline underline-offset-2" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <div className="pt-4">
            <h3 className="font-serif text-xl text-brand-blue mb-2">Öffnungszeiten</h3>
            <ul className="text-sm space-y-1">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="font-medium">{h.days}</span> {h.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-brand-blue/70 pt-4">
            Hinweis: Anfragen über das Formular öffnen Ihr E-Mail-Programm. Eine Reservierung gilt
            erst nach unserer Bestätigung.
          </p>
        </aside>
      </div>
    </div>
  );
}
