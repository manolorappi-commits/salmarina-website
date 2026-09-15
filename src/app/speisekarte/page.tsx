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
    <li className="group border-b border-brand-mint/15 py-5 last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="menu-dish-name">{item.name}</h3>
        <div className="shrink-0 text-right">
          {hasSizes ? (
            <p className="menu-dish-price">
              <span className="text-brand-ink/50 text-xs font-medium mr-1.5">klein</span>
              {formatPrice(item.priceSmall)}
              <span className="mx-1.5 text-brand-ink/30 font-normal">·</span>
              <span className="text-brand-ink/50 text-xs font-medium mr-1.5">gross</span>
              {formatPrice(item.price)}
            </p>
          ) : item.priceMain ? (
            <p className="menu-dish-price">
              {formatPrice(item.price)}
              <span className="mx-1 text-brand-ink/30 font-normal">/</span>
              {formatPrice(item.priceMain)}
            </p>
          ) : (
            <p className="menu-dish-price">{formatPrice(item.price)}</p>
          )}
          {item.priceNote && (
            <p className="text-xs text-brand-ink/50 mt-1 font-medium">{item.priceNote}</p>
          )}
        </div>
      </div>
      {item.description && <p className="menu-dish-desc mt-1.5 max-w-xl">{item.description}</p>}
    </li>
  );
}

export default function SpeisekartePage() {
  return (
    <div className="pb-24">
      <PageHero title={menu.title} intro={menu.intro} />

      {/* Quick links */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-12">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/monatskarte"
            className="rounded-xl border border-brand-mint/25 bg-brand-sea px-6 py-5 hover:border-brand-mint hover:bg-white/70 transition-colors"
          >
            <p className="font-serif text-xl font-semibold text-brand-blue">{menu.monatskarte.title}</p>
            <p className="text-sm text-brand-ink/70 mt-1.5">Saisonale Spezialitäten ansehen →</p>
          </Link>
          <Link
            href="/mittagsmenus"
            className="rounded-xl border border-brand-mint/25 bg-brand-sea px-6 py-5 hover:border-brand-mint hover:bg-white/70 transition-colors"
          >
            <p className="font-serif text-xl font-semibold text-brand-blue">{menu.mittagsmenus.title}</p>
            <p className="text-sm text-brand-ink/70 mt-1.5">Di–Fr Mittagsangebote ansehen →</p>
          </Link>
        </div>
      </div>

      {/* Category nav */}
      <nav
        aria-label="Speisekarte Kategorien"
        className="sticky top-16 z-30 border-y border-brand-mint/15 bg-brand-foam/95 backdrop-blur supports-[backdrop-filter]:bg-brand-foam/85"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 overflow-x-auto">
          <ul className="flex gap-1.5 sm:gap-2 py-3 min-w-max">
            {menu.categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  className="inline-block rounded-full px-4 py-2 text-sm font-semibold text-brand-lagoon hover:bg-brand-sea hover:text-brand-mint transition-colors whitespace-nowrap"
                >
                  {cat.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-24 mt-14">
        {menu.categories.map((cat, i) => {
          const items = "items" in cat && Array.isArray(cat.items) ? (cat.items as MenuItem[]) : [];
          const photo = "photo" in cat && typeof cat.photo === "string" ? cat.photo : null;
          const subtitle = "subtitle" in cat && typeof cat.subtitle === "string" ? cat.subtitle : null;

          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-8">
                <div className="flex-1">
                  <p className="text-brand-mint text-xs tracking-[0.22em] uppercase mb-2 font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="menu-category-title">{cat.title}</h2>
                  {subtitle && <p className="mt-3 menu-dish-desc max-w-xl">{subtitle}</p>}
                </div>
                {photo && (
                  <div className="relative w-full sm:w-44 h-32 sm:h-32 shrink-0 overflow-hidden rounded-xl ring-1 ring-brand-mint/20">
                    <Image
                      src={photo}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="176px"
                      aria-hidden
                    />
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <ul className="menu-card mb-8 px-5 sm:px-7">
                  {items.map((item) => (
                    <DishRow key={`${cat.id}-${item.name}`} item={item} />
                  ))}
                </ul>
              )}

              <details className="group">
                <summary className="cursor-pointer list-none text-sm font-medium text-brand-lagoon/80 hover:text-brand-mint underline-offset-4 hover:underline mb-4 flex items-center gap-2">
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
          <p className="text-sm text-brand-ink/50 leading-relaxed border-t border-brand-mint/20 pt-8">
            {menu.note}
          </p>
        )}

        <div className="text-center pt-6 space-y-5">
          <p className="text-brand-lagoon font-medium">Tisch reservieren oder anrufen?</p>
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
