import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { MenuImage } from "@/components/MenuImage";
import { menu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Monatskarte",
  description: "Aktuelle Monatskarte von Restaurant Salmarina in Hombrechtikon.",
};

type Item = {
  name: string;
  description?: string;
  price?: string;
  priceMain?: string;
  priceNote?: string;
};

export default function MonatskartePage() {
  const m = menu.monatskarte;
  const items = ("items" in m && Array.isArray(m.items) ? m.items : []) as Item[];
  const download = "download" in m && typeof m.download === "string" ? m.download : m.image;

  return (
    <div className="pb-20 bg-menu-surface/40">
      <PageHero title={m.title} intro={m.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-12">
        <div>
          <MenuImage src={m.image} alt={m.alt} priority />
          <p className="mt-4 text-center text-sm font-medium">
            <a
              href={download}
              download
              className="text-menu-accent underline underline-offset-4 hover:text-brand-mint"
            >
              Monatskarte herunterladen
            </a>
            {" · "}
            <Link href="/speisekarte" className="text-menu-muted underline underline-offset-4 hover:text-brand-mint">
              Zur Speisekarte
            </Link>
          </p>
        </div>

        {items.length > 0 && (
          <section>
            <h2 className="menu-category-title mb-6 text-center text-[1.75rem] md:text-[2rem]">
              Übersicht
            </h2>
            <ul className="menu-card px-5 sm:px-7 divide-y divide-menu-divider">
              {items.map((item) => (
                <li key={item.name} className="py-5 flex justify-between gap-4 items-baseline">
                  <div>
                    <p className="menu-dish-name">{item.name}</p>
                    {item.description && <p className="menu-dish-desc mt-1">{item.description}</p>}
                    {item.priceNote && (
                      <p className="text-xs text-menu-muted mt-1 font-medium">{item.priceNote}</p>
                    )}
                  </div>
                  <p className="menu-dish-price shrink-0">
                    {item.priceMain ? (
                      <>
                        CHF {item.price}
                        <span className="text-menu-muted/40 mx-1 font-normal">/</span>
                        CHF {item.priceMain}
                      </>
                    ) : (
                      <>CHF {item.price}</>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
