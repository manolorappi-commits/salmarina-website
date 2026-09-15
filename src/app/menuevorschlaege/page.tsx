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
    <div className="pb-20 bg-menu-surface/40">
      <PageHero title={menuVorschlaege.title} intro={menuVorschlaege.intro} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
        <div className="menu-section-panel p-6 sm:p-10 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <p className="menu-eyebrow mb-3">Anlässe</p>
              <h2 className="menu-category-title text-[1.75rem] md:text-[2.25rem] mb-3">
                Menüwahl
              </h2>
              <p className="menu-dish-desc mb-8 max-w-md">
                Sechs Stufen von Eisen bis Diamant — klare Hierarchie, ruhige Karten, PDF zum
                Mitnehmen.
              </p>
              <ul className="space-y-3.5">
                {menuVorschlaege.tiers.map((tier) => (
                  <li key={tier.id}>
                    <a
                      href={tier.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="menu-tier-card sm:flex-row sm:items-center sm:justify-between"
                      data-tier={tier.id}
                    >
                      <div className="min-w-0 pl-2">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1">
                          <span className="menu-tier-name">{tier.name}</span>
                          <span className="menu-pdf-chip">PDF</span>
                        </div>
                        <p className="menu-dish-desc text-[0.9375rem]">{tier.description}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:sticky md:top-28">
              <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-menu-divider shadow-md shadow-brand-lagoon/10">
                <Image
                  src="/gallery/06-risotto-crevetten.jpg"
                  alt="Menüvorschlag Salmarina"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <h2 className="font-serif text-xl md:text-2xl mt-8 text-menu-accent font-semibold leading-snug">
                {menuVorschlaege.subtitle}
              </h2>
              <p className="mt-3 text-sm text-menu-muted leading-relaxed">
                Gerne stellen wir Ihr Menü individuell zusammen — sprechen Sie uns an.
              </p>
            </div>
          </div>
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
