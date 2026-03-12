#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Generates sitemap.xml and sitemap-news.xml for TicketNexus
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticket-nexus.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const SPORTS = [
  'football', 'cricket', 'horse-racing', 'tennis',
  'boxing', 'formula-1', 'rugby', 'golf',
];

const PARTNERS = [
  'footballticketnet', 'awin',
];

const COMPANY_PAGES = ['about', 'contact', 'terms', 'privacy', 'cookies', 'affiliate-disclosure'];

function buildUrl(loc, changefreq = 'weekly', priority = '0.7', lastmod) {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
}

function generateMainSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    buildUrl(SITE_URL, 'daily', '1.0', today),
    buildUrl(`${SITE_URL}/partners`, 'weekly', '0.8', today),
    buildUrl(`${SITE_URL}/news`, 'daily', '0.8', today),
    ...SPORTS.map((s) => buildUrl(`${SITE_URL}/${s}`, 'hourly', '0.9', today)),
    ...PARTNERS.map((p) => buildUrl(`${SITE_URL}/partners/${p}`, 'weekly', '0.7', today)),
    ...COMPANY_PAGES.map((p) => buildUrl(`${SITE_URL}/company/${p}`, 'monthly', '0.3', today)),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function generateNewsSitemap() {
  const today = new Date().toISOString().split('T')[0];

  // In production, fetch from database
  const newsArticles = [
    { slug: 'premier-league-ticket-prices-2025', title: 'Premier League 2024/25: How to Find the Best Ticket Deals' },
    { slug: 'cheltenham-festival-guide-2025', title: 'Cheltenham Festival 2025: Complete Ticket Buying Guide' },
    { slug: 'wimbledon-ballot-tips', title: '5 Tips for the Wimbledon Ballot' },
    { slug: 'f1-silverstone-hospitality-guide', title: 'British GP 2025: Grandstand vs Paddock Club' },
    { slug: 'boxing-ticket-buying-tips', title: 'How to Buy Boxing Tickets' },
    { slug: 'cricket-test-match-best-seats', title: 'England Cricket 2025: Best Seats Guide' },
  ];

  const items = newsArticles
    .map(
      (a) => `  <url>
    <loc>${SITE_URL}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>TicketNexus</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${today}</news:publication_date>
      <news:title>${a.title}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;
}

const TICKET_SLUGS = [
  'manchester-united-vs-arsenal-2025-03-15',
  'chelsea-vs-liverpool-2025-03-22',
  'fifa-world-cup-2026-opening-match',
  'fifa-world-cup-2026-quarter-final',
  'fifa-world-cup-2026-semi-final',
  'fifa-world-cup-2026-grand-final',
  'champions-league-final-2025-05-31',
  'champions-league-quarter-final-1st-leg-2025-04-08',
  'champions-league-semi-final-2025-04-29',
  'wimbledon-mens-final-2026-07-12',
  'wimbledon-womens-final-2026-07-11',
  'wimbledon-quarter-finals-day-2026-07-07',
  'wimbledon-first-week-ground-pass-2026-07-01',
  'royal-ascot-gold-cup-day-2026-06-18',
  'royal-ascot-opening-day-2026-06-16',
  'royal-ascot-diamond-jubilee-day-2026-06-20',
  't20-world-cup-2026-opening-match',
  't20-world-cup-2026-india-vs-pakistan',
  't20-world-cup-2026-super-8-match',
  't20-world-cup-2026-final',
  'england-vs-india-1st-test-2025-06-05',
  'world-heavyweight-championship-2025-04-05',
  'british-grand-prix-2025-07-06',
  'england-vs-france-six-nations-2025-03-08',
  'the-open-championship-day-1-2025-07-17',
];

function generateTicketsSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urls = TICKET_SLUGS.map((slug) => buildUrl(`${SITE_URL}/tickets/${slug}`, 'daily', '0.8', today));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// Write files
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateMainSitemap());
console.log('✅ sitemap.xml generated');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-news.xml'), generateNewsSitemap());
console.log('✅ sitemap-news.xml generated');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tickets.xml'), generateTicketsSitemap());
console.log('✅ sitemap-tickets.xml generated');
