#!/usr/bin/env node
/**
 * generate-articles.mjs
 *
 * Uses Claude AI + the configurable prompt in scripts/news-template.json to
 * generate ESPN-style sports articles for upcoming ticket events.
 *
 * Target date : today + schedule.articleDaysAhead  (default: 2 days ahead)
 * Output      : src/lib/data/auto-articles.json
 *
 * Usage:
 *   node scripts/generate-articles.mjs
 *
 * Requires:
 *   ANTHROPIC_API_KEY  — in .env.local  OR  as a GitHub Actions secret
 *   NEXT_PUBLIC_SITE_URL (optional, defaults to https://www.ticket-nexus.com)
 */

import fs   from 'fs';
import path from 'path';

const ROOT_DIR      = path.join(import.meta.dirname, '..');
const SRC_DATA_DIR  = path.join(ROOT_DIR, 'src', 'lib', 'data');
const TICKETS_FILE  = path.join(SRC_DATA_DIR, 'tickets.ts');
const TEMPLATE_FILE = path.join(import.meta.dirname, 'news-template.json');
const OUTPUT_FILE   = path.join(SRC_DATA_DIR, 'auto-articles.json');

// ── load env from .env.local (skipped in CI where secrets are injected) ────
const envLocalPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SITE_URL          = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');

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
// Splits tickets.ts into per-event blocks and extracts fields for a given date.
// Only top-level string/number fields are extracted (partners array is skipped).

function parseTicketsForDate(targetDate) {
  const src    = fs.readFileSync(TICKETS_FILE, 'utf-8');
  const blocks = src.split(/\n  \{\n/);
  const events = [];

  for (const block of blocks) {
    // Quick filter before doing any regex work
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
    if (!slug || /-44\d{9,}$/.test(slug)) continue;  // skip duplicate feed entries
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

// ── article generation ─────────────────────────────────────────────────────

async function generateArticle(event, template, activePrompt) {
  const dateFormatted = formatDate(event.date);
  const ticketUrl     = `${SITE_URL}/tickets/${event.slug}`;
  const sport         = event.sport;
  const sportHint     = template.sportOverrides?.[sport] || '';
  const icon          = template.iconMap?.[sport] ?? template.iconMap?.['default'] ?? '🎟️';
  const model         = template.model || 'claude-haiku-4-5-20251001';

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

  return {
    id:              `auto-${event.slug}`,
    slug:            event.slug,
    title:           parsed.title           || event.eventName,
    snippet:         parsed.snippet         || '',
    category:        sport,
    icon,
    author:          template.meta.author,
    authorAvatar:    template.meta.authorAvatar,
    publishedAt:     today,
    addedon:         today,
    readTime:        typeof parsed.readTime === 'number' ? parsed.readTime : template.meta.defaultReadTime,
    imageUrl:        event.imageUrl
                       || template.defaultImages?.[sport]
                       || template.defaultImages?.['default']
                       || '',
    imageCaption:    parsed.imageCaption    || `${event.eventName} at ${event.venue}`,
    keyPoints:       Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 3) : [],
    featured:        template.meta.featured ?? false,
    leagueSlug:      event.leagueSlug       || undefined,
    ticketSlug:      event.slug,
    ticketUrl,
    sportUrl:        `/${sport}`,
    leagueUrl:       event.leagueSlug ? `/${sport}/${event.leagueSlug}` : undefined,
    metaTitle:       parsed.metaTitle       || event.eventName,
    metaDescription: parsed.metaDescription || '',
    metaKeywords:    parsed.metaKeywords    || '',
    content:         parsed.content         || '',
  };
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌  ANTHROPIC_API_KEY not set.');
    console.error('    Add it to .env.local  OR  set it as a GitHub Actions secret.');
    process.exit(1);
  }

  const template    = JSON.parse(fs.readFileSync(TEMPLATE_FILE, 'utf-8'));
  const activeKey   = template.prompts?.active;
  const activePrompt = template.prompts?.available?.[activeKey];

  if (!activePrompt) {
    console.error(`❌  Active prompt "${activeKey}" not found in news-template.json → prompts.available`);
    process.exit(1);
  }

  const daysAhead   = template.schedule?.articleDaysAhead  ?? 2;
  const maxArticles = template.schedule?.maxArticlesPerRun ?? 30;

  const targetDate  = addDays(daysAhead).toISOString().split('T')[0];

  console.log(`\n🎯  Target date  : ${targetDate}  (today + ${daysAhead} days)`);
  console.log(`🤖  Active prompt: "${activePrompt.name}"`);
  console.log(`📝  To change style, edit scripts/news-template.json → prompts.available.${activeKey}.instruction\n`);

  const events = parseTicketsForDate(targetDate);
  console.log(`📅  Events found : ${events.length} on ${targetDate}`);

  if (events.length === 0) {
    console.log('ℹ️  No events for target date. Writing empty array to auto-articles.json');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const limited  = events.slice(0, maxArticles);
  const articles = [];
  let   failed   = 0;

  for (let i = 0; i < limited.length; i++) {
    const event = limited[i];
    const label = `[${i + 1}/${limited.length}]`;
    process.stdout.write(`  ${label} ${event.eventName} … `);

    try {
      const article = await generateArticle(event, template, activePrompt);
      articles.push(article);
      console.log('✓');
    } catch (err) {
      console.log(`✗  ${err.message.split('\n')[0]}`);
      failed++;
    }

    // Brief pause between API calls to respect rate limits
    if (i < limited.length - 1) await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));

  console.log(`\n✅  Wrote ${articles.length} article(s) → src/lib/data/auto-articles.json`);
  if (failed > 0) console.log(`⚠️  ${failed} event(s) skipped due to API errors`);
  if (articles.length > 0) {
    articles.slice(0, 5).forEach(a => console.log(`   • ${a.title}`));
    if (articles.length > 5) console.log(`   … and ${articles.length - 5} more`);
  }
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1); });
