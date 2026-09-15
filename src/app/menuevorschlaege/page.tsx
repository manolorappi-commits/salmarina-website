import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { menuVorschlaege } from "@/lib/content";

export const metadata: Metadata = {
  title: "Menüvorschläge",
  description: "Menüvorschläge Eisen bis Diamant für Anlässe bei Salmarina.",
};

export default function MenuevorschlaegePage() {
  return (
    <div className="pb-20">
      <PageHero title={menuVorschlaege.title} intro={menuVorschlaege.intro} />

      <section className="bg-brand-lagoon text-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-9 font-semibold">Menüwahl</h2>
              <ul className="space-y-3.5">
                {menuVorschlaege.tiers.map((tier) => (
                  <li key={tier.id}>
                    <a
                      href={tier.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded-xl bg-brand-blue/90 px-5 py-4 hover:bg-brand-mint transition-colors ring-1 ring-white/10"
                    >
                      <span className="font-semibold text-lg min-w-[7rem]">{tier.name}</span>
                      <span className="text-sm text-white/90">{tier.description}</span>
                      <span className="sm:ml-auto text-xs uppercase tracking-wider text-white/75 font-medium">
                        PDF
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/15">
              <Image
                src="/gallery/06-risotto-crevetten.jpg"
                alt="Menüvorschlag Salmarina"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl mt-14 text-center md:text-left font-semibold">
            {menuVorschlaege.subtitle}
          </h2>
        </div>
      </section>

      <div className="text-center py-14">
        <Button href={menuVorschlaege.overviewPdf} target="_blank" rel="noopener noreferrer">
          Übersicht herunterladen
        </Button>
      </div>
    </div>
  );
}
