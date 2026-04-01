#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 * Generates sitemap.xml, sitemap-news.xml, sitemap-tickets.xml for TicketNexus.
 * Reads slugs dynamically from source data files — always up to date.
 * Run: node scripts/generate-sitemap.mjs
 */

import fs   from 'fs';
import path from 'path';

const SITE_URL   = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');
const SITE_NAME  = 'Ticket-Nexus';
const PUBLIC_DIR = path.join(import.meta.dirname, '..', 'public');
const SRC_DIR    = path.join(import.meta.dirname, '..', 'src', 'lib', 'data');

// Load NEWS_API_KEY from .env.local if not already in env
const envLocalPath = path.join(import.meta.dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const m = line.match(/^(NEWS_API_KEY)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

// Mirrors src/lib/config/api.ts — update both together if the API changes
const AUTH_URL     = 'https://ticketapi.avi-kh.workers.dev';
const ENDPOINTS    = { NEWS: '/api/ticket/news' };
const NEWS_API     = `${AUTH_URL}${ENDPOINTS.NEWS}?page=1&limit=100`;
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

// ── data readers ──────────────────────────────────────────────────────────

/** All active sport slugs from sports.ts (isActive: 'Y' only) */
function getSportSlugs() {
  const src = fs.readFileSync(path.join(SRC_DIR, 'sports.ts'), 'utf-8');
  // Split into per-sport blocks and only keep those with isActive: 'Y'
  return src
    .split(/\n  \{/)
    .filter(block => /isActive:\s*'Y'/.test(block))
    .map(block => { const m = block.match(/slug:\s*'([^']+)'/); return m ? m[1] : null; })
    .filter(Boolean);
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

/** Auto-generated articles written by generate-articles.mjs */
function getAutoArticles() {
  const autoPath = path.join(SRC_DIR, 'auto-articles.json');
  if (!fs.existsSync(autoPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(autoPath, 'utf-8'));
    if (!Array.isArray(data)) return [];
    return data.map(a => ({
      slug:        a.slug,
      title:       (a.title || '')
                     .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
      publishedAt: a.publishedAt,
    }));
  } catch (e) {
    console.warn('⚠️  Could not read auto-articles.json:', e.message);
    return [];
  }
}

/** Fetch all active news articles from the API */
async function fetchNewsArticles() {
  try {
    const res = await fetch(NEWS_API, { headers: { 'x-api-key': NEWS_API_KEY } });
    if (!res.ok) { console.warn(`⚠️  News API responded ${res.status}`); return []; }
    const data = await res.json();
    return data
      .filter(a => a.isactive === 'Y')
      .map(a => ({
        slug:        a.slug,
        title:       (a.title || '')
                       .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
        publishedAt: a.publishedAt || (a.addedon || '').split(' ')[0],
      }));
  } catch (e) {
    console.warn('⚠️  Could not fetch news:', e.message);
    return [];
  }
}

/** Upcoming tickets from tickets.ts — events within the next 20 days, sorted ascending */
function getUpcomingTickets() {
  const src    = fs.readFileSync(path.join(SRC_DIR, 'tickets.ts'), 'utf-8');
  const now    = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + 20);
  cutoff.setHours(23, 59, 59, 999);

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
      const eventDateTime = new Date(`${currentDate}T${time}:00`);
      if (eventDateTime >= now && eventDateTime <= cutoff) {
        events.push({ slug: currentSlug, date: currentDate, sortKey: `${currentDate}T${time}` });
      }
      currentSlug = null;
      currentDate = null;
    }
  }

  events.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return events;
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
    buildUrl(SITE_URL,                       'daily',  '1.0', today),
    buildUrl(`${SITE_URL}/partners`,         'weekly', '0.8', today),
    buildUrl(`${SITE_URL}/news`,             'daily',  '0.8', today),
    ...sports.map(s  => buildUrl(`${SITE_URL}/${s}`,                    'hourly',  '0.9', today)),
    ...leagues.map(l => buildUrl(`${SITE_URL}/${l.sportSlug}/${l.slug}`, 'daily',  '0.8', today)),
    ...partners.map(p => buildUrl(`${SITE_URL}/partners/${p}`,           'weekly', '0.7', today)),
    ...companyPages.map(p => buildUrl(`${SITE_URL}/company/${p}`,        'monthly','0.3', today)),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function generateNewsSitemap(articles) {
  const items = articles.map(a => `  <url>
    <loc>${SITE_URL}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
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

function generateTicketsSitemap(tickets) {
  const urls = tickets.map(e => buildUrl(`${SITE_URL}/tickets/${e.slug}`, 'daily', '0.8', e.date));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// ── write ─────────────────────────────────────────────────────────────────

async function main() {
  const today   = new Date().toISOString().split('T')[0];
  const sports  = getSportSlugs();
  const leagues = getLeagues();
  const tickets = getUpcomingTickets();

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateMainSitemap(today));
  console.log(`✅  sitemap.xml        — ${sports.length} sports, ${leagues.length} leagues, 2 partners, 6 company pages`);

  const newsArticles = await fetchNewsArticles();
  const autoArticles = getAutoArticles();
  // Merge: API articles first; auto-generated fill in (deduplicated by slug)
  const apiSlugs     = new Set(newsArticles.map(a => a.slug));
  const mergedNews   = [...newsArticles, ...autoArticles.filter(a => !apiSlugs.has(a.slug))];
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-news.xml'), generateNewsSitemap(mergedNews));
  console.log(`✅  sitemap-news.xml   — ${newsArticles.length} API + ${mergedNews.length - newsArticles.length} auto-generated (${mergedNews.length} total)`);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tickets.xml'), generateTicketsSitemap(tickets));
  console.log(`✅  sitemap-tickets.xml — ${tickets.length} upcoming tickets`);
}

main().catch(e => { console.error(e); process.exit(1); });
