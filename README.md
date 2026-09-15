# Salmarina Website

Professionelle Website für **Restaurant Salmarina** (Hombrechtikon) — Next.js App Router, TypeScript, Tailwind CSS, Prisma, Reservierungssystem & Admin.

- Live-Vorlage (Wix): https://www.salmarina.ch  
- GitHub: https://github.com/manolorappi-commits/salmarina-website  

## Lokal starten

```bash
cp .env.example .env   # Neon DATABASE_URL mit sslmode=require setzen
npm install
npm run db:push        # Schema auf Neon/Postgres anlegen
npm run db:seed        # Admin-User aus ADMIN_PASSWORD anlegen
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Produktionstest:

```bash
npm run build
npm start
```

## Umgebungsvariablen

Siehe `.env.example`. Wichtige Variablen:

| Variable | Beschreibung |
|----------|----------------|
| `DATABASE_URL` | Neon Postgres (pooled) URL mit `sslmode=require` |
| `ADMIN_USERNAME` | Default `admin` |
| `ADMIN_PASSWORD` | **Erforderlich** (lokal z. B. `SalmarinaAdmin2026!`) |
| `SESSION_SECRET` | Langer Zufallsstring für JWT-Cookie |
| `RESEND_API_KEY` | Optional — ohne Key werden E-Mails nur geloggt |
| `EMAIL_FROM` | Default `Salmarina <onboarding@resend.dev>` |
| `RESTAURANT_EMAIL` | Default `info@salmarina.ch` |
| `BLOB_READ_WRITE_TOKEN` | Optional — Vercel Blob für Speisekarten-Uploads |
| `MAX_SEATS_PER_SLOT` | Default 40 (oder `content/reservations.json`) |
| `MAX_PARTIES_PER_SLOT` | Default 8 |
| `SLOT_INTERVAL_MINUTES` | `15` oder `30` (Default 30) |
| `RESERVATION_AUTO_CONFIRM` | `true` = sofort bestätigt, sonst `pending` |

## Reservierungen

- Öffentliche Seite: `/reservierungen` (Formular auch kompakt auf der Startseite)
- Felder: Name, E-Mail, Telefon, Personenzahl (1–12), Datum, Uhrzeit, Bemerkungen
- Öffnungszeiten (Europe/Zurich):
  - **Mo:** geschlossen
  - **Di–Fr:** 11:00–14:00 und ab 17:00 (letzte Sitzung 21:30)
  - **Sa:** ab 17:00 (letzte Sitzung 21:30)
  - **So:** ab 11:00, abends geschlossen (letzte Sitzung 14:00)
- API:
  - `GET /api/reservations/slots?date=YYYY-MM-DD` — verfügbare Slots inkl. Kapazität
  - `POST /api/reservations` — erstellt Reservierung (`pending` oder `confirmed`)
- Kapazität: max. Sitze **und** max. Partien pro Slot (konfigurierbar)
- Erfolgsseite mit Referenzcode (`SAL-……`)
- E-Mail an Gast **und** Restaurant (Resend, wenn `RESEND_API_KEY` gesetzt)

## Admin

- Login: `/admin` (JWT-Cookie via `jose`, bcrypt-Passwort)
- `/admin/reservierungen` — Liste, Filter nach Datum/Status, Bestätigen / Stornieren / Abgeschlossen (E-Mail bei confirm/cancel)
- `/admin/speisekarten` — Upload von Bildern/PDFs für Kategorien, Monatskarte, Mittagsmenü, Menüvorschläge
  - **Lokal:** `public/menus/` + Update von `content/menu.json` / `menu-vorschlaege.json`
  - **Vercel:** `@vercel/blob` wenn `BLOB_READ_WRITE_TOKEN` gesetzt; sonst Fehlermeldung

## Datenbank (Prisma + Neon Postgres)

`prisma/schema.prisma` nutzt `provider = "postgresql"`.

1. Neon-Projekt anlegen und **pooled** Connection String kopieren (`…-pooler…`, `sslmode=require`).
2. `DATABASE_URL` in `.env` und in Vercel setzen (Neon URL configured).
3. Optional: non-pooled URL als `DIRECT_URL` für Migrationen, falls der Pooler Probleme macht.
4. Schema & Seed:

```bash
npx prisma db push
npx prisma db seed   # Admin: ADMIN_USERNAME / ADMIN_PASSWORD
```

Build führt `prisma generate` aus (`npm run build`).

Modelle: `Reservation`, `AdminUser`, `MenuAsset`.

Skripte: `npm run db:push`, `npm run db:seed`, `npm run db:studio`.

## E-Mail (Resend)

1. Account auf [resend.com](https://resend.com) anlegen.
2. API-Key setzen: `RESEND_API_KEY`.
3. Absender verifizieren und `EMAIL_FROM` setzen (z. B. `Salmarina <info@salmarina.ch>`).
4. Ohne Key: Reservierung wird trotzdem gespeichert; Payloads erscheinen in den Server-Logs; API liefert `emailWarning`.

## Inhaltsstruktur

| Pfad | Inhalt |
|------|--------|
| `content/site.json` | Name, Adresse, Telefon, E-Mail, Öffnungszeiten, Navigation, Social, Home-Texte, SEO |
| `content/menu.json` | Speisekarte-Kategorien, Monatskarte, Mittagsmenüs |
| `content/menu-vorschlaege.json` | Menü-Stufen Eisen–Diamant + PDF-Pfade |
| `content/reservations.json` | Slot-Intervall, Kapazität, Auto-Confirm |
| `content/news.json` | News-Einträge |
| `content/gallery.json` | Galerie-Bilder |
| `content/legal/*.md` | Impressum, Datenschutz, AGB |
| `public/menus/` | Speisekarten-Bilder & Menü-PDFs |

## Deploy auf Vercel

1. Repo auf GitHub pushen.
2. Auf [vercel.com](https://vercel.com) importieren (Framework: Next.js).
3. Env-Vars setzen: `DATABASE_URL` (Neon pooled + `sslmode=require`), `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, optional `RESEND_API_KEY`, `EMAIL_FROM`, `RESTAURANT_EMAIL`, `BLOB_READ_WRITE_TOKEN`.
4. Deploy — Schema/Seed gegen Prod-DB: `npx prisma db push` + `npm run db:seed` mit Prod-`DATABASE_URL`.
5. Custom Domain: Project → Settings → Domains → `salmarina.ch` / `www`.

## Chatbot (Kunden-Assistent)

Floating-Widget auf allen öffentlichen Seiten (nicht unter `/admin`).

- Sprache: Deutsch (de-CH), Salmarina-Ton
- Regelbasiert (Keywords + geführter Reservierungs-Dialog) — **kein** bezahltes LLM nötig
- Kennt Öffnungszeiten (`content/site.json`), Speisekarte / Mittagsmenü / Monatskarte / Menüvorschläge und verlinkt dorthin
- Reservierung im Chat Schritt für Schritt → ruft `POST /api/reservations` auf (gleicher Backend-Pfad wie das Formular)
- Schnellantworten: Öffnungszeiten, Speisekarte, Mittagsmenü, Monatskarte, Tisch reservieren
- Optional später: `OPENAI_API_KEY` für LLM-Erweiterung (v1 funktioniert ohne)

## Tech

- Next.js 15 (App Router) + React 19  
- TypeScript, Tailwind CSS 4  
- Prisma + Neon Postgres  
- Resend (E-Mail), jose (Admin-Session), bcryptjs, @vercel/blob  
- Fonts: Fraunces (Serif), DM Sans (Sans)  
- Sprache: Deutsch (de-CH)  

## Seiten

Öffentlich: `/`, `/speisekarte`, `/monatskarte`, `/mittagsmenus`, `/menuevorschlaege`, `/news`, `/galerie`, `/kontakt`, `/reservierungen`, `/reservierungen/erfolg`, `/impressum`, `/datenschutz`, `/agb`  

Admin: `/admin`, `/admin/reservierungen`, `/admin/speisekarten`  
Chatbot: floating widget via `ChatbotWidget` in Root-Layout
