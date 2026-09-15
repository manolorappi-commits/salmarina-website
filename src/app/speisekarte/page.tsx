import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { MenuImage } from "@/components/MenuImage";
import { Button } from "@/components/Button";
import { menu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Mediterrane Speisekarte von Salmarina — Salate, Pasta, Grill, Pizza und Desserts mit Preisen.",
};

type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  priceSmall?: string;
  priceMain?: string;
  priceNote?: string;
};

function formatPrice(p?: string) {
  if (!p) return null;
  return `CHF ${p}`;
}

function DishRow({ item }: { item: MenuItem }) {
  const hasSizes = Boolean(item.priceSmall && item.price);
  return (
    <li className="group border-b border-brand-blue/10 py-3.5 last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-medium text-brand-ink text-[15px] sm:text-base leading-snug">
          {item.name}
        </h3>
        <div className="shrink-0 text-right">
          {hasSizes ? (
            <p className="text-sm sm:text-base tabular-nums text-brand-blue font-medium whitespace-nowrap">
              <span className="text-brand-ink/50 text-xs mr-1">klein</span>
              {formatPrice(item.priceSmall)}
              <span className="mx-1.5 text-brand-ink/30">·</span>
              <span className="text-brand-ink/50 text-xs mr-1">gross</span>
              {formatPrice(item.price)}
            </p>
          ) : item.priceMain ? (
            <p className="text-sm sm:text-base tabular-nums text-brand-blue font-medium whitespace-nowrap">
              {formatPrice(item.price)}
              <span className="mx-1 text-brand-ink/30">/</span>
              {formatPrice(item.priceMain)}
            </p>
          ) : (
            <p className="text-sm sm:text-base tabular-nums text-brand-blue font-medium whitespace-nowrap">
              {formatPrice(item.price)}
            </p>
          )}
          {item.priceNote && (
            <p className="text-[11px] text-brand-ink/50 mt-0.5">{item.priceNote}</p>
          )}
        </div>
      </div>
      {item.description && (
        <p className="mt-1 text-sm text-brand-ink/65 leading-relaxed max-w-xl">
          {item.description}
        </p>
      )}
    </li>
  );
}

export default function SpeisekartePage() {
  return (
    <div className="pb-20">
      <PageHero title={menu.title} intro={menu.intro} />

      {/* Quick links */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-10">
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/monatskarte"
            className="rounded-xl border border-brand-blue/15 bg-brand-cream px-5 py-4 hover:border-brand-coral/40 transition-colors"
          >
            <p className="font-serif text-lg text-brand-blue">{menu.monatskarte.title}</p>
            <p className="text-sm text-brand-ink/70 mt-1">Saisonale Spezialitäten ansehen →</p>
          </Link>
          <Link
            href="/mittagsmenus"
            className="rounded-xl border border-brand-blue/15 bg-brand-cream px-5 py-4 hover:border-brand-coral/40 transition-colors"
          >
            <p className="font-serif text-lg text-brand-blue">{menu.mittagsmenus.title}</p>
            <p className="text-sm text-brand-ink/70 mt-1">Di–Fr Mittagsangebote ansehen →</p>
          </Link>
        </div>
      </div>

      {/* Category nav */}
      <nav
        aria-label="Speisekarte Kategorien"
        className="sticky top-16 z-30 border-y border-brand-blue/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 overflow-x-auto">
          <ul className="flex gap-1 sm:gap-2 py-2.5 min-w-max">
            {menu.categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  className="inline-block rounded-full px-3.5 py-1.5 text-sm text-brand-blue hover:bg-brand-powder/50 hover:text-brand-blue transition-colors whitespace-nowrap"
                >
                  {cat.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-20 mt-12">
        {menu.categories.map((cat, i) => {
          const items = "items" in cat && Array.isArray(cat.items) ? (cat.items as MenuItem[]) : [];
          const photo = "photo" in cat && typeof cat.photo === "string" ? cat.photo : null;
          const subtitle = "subtitle" in cat && typeof cat.subtitle === "string" ? cat.subtitle : null;

          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <div className="flex-1">
                  <p className="text-brand-coral text-xs tracking-[0.2em] uppercase mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-brand-blue">{cat.title}</h2>
                  {subtitle && (
                    <p className="mt-2 text-sm text-brand-ink/65 max-w-xl">{subtitle}</p>
                  )}
                </div>
                {photo && (
                  <div className="relative w-full sm:w-40 h-28 sm:h-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={photo}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="160px"
                      aria-hidden
                    />
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <ul className="mb-8 rounded-xl border border-brand-blue/10 bg-white px-4 sm:px-6 shadow-sm">
                  {items.map((item) => (
                    <DishRow key={`${cat.id}-${item.name}`} item={item} />
                  ))}
                </ul>
              )}

              <details className="group">
                <summary className="cursor-pointer list-none text-sm text-brand-blue/80 hover:text-brand-coral underline-offset-4 hover:underline mb-4 flex items-center gap-2">
                  <span className="inline-block transition group-open:rotate-90">›</span>
                  Original-Kartenbild anzeigen
                </summary>
                {"images" in cat && Array.isArray(cat.images) ? (
                  <div className="space-y-4">
                    {cat.images.map((src, idx) => (
                      <MenuImage
                        key={src}
                        src={src}
                        alt={`${cat.alt} ${idx + 1}`}
                        priority={i === 0 && idx === 0}
                      />
                    ))}
                  </div>
                ) : "image" in cat && cat.image ? (
                  <MenuImage src={cat.image} alt={cat.alt} priority={i === 0} />
                ) : null}
              </details>
            </section>
          );
        })}

        {"note" in menu && typeof menu.note === "string" && (
          <p className="text-xs text-brand-ink/50 leading-relaxed border-t border-brand-blue/10 pt-6">
            {menu.note}
          </p>
        )}

        <div className="text-center pt-4 space-y-4">
          <p className="text-brand-blue/80">Tisch reservieren oder anrufen?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/reservierungen">Tisch anfragen</Button>
            <Button href="/monatskarte" variant="outline">
              Monatskarte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
