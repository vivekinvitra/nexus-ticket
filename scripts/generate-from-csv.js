#!/usr/bin/env node
/**
 * generate-from-csv.js
 * Reads doc/datafeed_90270.csv and generates:
 *   - src/lib/data/tickets.ts  (preserving IDs 1-25, replacing 26-27 with full CSV)
 *   - src/lib/data/leagues.ts  (appending new league entries)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Paths ─────────────────────────────────────────────────────────────────────
const ROOT       = path.resolve(__dirname, '..');
const CSV_PATH   = path.join(ROOT, 'doc', 'datafeed_90270.csv');
const TICKETS_TS = path.join(ROOT, 'src', 'lib', 'data', 'tickets.ts');
const LEAGUES_TS = path.join(ROOT, 'src', 'lib', 'data', 'leagues.ts');

// ── CSV parsing (handles quoted fields with commas) ───────────────────────────
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = (values[i] || '').trim(); });
    return row;
  });
}

// ── Slug helpers ──────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Description parser ────────────────────────────────────────────────────────
// Handles:
//   "Event Type: Football, Venue: Stadium Name, Date: YYYY-MM-DD, Time: HH:MM:SS"
//   "Event Type: Football, Venue Name, Date: YYYY-MM-DD, Time: HH:MM:SS"
function parseDescription(desc) {
  const dateMatch  = desc.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
  const timeMatch  = desc.match(/Time:\s*(\d{2}:\d{2})(?::\d{2})?/);
  const venueMatch = desc.match(/Venue:\s*([^,]+)/);

  let venue = '';
  if (venueMatch) {
    venue = venueMatch[1].trim();
  } else {
    // Try the "Venue Name" variant: strip "Event Type: ..., " then take up to "Date:"
    const withoutEventType = desc.replace(/^Event Type:\s*[^,]+,\s*/, '');
    const beforeDate = withoutEventType.split(/,\s*Date:/)[0];
    venue = beforeDate.trim();
  }

  return {
    date:  dateMatch  ? dateMatch[1]  : '',
    time:  timeMatch  ? timeMatch[1]  : '',
    venue: venue,
  };
}

// ── League slug mapping ───────────────────────────────────────────────────────
const LEAGUE_SLUG_MAP = {
  'world-cup-2026':                  'fifa-world-cup',
  'italian-serie-a':                 'serie-a',
  'spanish-la-liga':                 'la-liga',
  'german-bundesliga':               'bundesliga',
  'french-ligue-1':                  'ligue-1',
  'german-2bundesliga':              'bundesliga-2',
  'la-liga-hypermotion':             'segunda-division',
  'efl-championship':                'efl-championship',
  'premier-league':                  'premier-league',
  'portuguese-liga-nos':             'portuguese-liga-nos',
  'champions-league':                'champions-league',
  'fa-cup':                          'fa-cup',
  'dfb-pokal':                       'dfb-pokal',
  'coupe-de-france':                 'coupe-de-france',
  'coppa-italia':                    'coppa-italia',
  'copa-del-rey':                    'copa-del-rey',
};

// Extract league slug from merchant_deep_link
// e.g. "https://www.footballticketnet.com/premier-league/sunderland-vs-burnley" → "premier-league"
// Also handles 3-segment paths like "/scottish-premiership/match-slug/123456" → "scottish-premiership"
function extractLeagueSlugFromUrl(url) {
  // Remove domain prefix
  const path = url.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
  const parts = path.split('/').filter(p => p);
  // Always use the FIRST segment as the league slug
  return parts[0] || '';
}

function mapLeagueSlug(csvSlug) {
  return LEAGUE_SLUG_MAP[csvSlug] || csvSlug;
}

// ── League display names for NEW entries ──────────────────────────────────────
const NEW_LEAGUE_NAMES = {
  'turkish-super-league':                   'Turkish Süper Lig',
  'scottish-premiership':                   'Scottish Premiership',
  'international-friendly-matches':         'International Friendly',
  'dutch-eredivisie':                       'Dutch Eredivisie',
  'saudi-pro-league':                       'Saudi Pro League',
  'europa-league':                          'UEFA Europa League',
  'nations-league':                         'UEFA Nations League',
  'world-cup-2026-european-qualifiers':     'World Cup 2026 Qualifiers (Europe)',
  'europa-conference-league':               'UEFA Conference League',
  'czech-first-league':                     'Czech First League',
  'belgian-first-division-a':               'Belgian First Division A',
  'taca-de-portugal':                       'Taça de Portugal',
  'turkish-cup':                            'Turkish Cup',
  'friendly-matches':                       'Friendly Matches',
  'carabao-cup':                            'Carabao Cup',
  'scottish-cup':                           'Scottish Cup',
  '2019-africa-cup-of-nations':             'Africa Cup of Nations',
  'danish-superliga':                       'Danish Superliga',
  'argentina-primera-division':             'Argentine Primera División',
  'women-world-cup-european-qualifiers':    "Women's World Cup Qualifiers",
  'women-fa-cup':                           "Women's FA Cup",
  'fa-community-shield':                    'FA Community Shield',
  'women-champions-league':                "Women's Champions League",
  'swiss-super-league':                     'Swiss Super League',
  'afc-champions-league-elite':             'AFC Champions League Elite',
  'finalissima-2025':                       'Finalissima 2025',
  'finalissima-2026':                       'Finalissima 2026',
  'world-cup-2026-qualifiers':              'World Cup 2026 Qualifiers',
};

// ── League meta for new entries ───────────────────────────────────────────────
const NEW_LEAGUE_META = {
  'turkish-super-league':                 { country: 'Turkey',          icon: '🇹🇷', color: '#e30a17', bg: '#3c0005', location: 'Nationwide, Turkey' },
  'scottish-premiership':                 { country: 'Scotland',        icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#003f91', bg: '#001a40', location: 'Nationwide, Scotland' },
  'international-friendly-matches':       { country: 'International',   icon: '🌍', color: '#6b7280', bg: '#1c1c1c', location: 'International' },
  'dutch-eredivisie':                     { country: 'Netherlands',     icon: '🇳🇱', color: '#ff6600', bg: '#3c1a00', location: 'Nationwide, Netherlands' },
  'saudi-pro-league':                     { country: 'Saudi Arabia',    icon: '🇸🇦', color: '#006c35', bg: '#002a15', location: 'Nationwide, Saudi Arabia' },
  'europa-league':                        { country: 'International',   icon: '🏆', color: '#f97316', bg: '#3c1a00', location: 'International' },
  'nations-league':                       { country: 'International',   icon: '🌍', color: '#3b82f6', bg: '#1a2d5e', location: 'International' },
  'world-cup-2026-european-qualifiers':   { country: 'International',   icon: '🌍', color: '#3b82f6', bg: '#1a3c5e', location: 'International' },
  'europa-conference-league':             { country: 'International',   icon: '🏆', color: '#10b981', bg: '#0d2a1a', location: 'International' },
  'czech-first-league':                   { country: 'Czech Republic',  icon: '🇨🇿', color: '#d7141a', bg: '#3c0005', location: 'Nationwide, Czech Republic' },
  'belgian-first-division-a':             { country: 'Belgium',         icon: '🇧🇪', color: '#000000', bg: '#1c1c1c', location: 'Nationwide, Belgium' },
  'taca-de-portugal':                     { country: 'Portugal',        icon: '🇵🇹', color: '#006600', bg: '#003300', location: 'Nationwide, Portugal' },
  'turkish-cup':                          { country: 'Turkey',          icon: '🇹🇷', color: '#e30a17', bg: '#3c0005', location: 'Nationwide, Turkey' },
  'friendly-matches':                     { country: 'International',   icon: '🌍', color: '#6b7280', bg: '#1c1c1c', location: 'International' },
  'carabao-cup':                          { country: 'England',         icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#0052cc', bg: '#001f5e', location: 'Nationwide, England' },
  'scottish-cup':                         { country: 'Scotland',        icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#003f91', bg: '#001a40', location: 'Nationwide, Scotland' },
  '2019-africa-cup-of-nations':           { country: 'International',   icon: '🌍', color: '#f59e0b', bg: '#332200', location: 'International' },
  'danish-superliga':                     { country: 'Denmark',         icon: '🇩🇰', color: '#c60c30', bg: '#3c0010', location: 'Nationwide, Denmark' },
  'argentina-primera-division':           { country: 'Argentina',       icon: '🇦🇷', color: '#74acdf', bg: '#1a3c5e', location: 'Nationwide, Argentina' },
  'women-world-cup-european-qualifiers':  { country: 'International',   icon: '👩', color: '#8b5cf6', bg: '#2d1060', location: 'International' },
  'women-fa-cup':                         { country: 'England',         icon: '👩', color: '#ef4444', bg: '#3c1010', location: 'Nationwide, England' },
  'fa-community-shield':                  { country: 'England',         icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#37003c', bg: '#1e0022', location: 'Wembley Stadium, London' },
  'women-champions-league':              { country: 'International',   icon: '👩', color: '#6366f1', bg: '#1c1a4e', location: 'International' },
  'swiss-super-league':                   { country: 'Switzerland',     icon: '🇨🇭', color: '#d40000', bg: '#3c0000', location: 'Nationwide, Switzerland' },
  'afc-champions-league-elite':           { country: 'International',   icon: '🏆', color: '#f97316', bg: '#3c1a00', location: 'International' },
  'finalissima-2025':                     { country: 'International',   icon: '🌍', color: '#6366f1', bg: '#1c1a4e', location: 'International' },
  'finalissima-2026':                     { country: 'International',   icon: '🌍', color: '#6366f1', bg: '#1c1a4e', location: 'International' },
  'world-cup-2026-qualifiers':            { country: 'International',   icon: '🌍', color: '#3b82f6', bg: '#1a3c5e', location: 'International' },
};

// ── Existing league slugs (do NOT add these) ──────────────────────────────────
const EXISTING_LEAGUE_SLUGS = new Set([
  'fifa-world-cup', 'champions-league', 'wimbledon', 'royal-ascot',
  't20-world-cup', 'premier-league', 'efl-championship', 'efl-league-one',
  'efl-league-two', 'fa-cup', 'la-liga', 'copa-del-rey', 'segunda-division',
  'primera-division-rfef', 'segunda-division-rfef', 'bundesliga', 'dfb-pokal',
  'bundesliga-2', 'bundesliga-3', 'bundesliga-5', 'ligue-1', 'ligue-2',
  'coupe-de-france', 'ligue-coupe', 'championnat-national', 'serie-a',
  'coppa-italia', 'serie-b', 'serie-c', 'serie-c2', 'portuguese-liga-nos',
]);

// Human-readable name for any league (mapped + existing fallback)
const LEAGUE_HUMAN_NAMES = {
  'fifa-world-cup':         'FIFA World Cup 2026',
  'champions-league':       'UEFA Champions League',
  'wimbledon':              'Wimbledon Championships',
  'royal-ascot':            'Royal Ascot',
  't20-world-cup':          'ICC T20 World Cup',
  'premier-league':         'English Premier League',
  'efl-championship':       'EFL Championship',
  'efl-league-one':         'English Football League One',
  'efl-league-two':         'English Football League Two',
  'fa-cup':                 'FA Cup',
  'la-liga':                'Spanish La Liga',
  'copa-del-rey':           'Copa del Rey',
  'segunda-division':       'Spanish Segunda Division',
  'primera-division-rfef':  'Spanish Primera Division RFEF',
  'segunda-division-rfef':  'Spanish Segunda Division RFEF',
  'bundesliga':             'Bundesliga',
  'dfb-pokal':              'DFB Pokal',
  'bundesliga-2':           'German Bundesliga 2',
  'bundesliga-3':           'German 3. Liga',
  'bundesliga-5':           'German Bundesliga 5',
  'ligue-1':                'French Ligue 1',
  'ligue-2':                'French Ligue 2',
  'coupe-de-france':        'Coupe de France',
  'ligue-coupe':            'French Ligue Coupe',
  'championnat-national':   'French Championnat National',
  'serie-a':                'Italian Serie A',
  'coppa-italia':           'Coppa Italia',
  'serie-b':                'Italian Serie B',
  'serie-c':                'Italian Serie C',
  'serie-c2':               'Italian Serie C2',
  'portuguese-liga-nos':    'Portuguese Liga NOS',
  ...NEW_LEAGUE_NAMES,
};

// ── Helper: darken a hex color ─────────────────────────────────────────────────
function darkenHex(hex) {
  const h = hex.replace('#', '');
  const r = Math.max(0, parseInt(h.slice(0,2), 16) - 15);
  const g = Math.max(0, parseInt(h.slice(2,4), 16) - 15);
  const b = Math.max(0, parseInt(h.slice(4,6), 16) - 15);
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

// ── JS string escape ──────────────────────────────────────────────────────────
function esc(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

// ── Main ──────────────────────────────────────────────────────────────────────
const rows = readCSV(CSV_PATH);
console.log(`Parsed ${rows.length} CSV rows`);

// ── Step 1: Build TicketEvent entries from CSV ────────────────────────────────
let idCounter = 100;
const slugSet = new Set();
const leagueCounts = {}; // slug → count
const leagueNameBySlug = {}; // slug → human name

const csvEvents = rows.reduce((acc, row) => {
  const csvLeagueRaw = extractLeagueSlugFromUrl(row.merchant_deep_link);

  // Skip stadium tour rows (slug starts with 'buy-')
  if (csvLeagueRaw.startsWith('buy-')) {
    return acc;
  }

  const leagueSlug   = mapLeagueSlug(csvLeagueRaw);
  const leagueName   = LEAGUE_HUMAN_NAMES[leagueSlug] || leagueSlug;
  leagueNameBySlug[leagueSlug] = leagueName;

  leagueCounts[leagueSlug] = (leagueCounts[leagueSlug] || 0) + 1;

  const { date, time, venue } = parseDescription(row.description);
  const price    = parseFloat(row.search_price) || 0;
  const currency = row.currency || 'USD';

  // Build slug
  let baseSlug = slugify(row.product_name) + (date ? '-' + date : '');
  let slug = baseSlug;
  if (slugSet.has(slug)) {
    slug = baseSlug + '-' + row.aw_product_id;
  }
  slugSet.add(slug);

  // imageUrl — skip if contains 'noimage'
  const imageUrl = (row.merchant_image_url && !row.merchant_image_url.includes('noimage'))
    ? row.merchant_image_url
    : '';

  // awImageUrl — skip if noimage.gif
  const awImageUrl = (row.aw_image_url && !row.aw_image_url.includes('noimage.gif'))
    ? row.aw_image_url
    : '';

  // Description
  const desc = `${row.product_name} takes place at ${venue} on ${date} as part of the ${leagueName}. Tickets available from ${currency}${price}.`;

  const id = String(idCounter++);

  acc.push({
    id,
    slug,
    sport: 'football',
    leagueSlug,
    eventName: row.product_name,
    league: leagueName,
    date,
    time,
    venue,
    city: venue, // fallback
    availability: 'high',
    minPrice: price,
    currency,
    imageUrl,
    description: desc,
    partner: {
      partnerName:  row.merchant_name,
      price,
      awDeepLink:   row.aw_deep_link,
      awProductId:  row.aw_product_id,
      awImageUrl,
      dataFeedId:   row.data_feed_id,
    },
  });
  return acc;
}, []);

console.log(`Generated ${csvEvents.length} ticket events`);
console.log('League counts:', leagueCounts);

// ── Step 2: Identify new leagues ──────────────────────────────────────────────
const newLeagueSlugs = Object.keys(leagueCounts).filter(s => !EXISTING_LEAGUE_SLUGS.has(s));
console.log('New league slugs:', newLeagueSlugs);

// ── Step 3: Read original IDs 1–25 from git history ───────────────────────────
// We preserved them as a string constant below (extracted from git show 0e331e2:...)
// Actually, we read the CURRENT tickets.ts file and extract IDs 1-25 from git show.
// Since this script runs in the repo, we shell out to git.
const { execSync } = require('child_process');
let originalContent;
try {
  originalContent = execSync('git show 0e331e2:src/lib/data/tickets.ts', {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
} catch (e) {
  console.error('Could not retrieve original tickets.ts from git:', e.message);
  process.exit(1);
}

// Extract the TICKET_EVENTS array body (everything between the first `[` and the matching `]`)
// We need IDs 1-25 only. Strategy: extract the entire array as text, then strip IDs 26-27.
// The original file has only IDs 1-25 in commit 0e331e2.
// We'll extract the array body as a raw text block for embedding.

// Find the array body
const arrayStart = originalContent.indexOf('export const TICKET_EVENTS: TicketEvent[] = [');
const arrayEnd   = originalContent.lastIndexOf('\n];');

if (arrayStart === -1 || arrayEnd === -1) {
  console.error('Could not locate TICKET_EVENTS array in original file');
  process.exit(1);
}

// Get just the content INSIDE the array brackets, with the final entries including trailing commas
const arrayBody = originalContent.slice(
  arrayStart + 'export const TICKET_EVENTS: TicketEvent[] = ['.length,
  arrayEnd
);

// Get footer (export functions) from original file
const footerStart = originalContent.indexOf('\nexport const getEventsBySport');
const footer = footerStart !== -1
  ? originalContent.slice(footerStart)
  : `
export const getEventsBySport = (sport: string): TicketEvent[] =>
  TICKET_EVENTS.filter((e) => e.sport === sport);

export const getEventsByLeague = (leagueSlug: string): TicketEvent[] =>
  TICKET_EVENTS.filter((e) => e.leagueSlug === leagueSlug);

export const getFeaturedEvents = (): TicketEvent[] =>
  TICKET_EVENTS.filter((e) => e.featured);

export const getEventById = (id: string): TicketEvent | undefined =>
  TICKET_EVENTS.find((e) => e.id === id);

export function toTicketSlug(event: TicketEvent): string {
  return event.slug;
}

export const getEventBySlug = (slug: string): TicketEvent | undefined =>
  TICKET_EVENTS.find((e) => e.slug === slug);

export const getRelatedEvents = (event: TicketEvent, limit = 3): TicketEvent[] =>
  TICKET_EVENTS
    .filter((e) => e.id !== event.id && (
      (event.leagueSlug && e.leagueSlug === event.leagueSlug) ||
      e.sport === event.sport
    ))
    .sort((a, b) => {
      // Same league first, then by date
      const aLeague = event.leagueSlug && a.leagueSlug === event.leagueSlug ? 0 : 1;
      const bLeague = event.leagueSlug && b.leagueSlug === event.leagueSlug ? 0 : 1;
      return aLeague - bLeague || new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, limit);
`;

// ── Step 4: Render new CSV events as TS ──────────────────────────────────────
function renderEvent(e) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    id: '${esc(e.id)}',`);
  lines.push(`    slug: '${esc(e.slug)}',`);
  lines.push(`    sport: 'football',`);
  lines.push(`    leagueSlug: '${esc(e.leagueSlug)}',`);
  lines.push(`    eventName: '${esc(e.eventName)}',`);
  lines.push(`    league: '${esc(e.league)}',`);
  lines.push(`    date: '${esc(e.date)}',`);
  lines.push(`    time: '${esc(e.time)}',`);
  lines.push(`    venue: '${esc(e.venue)}',`);
  lines.push(`    city: '${esc(e.city)}',`);
  lines.push(`    availability: 'high',`);
  lines.push(`    minPrice: ${e.minPrice},`);
  lines.push(`    currency: '${esc(e.currency)}',`);
  if (e.imageUrl) {
    lines.push(`    imageUrl: '${esc(e.imageUrl)}',`);
  }
  lines.push(`    description: '${esc(e.description)}',`);
  lines.push(`    partners: [`);
  lines.push(`      {`);
  lines.push(`        partnerId: 'footballticketnet',`);
  lines.push(`        partnerName: '${esc(e.partner.partnerName)}',`);
  lines.push(`        partnerIcon: '⚽',`);
  lines.push(`        price: ${e.partner.price},`);
  lines.push(`        tag: 'Best Price',`);
  lines.push(`        awDeepLink: '${esc(e.partner.awDeepLink)}',`);
  lines.push(`        awProductId: '${esc(e.partner.awProductId)}',`);
  if (e.partner.awImageUrl) {
    lines.push(`        awImageUrl: '${esc(e.partner.awImageUrl)}',`);
  }
  lines.push(`        dataFeedId: '${esc(e.partner.dataFeedId)}',`);
  lines.push(`      },`);
  lines.push(`    ],`);
  lines.push(`  },`);
  return lines.join('\n');
}

// Group by league for comments
const byLeague = {};
csvEvents.forEach(e => {
  if (!byLeague[e.leagueSlug]) byLeague[e.leagueSlug] = [];
  byLeague[e.leagueSlug].push(e);
});

let csvSection = '';
for (const [slug, events] of Object.entries(byLeague)) {
  const name = leagueNameBySlug[slug] || slug;
  csvSection += `\n  // ── ${name} ${'─'.repeat(Math.max(0, 60 - name.length))}\n`;
  csvSection += events.map(renderEvent).join('\n') + '\n';
}

// ── Step 5: Compose tickets.ts ────────────────────────────────────────────────
const ticketsHeader = `import type { TicketEvent } from '@/lib/types';

// ── Shared image URLs by sport ──────────────────────────────────────────────
const IMG = {
  football:    'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1200&h=500&fit=crop&q=80',
  tennis:      'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=1200&h=500&fit=crop&q=80',
  horseRacing: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=500&fit=crop&q=80',
  cricket:     'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&h=500&fit=crop&q=80',
  boxing:      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&h=500&fit=crop&q=80',
  f1:          'https://images.unsplash.com/photo-1541889413457-4aec9b418977?w=1200&h=500&fit=crop&q=80',
  rugby:       'https://images.unsplash.com/photo-1540592793827-8f72c8fd7ce4?w=1200&h=500&fit=crop&q=80',
  golf:        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=500&fit=crop&q=80',
};

export const TICKET_EVENTS: TicketEvent[] = [
  // ── Manually-written events (IDs 1–25) — DO NOT MODIFY ─────────────────`;

// arrayBody already starts with a newline after the opening [
const ticketsContent = ticketsHeader
  + arrayBody
  + '\n  // ── CSV-imported events (IDs 100+) ─────────────────────────────────────'
  + csvSection
  + '\n];\n'
  + footer;

fs.writeFileSync(TICKETS_TS, ticketsContent, 'utf8');
console.log(`\nWrote tickets.ts (${csvEvents.length} CSV events + manual IDs 1-25)`);

// ── Step 6: Build new league entries ─────────────────────────────────────────
function renderLeague(slug, count) {
  const name    = NEW_LEAGUE_NAMES[slug] || slug;
  const meta    = NEW_LEAGUE_META[slug]  || { country: 'International', icon: '⚽', color: '#6b7280', bg: '#1c1c1c', location: 'International' };
  const darker  = darkenHex(meta.bg);
  const heroBg  = `linear-gradient(135deg, ${meta.bg} 0%, ${darker} 100%)`;
  const matches = `${count} match${count !== 1 ? 'es' : ''}`;
  const desc    = `${name} — live matches with tickets available.`;
  const longDesc= `${name} features competitive football matches from across the season. Find tickets for all fixtures and secure your seat through our trusted partner network.`;

  const lines = [];
  lines.push(`  {`);
  lines.push(`    slug: '${esc(slug)}',`);
  lines.push(`    name: '${esc(name)}',`);
  lines.push(`    sportSlug: 'football',`);
  lines.push(`    sportName: 'Football',`);
  lines.push(`    icon: '${meta.icon}',`);
  lines.push(`    color: '${meta.color}',`);
  lines.push(`    bg: '${meta.bg}',`);
  lines.push(`    heroBg: '${esc(heroBg)}',`);
  lines.push(`    imageUrl: FOOTBALL_IMG,`);
  lines.push(`    description: '${esc(desc)}',`);
  lines.push(`    longDescription: '${esc(longDesc)}',`);
  lines.push(`    count: ${count},`);
  lines.push(`    matchesLabel: '${matches}',`);
  lines.push(`    country: '${esc(meta.country)}',`);
  lines.push(`    location: '${esc(meta.location)}',`);
  lines.push(`    date: 'TBC',`);
  lines.push(`    month: 'TBC',`);
  lines.push(`    day: '1',`);
  lines.push(`    dayLabel: 'TBC',`);
  lines.push(`  },`);
  return lines.join('\n');
}

// ── Step 7: Compose leagues.ts ────────────────────────────────────────────────
// Always read the ORIGINAL leagues.ts from git to prevent duplicate entries on re-runs
let existingLeaguesContent;
try {
  existingLeaguesContent = execSync('git show HEAD:src/lib/data/leagues.ts', {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
} catch (e) {
  // Fallback: read from disk
  existingLeaguesContent = fs.readFileSync(LEAGUES_TS, 'utf8');
}

// Find the closing `];` of the LEAGUES array
const closingIdx = existingLeaguesContent.lastIndexOf('\n];');
if (closingIdx === -1) {
  console.error('Could not find closing ]; in leagues.ts');
  process.exit(1);
}

// Determine which new slugs actually appear in the CSV (subset of newLeagueSlugs that have data)
const slugsToAdd = newLeagueSlugs.filter(s => NEW_LEAGUE_NAMES[s] !== undefined || true);

let newLeagueBlock = '\n\n  // ── CSV-imported leagues ──────────────────────────────────────────────────\n';
for (const slug of slugsToAdd) {
  const count = leagueCounts[slug] || 0;
  newLeagueBlock += renderLeague(slug, count) + '\n';
}

const newLeaguesContent =
  existingLeaguesContent.slice(0, closingIdx)
  + newLeagueBlock
  + '\n];\n'
  + existingLeaguesContent.slice(closingIdx + '\n];'.length);

fs.writeFileSync(LEAGUES_TS, newLeaguesContent, 'utf8');
console.log(`Wrote leagues.ts (${slugsToAdd.length} new league entries)`);

console.log('\nDone! Now run: npx tsc --noEmit');
