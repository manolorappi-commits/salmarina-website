import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ReservationForm } from "@/components/ReservationForm";
import { site } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* Welcome + hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 md:pt-14">
        <p className="font-serif text-brand-blue text-lg md:text-xl mb-6">{site.home.welcome}</p>
        <div className="relative overflow-hidden rounded-xl bg-brand-cream">
          <Image
            src="/images/hero-food.jpg"
            alt="Mediterrane Gerichte bei Salmarina"
            width={1400}
            height={700}
            className="w-full h-[240px] sm:h-[360px] md:h-[440px] object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 md:py-20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-blue mb-6 leading-tight">
          {site.home.headline}
        </h1>
        <p className="text-brand-blue/85 leading-relaxed mb-8">{site.home.intro}</p>
        <Button href="/speisekarte">{site.home.ctaMenu}</Button>
      </section>

      {/* About + quote */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <Image
              src="/images/hero-interior.png"
              alt="Ambiente im Restaurant Salmarina"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <p className="text-brand-blue/90 leading-relaxed text-lg">{site.home.about}</p>
            <blockquote className="font-serif text-2xl md:text-3xl text-brand-blue leading-snug">
              „{site.home.quote}“
            </blockquote>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/gallery/04-pasta.jpg"
                alt="Pasta bei Salmarina"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Food grid on rust */}
      <section className="bg-brand-rust py-12 md:py-16" aria-label="Impressionen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { src: "/gallery/03-salat.jpg", alt: "Salat" },
              { src: "/gallery/04-pasta.jpg", alt: "Pasta" },
              { src: "/gallery/05-fleisch.jpg", alt: "Fleisch und Fisch" },
              { src: "/gallery/01-pizza.jpg", alt: "Pizza" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/galerie" className="text-white/90 underline underline-offset-4 hover:text-white text-sm">
              Zur Galerie
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-blue mb-3">{site.home.ctaReserve}</h2>
          <p className="text-brand-blue/80">
            Wir suchen einen passenden Platz basierend auf diesen Angaben.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <ReservationForm compact />
        </div>
        <p className="text-center mt-6 text-sm text-brand-blue/70">
          Oder{" "}
          <Link href="/reservierungen" className="underline underline-offset-2">
            detaillierte Reservierung
          </Link>{" "}
          ·{" "}
          <a href={site.phoneHref} className="underline underline-offset-2">
            {site.phone}
          </a>
        </p>
      </section>
    </>
  );
}
