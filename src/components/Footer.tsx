"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/content";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const socialBtn =
  "inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white shadow-sm shadow-brand-blue/20 transition-colors hover:bg-brand-lagoon hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-brand-sea text-brand-lagoon mt-auto border-t border-brand-mint/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-serif text-4xl font-semibold mb-4 text-brand-blue">{site.name}</p>
            <h2 className="font-serif text-xl mb-3 text-brand-blue">Kontakt</h2>
            <address className="not-italic text-sm leading-relaxed space-y-1 text-brand-ink/80">
              <p>{site.address.full}</p>
              <p>
                <a className="underline underline-offset-2 hover:text-brand-mint" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
              <p>
                <a className="underline underline-offset-2 hover:text-brand-mint" href={site.phoneHref}>
                  {site.phone}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-3 text-brand-blue">Öffnungszeiten</h2>
            <ul className="text-sm leading-relaxed space-y-1.5 text-brand-ink/80">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="font-semibold text-brand-ink/90">{h.days}</span> {h.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-3 text-brand-blue">Folgen</h2>
            <p className="text-sm text-brand-ink/70 mb-4">Bleiben Sie auf dem Laufenden.</p>
            <div className="flex items-center gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialBtn}
                aria-label="Salmarina auf Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialBtn}
                aria-label="Salmarina auf Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-brand-mint/25 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-brand-ink/70">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/impressum" className="underline underline-offset-2 hover:text-brand-mint">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="underline underline-offset-2 hover:text-brand-mint">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/agb" className="underline underline-offset-2 hover:text-brand-mint">
                AGB
              </Link>
            </li>
            <li>
              <Link href="/reservierungen" className="underline underline-offset-2 hover:text-brand-mint">
                Reservierungen
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
