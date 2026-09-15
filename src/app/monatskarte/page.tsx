import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { MenuImage } from "@/components/MenuImage";
import { menu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Monatskarte",
  description: "Aktuelle Monatskarte von Restaurant Salmarina in Hombrechtikon.",
};

export default function MonatskartePage() {
  const m = menu.monatskarte;
  return (
    <div className="pb-16">
      <PageHero title={m.title} intro={m.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <MenuImage src={m.image} alt={m.alt} priority />
      </div>
    </div>
  );
}
