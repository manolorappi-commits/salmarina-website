import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { wine } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weinkarte",
  description:
    "Handverlesene Rotweine aus Spanien, Italien und Portugal — die Weinkarte von Salmarina Hombrechtikon.",
};

type Wine = (typeof wine.categories)[number]["wines"][number];

function formatPrice(p: string) {
  return `CHF ${p}.–`;
}

function WineCard({ wineItem }: { wineItem: Wine }) {
  const meta = [wineItem.vintage, wineItem.region, wineItem.size]
    .filter(Boolean)
    .join(" · ");

  const sections: { label: string; text: string }[] = [
    { label: "Bouquet", text: wineItem.bouquet },
    { label: "Geschmack", text: wineItem.taste },
    { label: "Ausbau & Reife", text: wineItem.aging },
    { label: "Geschichte", text: wineItem.history },
  ];

  return (
    <article className="menu-card p-5 sm:p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="menu-dish-name">{wineItem.name}</h3>
          {meta && <p className="menu-dish-desc mt-1.5 text-sm">{meta}</p>}
        </div>
        <p className="menu-dish-price shrink-0">{formatPrice(wineItem.price)}</p>
      </div>

      <div className="mt-5 space-y-3 border-t border-menu-divider pt-4">
        {sections.map((s) => (
          <details key={s.label} className="group">
            <summary className="cursor-pointer list-none text-sm font-semibold text-menu-accent/90 hover:text-brand-mint flex items-center gap-2">
              <span className="inline-block transition group-open:rotate-90 text-menu-muted">
                ›
              </span>
              {s.label}
            </summary>
            <p className="menu-dish-desc mt-2 pl-4 text-[0.9375rem] leading-relaxed">
              {s.text}
            </p>
          </details>
        ))}
      </div>
    </article>
  );
}

export default function WeinkartePage() {
  return (
    <div className="pb-24 bg-menu-surface/40">
      <PageHero title={wine.title} intro={wine.intro} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-10 flex flex-wrap items-center justify-between gap-4">
        <p className="menu-eyebrow">20 Handverlesene Positionen</p>
        <Button href={wine.pdf} target="_blank" rel="noopener noreferrer" variant="outline">
          PDF herunterladen
        </Button>
      </div>

      <nav
        aria-label="Weinkarte Regionen"
        className="menu-nav sticky top-16 z-30 border-y backdrop-blur supports-[backdrop-filter]:bg-brand-foam/85"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 overflow-x-auto">
          <ul className="flex gap-1.5 sm:gap-2 py-3 min-w-max">
            {wine.categories.map((cat) => (
              <li key={cat.id}>
                <a href={`#${cat.id}`} className="menu-chip">
                  {cat.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-24 mt-14">
        {wine.categories.map((cat, i) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-32">
            <div className="mb-8">
              <p className="menu-eyebrow mb-2">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="menu-category-title">{cat.title}</h2>
              {cat.subtitle && (
                <p className="mt-3 menu-dish-desc max-w-xl">{cat.subtitle}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {cat.wines.map((w) => (
                <WineCard key={`${cat.id}-${w.name}`} wineItem={w} />
              ))}
            </div>
          </section>
        ))}

        <p className="text-sm text-menu-muted leading-relaxed border-t border-menu-divider pt-8">
          {wine.note}
        </p>

        <div className="text-center pt-6 space-y-5">
          <p className="text-menu-accent font-medium">
            Zur Speisekarte oder Tisch reservieren?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/speisekarte" variant="outline">
              Speisekarte
            </Button>
            <Button href="/reservierungen">Tisch anfragen</Button>
            <Button href={wine.pdf} target="_blank" rel="noopener noreferrer" variant="outline">
              Weinkarte PDF
            </Button>
          </div>
          <p className="text-sm text-menu-muted">
            <Link href="/speisekarte" className="underline-offset-4 hover:underline text-menu-accent">
              Zurück zur Speisekarte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
