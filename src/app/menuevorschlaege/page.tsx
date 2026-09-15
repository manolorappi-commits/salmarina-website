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
    <div className="pb-16">
      <PageHero title={menuVorschlaege.title} intro={menuVorschlaege.intro} />

      <section className="bg-brand-rust text-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-8">Menüwahl</h2>
              <ul className="space-y-3">
                {menuVorschlaege.tiers.map((tier) => (
                  <li key={tier.id}>
                    <a
                      href={tier.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded-md bg-brand-blue px-5 py-3 hover:bg-brand-blue/90 transition-colors"
                    >
                      <span className="font-medium text-lg min-w-[7rem]">{tier.name}</span>
                      <span className="text-sm text-white/85">{tier.description}</span>
                      <span className="sm:ml-auto text-xs uppercase tracking-wider text-white/70">PDF</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
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
          <h2 className="font-serif text-2xl md:text-3xl mt-12 text-center md:text-left">
            {menuVorschlaege.subtitle}
          </h2>
        </div>
      </section>

      <div className="text-center py-12">
        <Button href={menuVorschlaege.overviewPdf} target="_blank" rel="noopener noreferrer">
          Übersicht herunterladen
        </Button>
      </div>
    </div>
  );
}
