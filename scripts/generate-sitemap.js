#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Generates sitemap.xml, sitemap-news.xml, sitemap-tickets.xml for TicketNexus.
 * Reads slugs dynamically from source data files — always up to date.
 * Run: node scripts/generate-sitemap.js
 */

const fs   = require('fs');
const path = require('path');

const SITE_URL   = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_DIR    = path.join(__dirname, '..', 'src', 'lib', 'data');

// ── data readers ──────────────────────────────────────────────────────────

/** All sport slugs from sports.ts */
function getSportSlugs() {
  const src = fs.readFileSync(path.join(SRC_DIR, 'sports.ts'), 'utf-8');
  return [...src.matchAll(/^\s+slug:\s*'([^']+)'/gm)].map(m => m[1]);
}

/** All league { slug, sportSlug } pairs from leagues.ts */
function getLeagues() {
  const src    = fs.readFileSync(path.join(SRC_DIR, 'leagues.ts'), 'utf-8');
  const leagues = [];
  for (const block of src.split(/\n  \{/)) {
    const slugM  = block.match(/slug:\s*'([^']+)'/);
    const sportM = block.match(/sportSlug:\s*'([^']+)'/);
    if (slugM && sportM) leagues.push({ slug: slugM[1], sportSlug: sportM[1] });
  }
  return leagues;
}

/** All news articles { slug, title, publishedAt } from news.ts */
function getNewsArticles() {
  const src      = fs.readFileSync(path.join(SRC_DIR, 'news.ts'), 'utf-8');
  const articles = [];
  for (const block of src.split(/\n\s*\{/)) {
    const slugM      = block.match(/slug:\s*'([^']+)'/);
    const titleM     = block.match(/title:\s*'([^']+)'/);
    const publishedM = block.match(/publishedAt:\s*'([^']+)'/);
    if (slugM && titleM && publishedM) {
      articles.push({
        slug:        slugM[1],
        title:       titleM[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        publishedAt: publishedM[1],
      });
    }
  }
  return articles;
}

/** Upcoming (today+) clean ticket slugs from tickets.ts, sorted by date+time */
function getTicketSlugs() {
  const src   = fs.readFileSync(path.join(SRC_DIR, 'tickets.ts'), 'utf-8');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = [];
  const lines  = src.split('\n');

  let currentSlug = null;
  let currentDate = null;
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('slug:')) {
      const m = trimmed.match(/slug:\s*'([^']+)'/);
      currentSlug = (m && !/-44\d{9,}$/.test(m[1])) ? m[1] : null;
      currentDate = null;
    } else if (trimmed.startsWith('date:') && currentSlug) {
      const m = trimmed.match(/date:\s*'([^']+)'/);
      if (m) currentDate = m[1];
    } else if (trimmed.startsWith('time:') && currentSlug && currentDate) {
      const m = trimmed.match(/time:\s*'([^']+)'/);
      const time = m ? m[1] : '00:00';
      if (new Date(currentDate) >= today) {
        events.push({ slug: currentSlug, sortKey: `${currentDate}T${time}` });
      }
      currentSlug = null;
      currentDate = null;
    }
  }

  events.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return events.map(e => e.slug);
}

// ── url builder ───────────────────────────────────────────────────────────

function buildUrl(loc, changefreq = 'weekly', priority = '0.7', lastmod) {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
}

// ── generators ────────────────────────────────────────────────────────────

function generateMainSitemap(today) {
  const sports  = getSportSlugs();
  const leagues = getLeagues();

  const companyPages = ['about', 'contact', 'terms', 'privacy', 'cookies', 'affiliate-disclosure'];
  const partners     = ['footballticketnet', 'awin'];

  const urls = [
    // Core pages
    buildUrl(SITE_URL,                       'daily',  '1.0', today),
    buildUrl(`${SITE_URL}/partners`,         'weekly', '0.8', today),
    buildUrl(`${SITE_URL}/news`,             'daily',  '0.8', today),

    // Sport category pages
    ...sports.map(s =>
      buildUrl(`${SITE_URL}/${s}`, 'hourly', '0.9', today)
    ),

    // League pages  /{sportSlug}/{leagueSlug}
    ...leagues.map(l =>
      buildUrl(`${SITE_URL}/${l.sportSlug}/${l.slug}`, 'daily', '0.8', today)
    ),

    // Partner pages
    ...partners.map(p =>
      buildUrl(`${SITE_URL}/partners/${p}`, 'weekly', '0.7', today)
    ),

    // Company / legal pages
    ...companyPages.map(p =>
      buildUrl(`${SITE_URL}/company/${p}`, 'monthly', '0.3', today)
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function generateNewsSitemap() {
  const articles = getNewsArticles();

  const items = articles.map(a => `  <url>
    <loc>${SITE_URL}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>TicketNexus</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt}</news:publication_date>
      <news:title>${a.title}</news:title>
    </news:news>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;
}

function generateTicketsSitemap(today) {
  const slugs = getTicketSlugs();
  const urls  = slugs.map(slug => buildUrl(`${SITE_URL}/tickets/${slug}`, 'daily', '0.8', today));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// ── write ─────────────────────────────────────────────────────────────────

const today   = new Date().toISOString().split('T')[0];
const sports  = getSportSlugs();
const leagues = getLeagues();
const tickets = getTicketSlugs();

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateMainSitemap(today));
console.log(`✅  sitemap.xml        — ${sports.length} sports, ${leagues.length} leagues, 2 partners, 6 company pages`);

const newsArticles = getNewsArticles();
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-news.xml'), generateNewsSitemap());
console.log(`✅  sitemap-news.xml   — ${newsArticles.length} articles`);

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tickets.xml'), generateTicketsSitemap(today));
console.log(`✅  sitemap-tickets.xml — ${tickets.length} tickets`);
