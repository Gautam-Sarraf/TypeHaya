# Typehaya ⌨️

A modern, fast, minimalist typing speed platform inspired by Monkeytype. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

---

## Features

- **High-Performance Typing Engine**: Character-level state machine (`untyped`, `correct`, `incorrect`, `extra`, `missed`, `active`) with zero-latency keystroke rendering and smooth caret positioning.
- **Multiple Test Modes**:
  - **Time**: 15s, 30s, 60s, 120s
  - **Words**: 10, 25, 50, 100 words
  - **Quote**: Categorized quotes (Short, Medium, Long, Thicc) with author citations
  - **Zen**: Unconstrained free typing
  - **Custom**: Custom text and drills
- **Rich Analytics**: Real-time Net WPM, Raw WPM, Accuracy %, Consistency %, typo heatmaps, and interactive SVG timeline performance charts.
- **16 Mechanical Keyboard Themes**: Instant real-time CSS variable switching across Serika Dark, Dracula, Cyberpunk, Nord, Carbon, Botanical, Chalk, 8008, Gruvbox, and more.
- **Audio Feedback**: Procedural Web Audio API sound synthesizer with zero latency (Cherry MX Blue, Cherry MX Brown, Pop, Typewriter) and quick top-left mute toggle.
- **Database & Accounts**: PostgreSQL with Prisma ORM. Full guest support with automatic local-to-account synchronization upon registration/login.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma 7](https://www.prisma.io/)
- **Audio**: Web Audio API (procedural synthesis)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` or create `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/typehaya_db?schema=public"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
npm run build
npm start
```
