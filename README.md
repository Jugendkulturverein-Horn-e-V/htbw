# Horn to be Wild – Festival Website 2026

Offizielle Website für die 11. und letzte Ausgabe des Horn to be Wild Festivals im Rhododendronpark Bremen.

## Todos

- [x] Blog Beiträge migrieren
- [x] Mehr Bilder
- [x] Slider of Fame
- [ ] Festival Karte
- [ ] Sponsoren aktualisieren (bereits bestehende migriert)
- [x] AGB, Impressum, Datenschutz
- [x] Plausible
- [x] Responsive Images
- [x] fetchpriority=high should be applied
- [x] fonts are loaded chained via the css -> improve to load font on top lever
  - are already pre-loaded chained warning is for not that much used font versions (semibold/bold)
- [x] minify CSS
- [x] Links do not have descriptive Text (Blog Post - Weiterlesen)
- [x] Open Graph Image
- [x] Google Event [Schema JSON](#google-event-schema)
- [x] IDs der Sections

## 🛠️ Tech Stack

- **Static Site Generator:** [Eleventy (11ty)](https://www.11ty.dev/)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
- **Templating:** Nunjucks (`.njk`)
- **Typography:** [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Fonts:** Frente H1, Inter (self-hosted)

## 🚀 Lokale Entwicklung

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder pnpm

### Installation

```bash
npm install
# oder
pnpm i
```

### Entwicklungsserver starten

```bash
npm run dev
# oder
pnpm dev
```

Die Website ist dann unter `http://localhost:3000` erreichbar.

### Produktions-Build

```bash
npm run build
# oder
pnpm build
```

---

## 📁 Projektstruktur

```
src/
├── _data/                # Globale Datendateien
│   ├── config.json       # Hauptkonfiguration (Datum, Links, Texte)
│   ├── lineup.json       # Acts & Bühnen
│   ├── aftermovies.json  # Aftermovies
│   ├── pastArtists.json  # Slider of Fame
│   ├── sponsors.json     # Sponsoren
│   └── map.json          # POI Informationen
├── _includes/
│   ├── layouts/          # Basis-Layouts
│   │   ├── base.njk
│   │   └── blog-post.njk
│   ├── header.njk
│   ├── footer.njk
│   ├── cookie-banner.njk
│   ├── video-modal.njk
│   └── cta-final.njk
├── assets/
│   ├── fonts/
│   ├── images/
│   └── ...
├── blog/                 # Blog-Posts als Markdown
├── css/
│   └── style.css
├── js/
│   └── main.js
├── index.njk
├── blog.njk
├── faq.njk
├── ueber-uns.njk
├── impressum.njk
├── agb.njk
└── datenschutz.njk
```

---

## ⚙️ Konfiguration

Die meisten Inhalte werden über `src/_data/config.json` gesteuert:

| Feld              | Beschreibung                           |
| ----------------- | -------------------------------------- |
| `festivalDate`    | Datum des Festivals (ISO 8601)         |
| `festivalEndDate` | Enddatum für Post-Festival-Modus       |
| `ticketUrl`       | Link zum Ticketshop                    |
| `pressepoolUrl`   | Download-Link für den Pressepool (ZIP) |
| `navigation`      | Navigationslinks                       |
| `footerLinks`     | Links im Footer (Impressum, etc.)      |

---

## 📰 Pressepool

Der Pressepool enthält Pressematerialien (Bilder, Texte, Logos) für Medienvertreter.

### Hosting via GitHub Releases

Der Pressepool wird als ZIP-Datei über **GitHub Releases** bereitgestellt:

1. Gehe zu **Releases** im GitHub Repository
2. Klicke auf **"Create a new release"**
3. Vergib einen Tag, z.B. `pressepool-2026`
4. Lade die ZIP-Datei unter **"Attach binaries"** hoch
5. Veröffentliche den Release

Der Download-Link hat folgendes Format:

```
https://github.com/[user]/[repo]/releases/download/pressepool-2026/pressepool-htbw-2026.zip
```

### URL aktualisieren

Den Link in `src/_data/config.json` eintragen:

```json
{
  "pressepoolUrl": "https://github.com/[user]/[repo]/releases/download/pressepool-2026/pressepool-htbw-2026.zip"
}
```

Der Download-Button erscheint automatisch im Footer sobald `pressepoolUrl` gesetzt ist. Ist das Feld leer oder nicht vorhanden, wird der Button ausgeblendet.

### Pressepool aktualisieren

Um den Pressepool zu aktualisieren, einfach einen neuen Release erstellen und die URL in `config.json` anpassen.

---

## 🎬 YouTube / Cookie Consent

Videos werden erst nach expliziter Nutzer-Zustimmung geladen (DSGVO-konform):

- Beim ersten Besuch erscheint ein Cookie-Banner
- Ohne Zustimmung werden Video-Placeholders mit Hinweis angezeigt
- Nach Zustimmung werden YouTube-Embeds als Facades geladen (Klick → Autoplay)
- Die Einstellung kann im Footer jederzeit geändert werden
- Es wird `youtube-nocookie.com` verwendet

---

## 📝 Blog

Blog-Posts werden als Markdown-Dateien in `src/blog/` angelegt:

```markdown
---
layout: blog-post.njk
title: "Titel des Posts"
date: 2026-03-20
category: News
teaser: "Kurze Zusammenfassung für die Blog-Übersicht."
image: /assets/images/blog/mein-bild.jpg
imageAlt: Bildbeschreibung
---

Inhalt des Posts in Markdown...
```

---

## 🌈 Post-Festival Modus

Nach dem `festivalEndDate` wechselt die Website automatisch in den Post-Festival-Modus:

- Hero-Section und Ticket-CTAs werden ausgeblendet
- Eine Dankes-Section wird eingeblendet
- Der Countdown verschwindet

---

## ♿ Barrierefreiheit

- WCAG 2.1 AA angestrebt
- Alle Bilder haben Alt-Texte
- Farbkontraste geprüft (Accessibility Insights for Web)
- Reduced Motion wird respektiert
- Keyboard-Navigation unterstützt

---

## Google Event Schema

Verwendet, damit Google das Event direkt anzeigen kann und nicht nur den Unternehmensaccount.

Um das Schema leicht zu erstellen kann der Schema Markup Generator [https://technicalseo.com/tools/schema-markup-generator/](https://technicalseo.com/tools/schema-markup-generator/) verwendet werden.

---

## 📄 Lizenz

© 2026 Jugendkulturverein Horn e.V. Alle Rechte vorbehalten.
