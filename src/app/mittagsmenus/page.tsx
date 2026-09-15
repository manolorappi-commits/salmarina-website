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
    <div className="pb-16">
      <PageHero title={m.title} intro={m.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-10">
        <div>
          <MenuImage src={m.image} alt={m.alt} priority />
          <p className="mt-3 text-center text-sm">
            <a
              href={download}
              download
              className="text-brand-blue underline underline-offset-4 hover:text-brand-coral"
            >
              Mittagsmenü herunterladen
            </a>
            {" · "}
            <Link href="/speisekarte" className="text-brand-blue/70 underline underline-offset-4">
              Zur Speisekarte
            </Link>
          </p>
        </div>

        {items.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl text-brand-blue mb-4 text-center">Wochenübersicht</h2>
            <ul className="rounded-xl border border-brand-blue/10 bg-white px-4 sm:px-6 shadow-sm divide-y divide-brand-blue/10">
              {items.map((item) => (
                <li key={item.name} className="py-3.5 flex justify-between gap-4 items-baseline">
                  <div>
                    <p className="font-medium text-brand-ink">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-brand-ink/65 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <p className="shrink-0 tabular-nums text-brand-blue font-medium whitespace-nowrap">
                    CHF {item.price}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center text-xs text-brand-ink/50">
              Die Wochenkarte wechselt — bitte auch das Bild oben beachten.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
