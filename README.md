# Kedarnath Mohan — Personal Portfolio

my deep-space-themed personal portfolio built with nextjs, react, and tailwind. contains a starfield background, horizontal experience bar, nx3 grid of projects, and an easter egg (try to find it :p).

## Stack

- **Framework** — Next.js 15 (App Router)
- **UI** — React 19, Tailwind CSS v4, Framer Motion
- **Language** — TypeScript
- **Fonts** — Sentient (display), system mono

## Getting Started

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Animated starfield + galaxy background
- Floating side-nav orbs with keyboard shortcuts (`1` `2` `3`)
- Slide-in notification with 5-second timer and collapsible tray
- About Me modal triggered from the notification
- Horizontal experience timeline (expandable cards)
- Project grid (3-column, equal-height rows) with closed-source indicators
- Sci-fi HUD skill tags across hero, projects, and modal


## Project Structure

```
app/
├── app/
│   ├── api/send-message/   # Contact form API route
│   ├── globals.css          # Global styles + skill-tag class
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── sections/            # Hero, Experience, Projects, Contact
│   ├── space/               # StarField, GalaxyBackground
│   ├── notification.tsx     # Notification + About Me modal
│   └── side-nav.tsx         # Floating nav orbs
└── public/fonts/            # Sentient font files
```
