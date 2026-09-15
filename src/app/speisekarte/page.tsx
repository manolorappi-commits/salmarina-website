import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { MenuImage } from "@/components/MenuImage";
import { menu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Speisekarte",
  description: "Mediterrane Speisekarte von Salmarina — Salate, Pasta, Fisch, Pizza und Desserts.",
};

export default function SpeisekartePage() {
  return (
    <div className="pb-16">
      <PageHero title={menu.title} intro={menu.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-16">
        {menu.categories.map((cat, i) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24">
            <h2 className="font-serif text-2xl md:text-3xl text-brand-blue mb-6 text-center">
              {cat.title}
            </h2>
            {"images" in cat && Array.isArray(cat.images) ? (
              <div className="space-y-6">
                {cat.images.map((src, idx) => (
                  <MenuImage key={src} src={src} alt={`${cat.alt} ${idx + 1}`} priority={i === 0 && idx === 0} />
                ))}
              </div>
            ) : "image" in cat && cat.image ? (
              <MenuImage src={cat.image} alt={cat.alt} priority={i === 0} />
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
