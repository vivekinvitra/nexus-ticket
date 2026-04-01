#!/usr/bin/env node
/**
 * generate-articles.mjs
 *
 * Generates ESPN-style articles for upcoming ticket events via Claude AI,
 * then POSTs each article to the Cloudflare Worker / D1 database.
 *
 * Payload uses numeric IDs resolved from:
 *   GET /api/sports   → sport  ID
 *   GET /api/leagues  → league ID
 *   GET /api/authors  → author ID (random)
 *
 * Target date: today + schedule.articleDaysAhead (default 2).
 *              Falls back to the next date that has tickets.
 *
 * Requires:
 *   ANTHROPIC_API_KEY  — Claude API key
 *   NEWS_API_KEY       — Worker API key (x-api-key header)
 *
 * Optional:
 *   NEWS_INSERT_ENDPOINT — defaults to https://ticketapi.avi-kh.workers.dev/api/news
 *   NEXT_PUBLIC_SITE_URL — site base URL for ticket links
 */

import fs   from 'fs';
import path from 'path';

const ROOT_DIR      = path.join(import.meta.dirname, '..');
const SRC_DATA_DIR  = path.join(ROOT_DIR, 'src', 'lib', 'data');
const TICKETS_FILE  = path.join(SRC_DATA_DIR, 'tickets.ts');
const TEMPLATE_FILE = path.join(import.meta.dirname, 'news-template.json');
const API_BASE      = 'https://ticketapi.avi-kh.workers.dev';

// ── load env from .env.local (skipped in CI where secrets are injected) ────
const envLocalPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const ANTHROPIC_API_KEY    = process.env.ANTHROPIC_API_KEY || '';
const NEWS_API_KEY         = process.env.NEWS_API_KEY      || '';
const NEWS_INSERT_ENDPOINT = process.env.NEWS_INSERT_ENDPOINT || `${API_BASE}/api/news`;
const SITE_URL             = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');

// ── date helpers ───────────────────────────────────────────────────────────

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ── API lookup tables ──────────────────────────────────────────────────────
// Fetches sports, leagues, and authors once at startup.
// Returns maps for fast ID resolution during article generation.

async function fetchLookups() {
  const headers = { 'x-api-key': NEWS_API_KEY };

  const [sportsRes, leaguesRes, authorsRes] = await Promise.all([
    fetch(`${API_BASE}/api/sports`,  { headers }),
    fetch(`${API_BASE}/api/leagues`, { headers }),
    fetch(`${API_BASE}/api/authors`, { headers }),
  ]);

  const sports  = sportsRes.ok  ? await sportsRes.json()  : [];
  const leagues = leaguesRes.ok ? await leaguesRes.json() : [];
  const authors = authorsRes.ok ? await authorsRes.json() : [];

  // Build fast-lookup maps  — try slug first, then lowercase name
  const sportBySlug = new Map(sports.map(s  => [String(s.slug  || '').toLowerCase(), s.id]));
  const sportByName = new Map(sports.map(s  => [String(s.name  || '').toLowerCase(), s.id]));
  const leagueBySlug = new Map(leagues.map(l => [String(l.slug || '').toLowerCase(), l.id]));
  const leagueByName = new Map(leagues.map(l => [String(l.name || '').toLowerCase(), l.id]));
  const authorIds    = authors.map(a => a.id).filter(Boolean);

  console.log(`   sports: ${sports.length}  leagues: ${leagues.length}  authors: ${authors.length}`);

  return { sportBySlug, sportByName, leagueBySlug, leagueByName, authorIds };
}

function resolveSportId(event, lookups) {
  const slug = (event.sport || '').toLowerCase();
  return lookups.sportBySlug.get(slug)
      ?? lookups.sportByName.get(slug)
      ?? null;
}

function resolveLeagueId(event, lookups) {
  const bySlug = lookups.leagueBySlug.get((event.leagueSlug || '').toLowerCase());
  if (bySlug != null) return bySlug;
  return lookups.leagueByName.get((event.league || '').toLowerCase()) ?? null;
}

function pickRandomAuthorId(lookups) {
  const { authorIds } = lookups;
  if (!authorIds.length) return null;
  return authorIds[Math.floor(Math.random() * authorIds.length)];
}

// ── tickets parser ─────────────────────────────────────────────────────────

function findDateWithTickets(startDays, maxLookAhead = 30) {
  const src = fs.readFileSync(TICKETS_FILE, 'utf-8');
  for (let offset = 0; offset <= maxLookAhead; offset++) {
    const candidate = addDays(startDays + offset).toISOString().split('T')[0];
    const events    = parseTicketsForDate(src, candidate);
    if (events.length > 0) return { date: candidate, events, daysAhead: startDays + offset };
  }
  return { date: null, events: [], daysAhead: null };
}

function parseTicketsForDate(src, targetDate) {
  const blocks = src.split(/\n  \{\n/);
  const events = [];

  for (const block of blocks) {
    if (!block.includes(`date: '${targetDate}'`)) continue;

    const str = (f) => { const m = block.match(new RegExp(`    ${f}:\\s*'([^']*)'`)); return m ? m[1] : ''; };
    const num = (f) => { const m = block.match(new RegExp(`    ${f}:\\s*([\\d.]+)`));  return m ? parseFloat(m[1]) : 0; };

    const slug = str('slug');
    if (!slug || /-44\d{9,}$/.test(slug)) continue;
    if (str('date') !== targetDate) continue;

    events.push({
      slug,
      sport:        str('sport')        || 'general',
      leagueSlug:   str('leagueSlug'),
      eventName:    str('eventName'),
      league:       str('league'),
      date:         targetDate,
      time:         str('time')         || 'TBC',
      venue:        str('venue'),
      city:         str('city'),
      availability: str('availability') || 'high',
      minPrice:     num('minPrice'),
      currency:     str('currency')     || 'USD',
      imageUrl:     str('imageUrl'),
    });
  }
  return events;
}

// ── Claude API call ────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt, model) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'x-api-key':         ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({ model, max_tokens: 2048, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] }),
  });
  if (!res.ok) { const b = await res.text(); throw new Error(`Claude API ${res.status}: ${b.slice(0, 200)}`); }
  return (await res.json()).content?.[0]?.text ?? '';
}

// ── article generation ─────────────────────────────────────────────────────

async function generateArticle(event, template, activePrompt, lookups) {
  const dateFormatted = formatDate(event.date);
  const ticketUrl     = `${SITE_URL}/tickets/${event.slug}`;
  const sport         = event.sport;
  const sportHint     = template.sportOverrides?.[sport] || '';
  const model         = template.model || 'claude-haiku-4-5-20251001';

  // Resolve numeric IDs from lookup tables
  const sportId  = resolveSportId(event, lookups);
  const leagueId = resolveLeagueId(event, lookups);
  const authorId = pickRandomAuthorId(lookups);

  const systemPrompt = [
    activePrompt.instruction,
    sportHint ? `\nSport-specific guidance: ${sportHint}` : '',
    `\nYou are generating a structured article for Ticket Nexus — a sports ticket comparison website.`,
    `Always reply with ONLY a valid JSON object. No markdown, no code fences, no text outside the JSON.`,
  ].join('');

  const userPrompt = `Generate a sports article for the event below. Return ONLY a JSON object with these exact fields:

{
  "title": "H1 title — engaging, includes event name, league, and date reference (day of week or date, not 'today'/'tomorrow')",
  "snippet": "2-line snippet / meta summary under 160 characters. Punchy and informative.",
  "metaTitle": "SEO meta title under 60 characters",
  "metaDescription": "SEO meta description under 155 characters — includes event name and a CTA",
  "metaKeywords": "5-6 comma-separated keywords relevant to the event and ticket buying",
  "keyPoints": ["sharp insight 1", "sharp insight 2", "sharp insight 3"],
  "imageCaption": "Short descriptive caption for the hero image",
  "readTime": 3,
  "content": "Full HTML article body. Use <div>, <h2>, <p>, <strong> tags. Include a prominent <a href=\\"${ticketUrl}\\">Buy ${event.eventName} Tickets</a> link. Do NOT use HTML entities inside this JSON string — write raw HTML tags."
}

EVENT DETAILS:
- Event: ${event.eventName}
- League: ${event.league}
- Date: ${dateFormatted}
- Kick-off / Start time: ${event.time}
- Venue: ${event.venue}, ${event.city}
- Ticket availability: ${event.availability}
- Tickets from: ${event.currency}${event.minPrice.toFixed(2)}
- Ticket page: ${ticketUrl}`;

  const raw     = await callClaude(systemPrompt, userPrompt, model);
  const cleaned = raw.replace(/^```json\s*/im, '').replace(/^```\s*/im, '').replace(/```\s*$/,'').trim();

  let parsed;
  try { parsed = JSON.parse(cleaned); }
  catch { throw new Error(`JSON parse failed.\n${raw.slice(0, 400)}`); }

  // Bare Cloudflare image ID (strip /images/ prefix — API prepends CDN base URL)
  const rawImg   = event.imageUrl || '';
  const cfImgId  = rawImg.replace(/^\/images\//, '')
    || (template.defaultImages?.[sport] || template.defaultImages?.['default'] || '').replace(/^\/images\//, '')
    || 'news/1774428801020';

  // ── Final D1 payload ────────────────────────────────────────────────────
  return {
    slug:            event.slug,
    title:           parsed.title           || event.eventName,
    snippet:         parsed.snippet         || '',
    sport:           sportId,
    league:          leagueId,
    author:          authorId,
    publishedAt:     event.date,
    readTime:        typeof parsed.readTime === 'number' ? parsed.readTime : template.meta.defaultReadTime,
    featured:        false,
    image:           cfImgId,
    imageCaption:    parsed.imageCaption    || `${event.eventName} at ${event.venue}`,
    keyPoints:       Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 3) : [],
    metaTitle:       parsed.metaTitle       || event.eventName,
    metaDescription: parsed.metaDescription || '',
    metaKeywords:    parsed.metaKeywords    || '',
    content:         parsed.content         || '',
  };
}

// ── D1 / worker API insert ─────────────────────────────────────────────────

async function postArticleToApi(article) {
  const res = await fetch(NEWS_INSERT_ENDPOINT, {
    method:  'POST',
    headers: { 'x-api-key': NEWS_API_KEY, 'content-type': 'application/json' },
    body:    JSON.stringify(article),
  });
  if (res.status === 409) return 'duplicate';
  if (!res.ok) { const t = await res.text(); throw new Error(`Worker API ${res.status}: ${t.slice(0, 200)}`); }
  return 'created';
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!ANTHROPIC_API_KEY) { console.error('❌  ANTHROPIC_API_KEY not set.'); process.exit(1); }
  if (!NEWS_API_KEY)      { console.error('❌  NEWS_API_KEY not set.');       process.exit(1); }

  const template     = JSON.parse(fs.readFileSync(TEMPLATE_FILE, 'utf-8'));
  const activeKey    = template.prompts?.active;
  const activePrompt = template.prompts?.available?.[activeKey];
  if (!activePrompt) { console.error(`❌  Prompt "${activeKey}" not found in news-template.json`); process.exit(1); }

  const daysAhead   = template.schedule?.articleDaysAhead  ?? 5;
  const maxArticles = template.schedule?.maxArticlesPerRun ?? 20;

  console.log(`\n🎯  Preferred date  : today + ${daysAhead} days`);
  console.log(`🤖  Active prompt   : "${activePrompt.name}"`);
  console.log(`🗄️   Insert endpoint : ${NEWS_INSERT_ENDPOINT}\n`);

  // Resolve sport / league / author IDs from API
  console.log('🔍  Fetching lookup tables (sports / leagues / authors) …');
  const lookups = await fetchLookups();

  const { date: targetDate, events, daysAhead: actualDaysAhead } = findDateWithTickets(daysAhead);
  if (!targetDate) { console.log('ℹ️  No upcoming events within 30 days.'); return; }

  if (actualDaysAhead !== daysAhead)
    console.log(`⏭️  No events on today + ${daysAhead} — fell back to ${targetDate} (today + ${actualDaysAhead}).`);
  console.log(`📅  Events found : ${events.length} on ${targetDate}  (today + ${actualDaysAhead} days)\n`);

  const limited  = events.slice(0, maxArticles);
  let created = 0, duplicates = 0, failed = 0;

  for (let i = 0; i < limited.length; i++) {
    const event = limited[i];
    process.stdout.write(`  [${i + 1}/${limited.length}] ${event.eventName} … `);

    try {
      const article = await generateArticle(event, template, activePrompt, lookups);

      // ── Show raw payload for the first article so it can be verified ──
      if (i === 0) {
        console.log('\n\n📦  Sample raw payload (first article):\n');
        console.log(JSON.stringify(article, null, 2));
        console.log('\n');
      }

      if (i < limited.length - 1) await new Promise(r => setTimeout(r, 400));

      const result = await postArticleToApi(article);
      if (result === 'duplicate') { console.log('⏭  duplicate'); duplicates++; }
      else                        { console.log('✓  saved');     created++;    }
    } catch (err) {
      console.log(`✗  ${err.message.split('\n')[0]}`);
      failed++;
    }
  }

  console.log(`\n✅  Done — ${created} created, ${duplicates} duplicate(s), ${failed} error(s)`);
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1); });
