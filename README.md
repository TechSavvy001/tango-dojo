# TangoDojo – Der smarte Vokabeltrainer für Japanisch

**TangoDojo** ist eine moderne, benutzerspezifische Lernplattform für Japanisch-Vokabeln. Sie kombiniert Karteikarten, Quiz, Fortschrittsverfolgung und AI-gestützte Inhalte in einem fokussierten UI mit Dark Mode.

---

**Live-Demo online auf Vercel verfügbar:**  
[https://tango-dojo.vercel.app/](https://tango-dojo.vercel.app/)

---

## Features

- **Benutzerspezifisches Lernen:** Nur eigene Vokabeln, eigene Fortschritte
- **Karteikarten-Modus:** Anki-inspiriert mit Fortschrittsbalken
- **Quiz-Modus:** Multiple-Choice-Fragen aus deinen Vokabeln
- **Dashboard:** Streak, Fortschritt, Erfolgsquote, meistgeübte Wörter
- **Deck-Verwaltung:** Organisiere deine Vokabeln in Themen-Decks
- **AI-Integration:** Vokabeln automatisch befüllen mit Beispielsätzen & Erklärungen
- **Dark Mode:** Komplett abgestimmt auf alle Komponenten
- **Admin-Bereich:** Kanji-Daten, Review-Logs, Rollenverwaltung

---

## Tech Stack

| Technologie              | Zweck                                       |
| ------------------------ | ------------------------------------------- |
| **Next.js** (App Router) | Framework für Fullstack React               |
| **Supabase**             | Auth, DB (Postgres), Storage                |
| **ShadCN/UI**            | UI-Komponenten & Design-System              |
| **Tailwind CSS**         | Utility-First Styling mit Dark Mode Support |
| **OpenAI API**           | (optional) für AI-Unterstützung             |
| **TypeScript**           | Statische Typisierung                       |

---

## Projektstruktur

```bash
/app
  /(auth)              → Login / Register Pages
  /(main)              → App-Layout mit Sidebar
  /dashboard           → Fortschrittsübersicht
  /vokabeln            → Vokabelverwaltung (CRUD)
  /quiz                → Quiz-Modus
  /karteikarten        → Karteikarten-Modus
  /kanji               → Kanji-Lernbereich
  /admin               → Adminfunktionen

/components
  /ui                  → ShadCN-Komponenten
  /quiz                → Quiz-spezifische Komponenten
  /layout              → Sidebar, Header etc.
  /cards               → Dashboard-Karten

/lib
  supabase-browser.ts  → Supabase Client
  getUserWithRole.ts   → Auth+Rollen-Helper
  shuffle.ts           → Quiz-Zufallsfunktion

/styles
  globals.css          → Design Tokens & Dark Mode
```

---

## Screenshots

---

## 🔧 Getting Started

1. Projekt klonen

```bash
git clone https://github.com/deinname/tangodojo.git
cd tangodojo
```

2. Abhängigkeiten

```bash
npm install
```

3. .env anlegen (siehe .env.example)

```bash
cp .env.example .env
```

4. Dev-Server starten

```bash
npm run dev
```

---

## .env Konfiguration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

OPENAI_API_KEY=...
```

---

## Authentifizierung & Rollen

- Supabase Auth mit JWT
- Rollen (admin/user) werden aus Supabase-Tabelle `users` geladen
- Middleware schützt Seiten basierend auf Rolle und Login-Zustand

---

## Lizenz

MIT © TechSavvy001
