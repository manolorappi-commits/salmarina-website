import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { MenuImage } from "@/components/MenuImage";
import { menu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mittagsmenüs",
  description: "Mittagsmenüs Dienstag bis Freitag bei Salmarina Hombrechtikon.",
};

type Item = {
  name: string;
  description?: string;
  price?: string;
};

export default function MittagsmenusPage() {
  const m = menu.mittagsmenus;
  const items = ("items" in m && Array.isArray(m.items) ? m.items : []) as Item[];
  const download = "download" in m && typeof m.download === "string" ? m.download : m.image;

  return (
    <div className="pb-20">
      <PageHero title={m.title} intro={m.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-12">
        <div>
          <MenuImage src={m.image} alt={m.alt} priority />
          <p className="mt-4 text-center text-sm font-medium">
            <a
              href={download}
              download
              className="text-brand-lagoon underline underline-offset-4 hover:text-brand-mint"
            >
              Mittagsmenü herunterladen
            </a>
            {" · "}
            <Link href="/speisekarte" className="text-brand-ink/60 underline underline-offset-4 hover:text-brand-mint">
              Zur Speisekarte
            </Link>
          </p>
        </div>

        {items.length > 0 && (
          <section>
            <h2 className="menu-category-title mb-6 text-center text-[1.75rem] md:text-[2rem]">
              Wochenübersicht
            </h2>
            <ul className="menu-card px-5 sm:px-7 divide-y divide-brand-mint/15">
              {items.map((item) => (
                <li key={item.name} className="py-5 flex justify-between gap-4 items-baseline">
                  <div>
                    <p className="menu-dish-name">{item.name}</p>
                    {item.description && <p className="menu-dish-desc mt-1">{item.description}</p>}
                  </div>
                  <p className="menu-dish-price shrink-0">CHF {item.price}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-center text-sm text-brand-ink/50">
              Die Wochenkarte wechselt — bitte auch das Bild oben beachten.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
