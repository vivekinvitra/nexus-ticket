#!/usr/bin/env node
/**
 * generate-articles.mjs
 *
 * Uses Claude AI + the configurable prompt in scripts/news-template.json to
 * generate ESPN-style sports articles for upcoming ticket events, then POSTs
 * each article directly to the Cloudflare Worker / D1 database API.
 *
 * Target date : today + schedule.articleDaysAhead  (default: 2 days ahead)
 *               Falls back to the next date that has tickets if that day is empty.
 *
 * Usage:
 *   node scripts/generate-articles.mjs
 *
 * Requires (in .env.local or GitHub Actions secrets):
 *   ANTHROPIC_API_KEY   — Claude API key for article generation
 *   NEWS_API_KEY        — Worker API key (same key used by the GET news endpoint)
 *
 * Optional:
 *   NEWS_INSERT_ENDPOINT — Full POST URL (default: https://ticketapi.avi-kh.workers.dev/api/ticket/news)
 *   NEXT_PUBLIC_SITE_URL — Site base URL for ticket links
 */

import fs   from 'fs';
import path from 'path';

const ROOT_DIR      = path.join(import.meta.dirname, '..');
const SRC_DATA_DIR  = path.join(ROOT_DIR, 'src', 'lib', 'data');
const TICKETS_FILE  = path.join(SRC_DATA_DIR, 'tickets.ts');
const TEMPLATE_FILE = path.join(import.meta.dirname, 'news-template.json');

// ── load env from .env.local (skipped in CI where secrets are injected) ────
const envLocalPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const ANTHROPIC_API_KEY  = process.env.ANTHROPIC_API_KEY  || '';
const NEWS_API_KEY       = process.env.NEWS_API_KEY       || '';
const NEWS_INSERT_ENDPOINT = process.env.NEWS_INSERT_ENDPOINT
  || 'https://ticketapi.avi-kh.workers.dev/api/ticket/news';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');

// ── sport slug → display category (mirrors normalizeCategory in news.ts) ──
const SPORT_TO_CATEGORY = {
  'football':          'Football',
  'tennis':            'Tennis',
  'cricket':           'Cricket',
  'horse-racing':      'Horse Racing',
  'boxing':            'Boxing',
  'formula-1':         'Formula 1',
  'rugby':             'Rugby',
  'golf':              'Golf',
  'american-football': 'American Football',
  'athletics':         'Athletics',
  'basketball':        'Basketball',
  'ice-hockey':        'Ice Hockey',
  'motorsports':       'Motorsports',
  'moto-gp':           'Moto GP',
  'cycling':           'Cycling',
  'darts':             'Darts',
  'esports':           'Esports',
  'swimming':          'Swimming',
};

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

// ── tickets parser ─────────────────────────────────────────────────────────

/**
 * Starting from startDays ahead, scan forward day-by-day until a date with
 * at least one event is found. Returns { date, events, daysAhead } for that
 * single day only. Looks up to maxLookAhead days beyond startDays before giving up.
 */
function findDateWithTickets(startDays, maxLookAhead = 30) {
  const src = fs.readFileSync(TICKETS_FILE, 'utf-8');

  for (let offset = 0; offset <= maxLookAhead; offset++) {
    const candidate = addDays(startDays + offset).toISOString().split('T')[0];
    const events    = parseTicketsForDateFromSrc(src, candidate);
    if (events.length > 0) {
      return { date: candidate, events, daysAhead: startDays + offset };
    }
  }
  return { date: null, events: [], daysAhead: null };
}

function parseTicketsForDateFromSrc(src, targetDate) {
  const blocks = src.split(/\n  \{\n/);
  const events = [];

  for (const block of blocks) {
    if (!block.includes(`date: '${targetDate}'`)) continue;

    const str = (field) => {
      const m = block.match(new RegExp(`    ${field}:\\s*'([^']*)'`));
      return m ? m[1] : '';
    };
    const num = (field) => {
      const m = block.match(new RegExp(`    ${field}:\\s*([\\d.]+)`));
      return m ? parseFloat(m[1]) : 0;
    };

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
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

// ── random author ──────────────────────────────────────────────────────────

function pickAuthor(authors) {
  if (!authors || authors.length === 0) return { name: 'Ticket Nexus Sports Desk', avatar: '' };
  return authors[Math.floor(Math.random() * authors.length)];
}

// ── article generation ─────────────────────────────────────────────────────

async function generateArticle(event, template, activePrompt) {
  const dateFormatted = formatDate(event.date);
  const ticketUrl     = `${SITE_URL}/tickets/${event.slug}`;
  const sport         = event.sport;
  const sportHint     = template.sportOverrides?.[sport] || '';
  const icon          = template.iconMap?.[sport] ?? template.iconMap?.['default'] ?? '🎟️';
  const model         = template.model || 'claude-haiku-4-5-20251001';
  const author        = pickAuthor(template.meta.authors);

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
  const cleaned = raw
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im,     '')
    .replace(/```\s*$/,       '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`JSON parse failed. Raw output:\n${raw.slice(0, 400)}`);
  }

  const today = new Date().toISOString().split('T')[0];

  // Extract bare Cloudflare image ID from ticket imageUrl (e.g. /images/abc123.png → abc123.png)
  // The news API prepends IMAGE_DELIVERY_BASE_URL, so we strip the /images/ prefix here.
  const rawImageUrl  = event.imageUrl || '';
  const cfImageId    = rawImageUrl.replace(/^\/images\//, '');
  const imageUrl     = cfImageId
    || (template.defaultImages?.[sport] || template.defaultImages?.['default'] || '').replace(/^\/images\//, '');

  return {
    slug:            event.slug,
    title:           parsed.title           || event.eventName,
    snippet:         parsed.snippet         || '',
    category:        SPORT_TO_CATEGORY[sport] || 'General',
    icon,
    league:          event.league,
    leagueSlug:      event.leagueSlug || null,
    author:          author.name,
    authorAvatar:    author.avatar,
    publishedAt:     event.date,   // event date → article appears as "upcoming"
    addedon:         today,        // actual creation date
    readTime:        typeof parsed.readTime === 'number' ? parsed.readTime : template.meta.defaultReadTime,
    featured:        template.meta.featured ? 1 : 0,
    isactive:        'Y',
    imageUrl,
    imageCaption:    parsed.imageCaption    || `${event.eventName} at ${event.venue}`,
    keyPoints:       JSON.stringify(Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 3) : []),
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
    headers: {
      'x-api-key':    NEWS_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(article),
  });

  if (res.status === 409) return 'duplicate'; // article with this slug already exists
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Worker API ${res.status}: ${text.slice(0, 200)}`);
  }
  return 'created';
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌  ANTHROPIC_API_KEY not set. Add to .env.local or GitHub Actions secrets.');
    process.exit(1);
  }
  if (!NEWS_API_KEY) {
    console.error('❌  NEWS_API_KEY not set. Add to .env.local or GitHub Actions secrets.');
    process.exit(1);
  }

  const template     = JSON.parse(fs.readFileSync(TEMPLATE_FILE, 'utf-8'));
  const activeKey    = template.prompts?.active;
  const activePrompt = template.prompts?.available?.[activeKey];

  if (!activePrompt) {
    console.error(`❌  Active prompt "${activeKey}" not found in news-template.json → prompts.available`);
    process.exit(1);
  }

  const daysAhead   = template.schedule?.articleDaysAhead  ?? 2;
  const maxArticles = template.schedule?.maxArticlesPerRun ?? 30;

  console.log(`\n🎯  Preferred date  : today + ${daysAhead} days`);
  console.log(`🤖  Active prompt   : "${activePrompt.name}"`);
  console.log(`🗄️   Insert endpoint : ${NEWS_INSERT_ENDPOINT}`);
  console.log(`📝  Edit prompt     : scripts/news-template.json → prompts.available.${activeKey}.instruction\n`);

  const { date: targetDate, events, daysAhead: actualDaysAhead } = findDateWithTickets(daysAhead);

  if (!targetDate) {
    console.log('ℹ️  No upcoming events found within 30 days. Nothing to generate.');
    return;
  }

  if (actualDaysAhead !== daysAhead) {
    console.log(`⏭️  No events on today + ${daysAhead} — fell back to ${targetDate} (today + ${actualDaysAhead}).`);
  }
  console.log(`📅  Events found : ${events.length} on ${targetDate}  (today + ${actualDaysAhead} days)\n`);

  const limited  = events.slice(0, maxArticles);
  let created    = 0;
  let duplicates = 0;
  let failed     = 0;

  for (let i = 0; i < limited.length; i++) {
    const event = limited[i];
    const label = `[${i + 1}/${limited.length}]`;
    process.stdout.write(`  ${label} ${event.eventName} … `);

    try {
      const article = await generateArticle(event, template, activePrompt);

      // Brief pause between Claude calls
      if (i < limited.length - 1) await new Promise(r => setTimeout(r, 400));

      const result = await postArticleToApi(article);
      if (result === 'duplicate') {
        console.log('⏭  duplicate (slug already exists in DB)');
        duplicates++;
      } else {
        console.log('✓  saved to D1');
        created++;
      }
    } catch (err) {
      console.log(`✗  ${err.message.split('\n')[0]}`);
      failed++;
    }
  }

  console.log(`\n✅  Done — ${created} created, ${duplicates} duplicate(s) skipped, ${failed} error(s)`);
  console.log(`    Articles now live in D1 and will appear via the news API.`);
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1); });
