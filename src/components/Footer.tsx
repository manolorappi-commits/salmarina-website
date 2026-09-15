import Link from "next/link";
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-brand-powder text-brand-blue mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-3xl mb-4">{site.name}</p>
            <h2 className="font-serif text-xl mb-3">Kontakt</h2>
            <address className="not-italic text-sm leading-relaxed space-y-1">
              <p>{site.address.full}</p>
              <p>
                <a className="underline underline-offset-2 hover:opacity-80" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
              <p>
                <a className="underline underline-offset-2 hover:opacity-80" href={site.phoneHref}>
                  {site.phone}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-3">Öffnungszeiten</h2>
            <ul className="text-sm leading-relaxed space-y-1">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="font-medium">{h.days}</span> {h.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-3">Folgen</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  className="underline underline-offset-2 hover:opacity-80"
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2 hover:opacity-80"
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <li>
                <Link href="/impressum" className="underline underline-offset-2 hover:opacity-80">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="underline underline-offset-2 hover:opacity-80">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="underline underline-offset-2 hover:opacity-80">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-brand-blue/70">
          © {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
