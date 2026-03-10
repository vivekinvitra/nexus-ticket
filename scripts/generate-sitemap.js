#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Generates sitemap.xml and sitemap-news.xml for StrikeZone Tickets
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://strikezone-tickets.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const SPORTS = [
  'football', 'cricket', 'horse-racing', 'tennis',
  'boxing', 'formula-1', 'rugby', 'golf',
];

const PARTNERS = [
  'ticketmaster', 'stubhub', 'viagogo', 'seatwave', 'getmein', 'ticketswap',
];

const LEGAL = ['terms', 'privacy', 'cookies', 'affiliate-disclosure'];

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
    ...SPORTS.map((s) => buildUrl(`${SITE_URL}/category/${s}`, 'hourly', '0.9', today)),
    ...PARTNERS.map((p) => buildUrl(`${SITE_URL}/partners/${p}`, 'weekly', '0.7', today)),
    ...LEGAL.map((l) => buildUrl(`${SITE_URL}/legal/${l}`, 'monthly', '0.3', today)),
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
        <news:name>StrikeZone Tickets</news:name>
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

// Write files
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateMainSitemap());
console.log('✅ sitemap.xml generated');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-news.xml'), generateNewsSitemap());
console.log('✅ sitemap-news.xml generated');

// Sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), sitemapIndex);
console.log('✅ sitemap-index.xml generated');
