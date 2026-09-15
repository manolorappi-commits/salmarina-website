"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-foam/90 backdrop-blur-md border-b border-brand-mint/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-4 md:py-5">
          <Link
            href="/"
            className="font-serif text-3xl md:text-4xl text-brand-blue tracking-tight shrink-0"
            onClick={() => setOpen(false)}
          >
            {site.name}
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-brand-blue hover:bg-brand-sea"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Navigation</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          <nav
            id="main-nav"
            className={cn(
              "absolute left-0 right-0 top-full bg-brand-foam/98 border-b border-brand-mint/15 md:static md:border-0 md:bg-transparent",
              open ? "block" : "hidden md:block",
            )}
            aria-label="Hauptnavigation"
          >
            <ul className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-end gap-1 md:gap-x-4 lg:gap-x-5 px-4 py-3 md:p-0">
              {site.nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-2 md:py-1 text-sm tracking-wide transition-colors rounded-full md:px-1",
                        active
                          ? "text-brand-lagoon font-semibold"
                          : "text-brand-ink/70 hover:text-brand-mint",
                      )}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
