import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { ReservationForm } from "@/components/ReservationForm";
import { site } from "@/lib/content";

const homeGrid = [
  { src: "/gallery/11-salat-frisch.jpg", alt: "Frischer Salat" },
  { src: "/gallery/04-pasta-vongole.jpg", alt: "Pasta mit Muscheln" },
  { src: "/gallery/08-grillspiesse.jpg", alt: "Grillspiesse" },
  { src: "/gallery/07-pinsa-prosciutto.jpg", alt: "Pinsa mit Prosciutto" },
];

export default function HomePage() {
  return (
    <>
      {/* Welcome + hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 md:pt-16">
        <p className="font-serif text-brand-mint text-lg md:text-xl mb-7">{site.home.welcome}</p>
        <div className="relative overflow-hidden rounded-2xl bg-brand-sea ring-1 ring-brand-mint/15">
          <Image
            src="/images/hero-food.jpg"
            alt="Pinsa mit Rohschinken und Rucola bei Salmarina"
            width={1400}
            height={700}
            className="w-full h-[240px] sm:h-[360px] md:h-[440px] object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-blue mb-7 leading-tight font-semibold">
          {site.home.headline}
        </h1>
        <p className="text-brand-ink/75 leading-relaxed mb-10 text-base md:text-lg">{site.home.intro}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/speisekarte">{site.home.ctaMenu}</Button>
          <Button href="/monatskarte" variant="outline">
            Monatskarte
          </Button>
        </div>
      </section>

      {/* About + quote */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-brand-mint/15">
            <Image
              src="/images/hero-interior.jpg"
              alt="Ambiente im Restaurant Salmarina"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-8">
            <p className="text-brand-ink/80 leading-relaxed text-lg">{site.home.about}</p>
            <blockquote className="font-serif text-2xl md:text-3xl text-brand-blue leading-snug font-semibold">
              „{site.home.quote}“
            </blockquote>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-brand-mint/15">
              <Image
                src="/gallery/06-risotto-crevetten.jpg"
                alt="Risotto mit Crevetten bei Salmarina"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Food grid — fresher lagoon instead of heavy rust */}
      <section className="bg-brand-lagoon py-14 md:py-20" aria-label="Impressionen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {homeGrid.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/galerie"
              className="text-white/95 underline underline-offset-4 hover:text-white text-sm font-medium"
            >
              Zur Galerie
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-blue mb-4 font-semibold">
            {site.home.ctaReserve}
          </h2>
          <p className="text-brand-ink/70 text-base md:text-lg">
            Wir suchen einen passenden Platz basierend auf diesen Angaben.
          </p>
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl border border-brand-mint/20 bg-white/70 p-6 sm:p-8 shadow-sm">
          <Suspense fallback={<p className="text-center text-brand-ink/60">Laden…</p>}>
            <ReservationForm compact />
          </Suspense>
        </div>
        <p className="text-center mt-8 text-sm text-brand-lagoon/80">
          Oder{" "}
          <Link href="/reservierungen" className="underline underline-offset-2 hover:text-brand-mint">
            detaillierte Reservierung
          </Link>{" "}
          ·{" "}
          <a href={site.phoneHref} className="underline underline-offset-2 hover:text-brand-mint">
            {site.phone}
          </a>
        </p>
      </section>
    </>
  );
}
