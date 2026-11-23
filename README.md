# Better City

> **Spatial Civic Reporting Platform** — Transforming citizen complaints into real urban change.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## What is Better City?

**Better City** is a modern, full-stack civic issue reporting platform that empowers citizens to report real-world infrastructure problems — potholes, broken streetlights, water leaks, garbage overflow, safety hazards and more — directly to the responsible municipal authorities.

Built with a **Spatial UI design language** inspired by Apple visionOS, Apple Maps, and Arc Browser, Better City turns chaotic complaint registers into an open, visual civic intelligence layer. Every report is geotagged, photo-verified, and routed to the right department.

---

## Core Features

| Feature | Description |
|---|---|
| **Photo Reporting** | Upload up to 4 compressed photos as visual evidence |
| **GPS Auto-Detection** | Auto-detects location using browser geolocation API |
| **11 Issue Categories** | Pothole, Streetlight, Water Leak, Garbage, Road Damage, Noise, Safety Hazard, Traffic, Accident, Cleanup, Other |
| **Urgency Triage** | Low / Medium / High / Critical priority levels |
| **Auth + Anonymous** | Sign in to track reports, or submit anonymously |
| **Citizen Dashboard** | Personal reports with status lifecycle tracking |
| **Representatives Directory** | Search verified authorities by city, district, and department |
| **Bilingual** | Full English and Hindi language support |
| **Dark / Light Mode** | Instant theme switching, persisted across sessions |
| **Admin Portal** | 24-digit rolling security token with Discord webhook integration |
| **Discord Integration** | Silently routes admin token requests to a secure Discord channel |
| **Post Moderation** | Admins can permanently remove posts from the platform |

---

## Design System

Better City uses a custom **Spatial UI** design language:

```
Background:     #121A24   (deep navy)
Card Surface:   #1E2938   (layered surface)
Primary Blue:   #3B82F6
Accent Green:   #2E9D68   (resolved / positive)
Warning Orange: #FFB547   (pending / in-progress)
Main Text:      #F8FAFC
```

- Floating glass panels with layered depth
- 16–24px rounded corners
- Thin borders with soft shadows
- Smooth Framer Motion micro-interactions
- Lucide React icons throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 3 (CSS variable-driven theming) |
| **Animations** | Framer Motion 14 |
| **Icons** | Lucide React |
| **Backend (optional)** | Supabase (Postgres + Auth) |
| **State** | React Context API |
| **Linting** | oxlint |
| **Notifications** | Discord Webhooks |

---

## Startup Guide

### Prerequisites

- **Node.js** `v18+` — [Download here](https://nodejs.org)
- **npm** `v9+` (comes with Node.js)
- A terminal (PowerShell, Bash, or any shell)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/bettercity.git
cd bettercity
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file at the project root:

```env
# Optional: Supabase integration (skip if using localStorage mode)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord Webhook for admin token delivery
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

> **Note:** The app works fully in local/offline mode without Supabase. Reports are stored in localStorage automatically.

### 4. Add Logo Asset

Place your `logo.webp` in the `public/` folder:

```
public/
  logo.webp     ← Brand logo used in Navbar, Auth pages
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production

```bash
npm run build
```

Built files are output to `dist/`. You can deploy to Vercel, Netlify, Cloudflare Pages, or any static host.

```bash
# Preview the production build locally
npm run preview
```

---

## Admin Portal Access

The Officer Admin Portal is protected by a **rolling 24-digit security token** that regenerates every 24 hours.

To obtain today's token:
1. Navigate to the **Officer Admin Console** (via footer or navbar link)
2. Click **" Reveal today's 24-digit key (officer verification)"**
3. The token is silently dispatched to the configured Discord channel — check your server

Enter the token in the format: `XXXX-XXXX-XXXX-XXXX-XXXX-XXXX`

---

## Project Structure

```
bettercity/
├── public/
│   └── logo.webp
├── src/
│   ├── components/        # Reusable UI components (Navbar, ReportModal, IssueCard…)
│   ├── contexts/          # React Context providers (Auth, Theme, Language, Reports)
│   ├── lib/               # Translations, categories config, Supabase client
│   ├── pages/             # Full page components (Landing, Dashboard, Admin, Contact…)
│   ├── services/          # Business logic (reports.ts, admin.ts, discord.ts)
│   ├── types/             # TypeScript type definitions
│   └── main.tsx           # App entry point
├── .env                   # Environment variables (not committed)
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Our Team

| Role | Responsibility |
|---|---|
| **Account Management** | Yash Pohankar | Team Leader |
| **Full Stack Developer** | Harshit Rawat |
| **UI/UX Designer** | Yogesh Purushottam |
| **Data Analyst** | Munir Fatma |
| **Performance Marketing** | Amir Khan|


---

## AI Assistance Disclosure

Approximately **30% of this project** involved AI-assisted development. We used the following tools:

- **Claude** (Anthropic) — Architecture decisions, complex component logic, and TypeScript type refinement
- **Gemini** (Google DeepMind) — UI ideation, translation generation, and code review suggestions
- **ChatGPT** (OpenAI) — Boilerplate generation, documentation drafts, and debugging assistance

The remaining **70%** was written, reviewed, designed, and validated entirely by our team — including all civic data, design decisions, business logic, security implementation, and final QA.

---

## Roadmap

- [ ] Real-time Supabase database sync across all users
- [ ] Push notifications when report status changes
- [ ] Authority dashboard for municipal officers
- [ ] Public upvoting feed with top-trending issues
- [ ] PWA (Progressive Web App) support for offline reporting
- [ ] Integration with India's existing civic portals (PGPortal, 311)

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---
