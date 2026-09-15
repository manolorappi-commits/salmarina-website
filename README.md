# Salmarina Website

Professionelle Website für **Restaurant Salmarina** (Hombrechtikon) — Next.js App Router, TypeScript, Tailwind CSS.

- Live-Vorlage (Wix): https://www.salmarina.ch  
- GitHub: https://github.com/manolorappi-commits/salmarina-website  

## Lokal starten

```bash
npm install
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)

Produktionstest:

```bash
npm run build
npm start
```

## Inhaltsstruktur

| Pfad | Inhalt |
|------|--------|
| `content/site.json` | Name, Adresse, Telefon, E-Mail, Öffnungszeiten, Navigation, Social, Home-Texte, SEO |
| `content/menu.json` | Speisekarte-Kategorien, Monatskarte, Mittagsmenüs (Bildpfade) |
| `content/menu-vorschlaege.json` | Menü-Stufen Eisen–Diamant + PDF-Pfade |
| `content/news.json` | News-Einträge |
| `content/gallery.json` | Galerie-Bilder |
| `content/legal/*.md` | Impressum, Datenschutz, AGB |
| `public/menus/` | Speisekarten-Bilder & Menü-PDFs |
| `public/images/` | Logo, Hero-Bilder |
| `public/gallery/` | Galerie-Fotos |

## Speisekarte / Monatskarte / Mittagsmenü aktualisieren

1. **Datei ersetzen** in `public/menus/` (gleicher Dateiname behalten *oder* neuen Namen wählen):
   - Kategorien: `salate.jpg`, `teigwaren.jpg`, `fleisch-fisch.jpg`, `pizza.jpg`, `dessert-1.jpg`, `dessert-2.jpg`
   - Monatskarte: `monatskarte.jpg`
   - Mittagsmenüs: `mittagsmenu.jpg`
2. Falls der Dateiname geändert wurde: Pfad in `content/menu.json` anpassen.
3. Committen und deployen (z. B. Vercel).

### Menüvorschläge (PDFs)

PDFs in `public/menus/` ersetzen (`eisen.pdf` … `diamant.pdf`, `menuevorschlaege-uebersicht.pdf`) und bei Bedarf `content/menu-vorschlaege.json` aktualisieren.

### News

Einträge in `content/news.json` hinzufügen oder bearbeiten (`id`, `date`, `title`, `excerpt`, `body`).

### Kontakt & Öffnungszeiten

Alles zentral in `content/site.json`.

## Formulare

Kontakt- und Reservierungsformulare öffnen eine vorgefüllte E-Mail an `info@salmarina.ch` (`mailto:`).  
API-Routen unter `/api/contact` und `/api/reservation` erzeugen den Mailto-Link — **keine** bezahlten Dienste nötig.

## Deploy auf Vercel

1. Repo auf GitHub pushen (dieses Projekt: `manolorappi-commits/salmarina-website`).
2. Auf [vercel.com](https://vercel.com) einloggen → **Add New… → Project**.
3. Das GitHub-Repo importieren (Framework: Next.js, Build: `npm run build`, Output: Standard).
4. Deploy — Sie erhalten eine `*.vercel.app`-URL.
5. **Custom Domain später:** Project → Settings → Domains → `salmarina.ch` (und `www`) hinzufügen und DNS beim Registrar gemäss Vercel-Anleitung setzen (A/CNAME bzw. Nameserver).

Kein `vercel.json` nötig für den Standard-Next.js-Deploy.

## Tech

- Next.js 15 (App Router) + React 19  
- TypeScript  
- Tailwind CSS 4  
- Fonts: Fraunces (Serif), DM Sans (Sans)  
- Sprache: Deutsch (de-CH)  

## Seiten

`/`, `/speisekarte`, `/monatskarte`, `/mittagsmenus`, `/menuevorschlaege`, `/news`, `/galerie`, `/kontakt`, `/reservierungen`, `/impressum`, `/datenschutz`, `/agb`
