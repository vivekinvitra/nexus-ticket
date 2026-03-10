# StrikeZone Tickets

A production-ready sports ticket comparison platform built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

## Tech Stack

- **Framework:** Next.js 14 (App Router, SSR)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables (light theme design tokens)
- **Fonts:** Poppins (headings) + Inter (body)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your settings

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
# Production build
npm run build

# Generate sitemap
npm run sitemap

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout (fonts, metadata)
│   ├── page.tsx                Home page
│   ├── globals.css             Design tokens + global styles
│   ├── not-found.tsx           404 page
│   ├── category/[slug]/        Sport category pages
│   ├── legal/[slug]/           Legal pages (terms, privacy, etc.)
│   ├── news/                   News listing page
│   └── partners/               Partners listing + detail pages
├── components/
│   ├── layout/
│   │   ├── Header.tsx          Sticky nav + sport category tabs
│   │   └── Footer.tsx          Footer with legal/partner links
│   ├── home/
│   │   ├── Hero.tsx            Hero section with stats
│   │   ├── DateFilterBar.tsx   Sticky date filter bar
│   │   ├── NewsSection.tsx     News card grid
│   │   └── PartnersStrip.tsx   Partner chips strip
│   ├── tickets/
│   │   ├── FilterPanel.tsx     Left sidebar filter panel
│   │   ├── TicketTable.tsx     Ticket listing table with rows
│   │   └── TicketModal.tsx     Price comparison modal
│   └── common/
│       └── Icon.tsx            Inline SVG icons
└── lib/
    ├── types.ts                TypeScript interfaces
    ├── data/
    │   ├── sports.ts           Sport categories data
    │   ├── tickets.ts          Ticket events data
    │   ├── partners.ts         Partner platform data
    │   └── news.ts             News articles data
    └── utils/
        ├── seo.ts              SEO metadata helpers
        └── format.ts           Price/date formatting
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, date filter, ticket table, news |
| `/category/[slug]` | Sport category page (8 sports) |
| `/partners` | All partner platforms listing |
| `/partners/[slug]` | Individual partner review page |
| `/legal/[slug]` | Legal pages (terms, privacy, cookies, disclosure) |
| `/news` | News & guides listing |

## Scripts

```bash
npm run sitemap          # Generate sitemap.xml files
npm run minify           # Extra CSS/JS minification pass
npm run optimize:images  # Convert images to WebP/AVIF
```

## Design System

Design tokens in `src/app/globals.css`:

| Token | Value |
|-------|-------|
| `--primary` | `#10b981` (green) |
| `--primary-dark` | `#059669` |
| `--accent` | `#3b82f6` (blue) |
| `--text-dark` | `#1f2937` |
| `--text-gray` | `#6b7280` |
| `--border-gray` | `#e0e0e0` |

## Architecture Features (from IMPLEMENTATION-GUIDE)

- ✅ SEO & Full SSR (Next.js App Router)
- ✅ Component-based architecture
- ✅ Theme system (CSS variables)
- ✅ SVG icon system
- ✅ Service/data layer
- ✅ robots.txt + sitemap generation
- ✅ Image optimization script (Sharp)
- ✅ CSS/JS minification script (Terser + CSSNano)
- ✅ Environment variable management
- ✅ TypeScript throughout
- ✅ Security headers (next.config.js)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Lazy loading via Next.js dynamic imports
- ✅ Code splitting (automatic per-route)
