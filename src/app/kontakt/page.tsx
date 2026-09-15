import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontaktieren Sie Salmarina — ${site.address.full}, ${site.phone}`,
};

export default function KontaktPage() {
  return (
    <div className="pb-20">
      <PageHero title="Kontakt" eyebrow="" />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-blue">Besuchen Sie uns</h2>
          <div>
            <h3 className="font-serif text-xl text-brand-blue mb-2">Unsere Adresse</h3>
            <p className="text-brand-ink/75 leading-relaxed">{site.address.full}</p>
            <p className="mt-3 text-brand-ink/75">
              <a className="underline underline-offset-2" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <br />
              <a className="underline underline-offset-2" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-brand-blue mb-2">Öffnungszeiten</h3>
            <ul className="text-brand-ink/75 space-y-1 text-sm leading-relaxed">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="font-medium">{h.days}</span> {h.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <h2 className="font-serif text-3xl text-brand-blue mb-4">Anfragen</h2>
            <p className="text-brand-ink/75 leading-relaxed mb-4">
              Haben Sie Fragen zu unserer Speisekarte oder möchten Sie einen Tisch reservieren?
              Hinterlassen Sie uns eine Nachricht, wir melden uns umgehend bei Ihnen.
            </p>
            <p className="text-sm text-brand-blue/70">
              Die Nachricht öffnet Ihr E-Mail-Programm an {site.email}.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
        <div className="overflow-hidden rounded-xl border border-brand-mint/20 bg-brand-sea aspect-[21/9] min-h-[200px]">
          <iframe
            title="Karte — Salmarina Hombrechtikon"
            className="w-full h-full min-h-[200px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address.full)}&z=15&output=embed`}
          />
        </div>
      </section>
    </div>
  );
}
