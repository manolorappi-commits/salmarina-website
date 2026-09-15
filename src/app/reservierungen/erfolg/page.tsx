import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reservierung erhalten",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ code?: string; status?: string; warn?: string }>;
};

export default async function ErfolgPage({ searchParams }: Props) {
  const params = await searchParams;
  const code = params.code || "—";
  const status = params.status || "pending";
  const warn = params.warn === "1";

  const statusText =
    status === "confirmed"
      ? "Ihre Reservierung ist bestätigt."
      : "Ihre Anfrage ist eingegangen und wird von uns geprüft.";

  return (
    <div className="pb-16">
      <PageHero title="Vielen Dank!" intro={statusText} />
      <div className="mx-auto max-w-xl px-4 sm:px-6 space-y-6 text-center">
        <div className="rounded-xl border border-brand-mint/20 bg-brand-sea/80 p-8">
          <p className="text-sm text-brand-blue mb-2">Ihre Referenz</p>
          <p className="font-serif text-3xl text-brand-blue tracking-wide">{code}</p>
          <p className="mt-4 text-brand-ink/80 text-sm leading-relaxed">
            Bitte bewahren Sie diesen Code auf. Bei Rückfragen nennen Sie ihn gerne unter{" "}
            <a className="underline" href={site.phoneHref}>
              {site.phone}
            </a>{" "}
            oder{" "}
            <a className="underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          {warn && (
            <p className="mt-4 text-sm text-brand-coral">
              Hinweis: Die Bestätigungs-E-Mail konnte im Testmodus nicht versendet werden (kein
              Resend-API-Key). Die Reservierung wurde trotzdem gespeichert.
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Zur Startseite</Button>
          <Button href="/reservierungen" variant="outline">
            Weitere Reservierung
          </Button>
        </div>
        <p className="text-sm text-brand-blue/70">
          <Link href="/speisekarte" className="underline underline-offset-2">
            Speisekarte ansehen
          </Link>
        </p>
      </div>
    </div>
  );
}
