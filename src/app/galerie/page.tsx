import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { gallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Fotogalerie — Küche und Ambiente bei Salmarina.",
};

export default function GaleriePage() {
  return (
    <div className="pb-20">
      <PageHero title={gallery.title} intro={gallery.intro} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {gallery.images.map((img) => (
            <li key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-sea ring-1 ring-brand-mint/15">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
