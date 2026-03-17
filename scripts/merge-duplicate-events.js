/**
 * merge-duplicate-events.js
 *
 * Problem: tickets.ts has events imported from two data feeds:
 *   - Feed 113394: clean slugs  e.g. "qatar-vs-switzerland-2026-06-13"
 *   - Feed 114098: same events but slug has product-ID appended
 *                  e.g. "qatar-vs-switzerland-2026-06-13-44179442757"
 *
 * Fix: for every duplicate entry,
 *   1. extract its partner block
 *   2. append it to the matching clean entry's partners array
 *   3. remove the duplicate entry from the file
 *
 * Usage: node scripts/merge-duplicate-events.js
 */

const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../src/lib/data/tickets.ts');
let src = fs.readFileSync(FILE, 'utf-8');

// ── helpers ────────────────────────────────────────────────────────────────

/** Pull the slug value out of an event text block */
function extractSlug(block) {
  const m = block.match(/slug:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

/** Return true if slug looks like a feed-114098 duplicate */
function isDuplicate(slug) {
  // ends with  -44<10-or-more digits>
  return /.*-44\d{9,}$/.test(slug);
}

/** Strip the product-ID suffix to get the base/clean slug */
function baseSlug(slug) {
  return slug.replace(/-44\d{9,}$/, '');
}

/**
 * Split the file's TICKET_EVENTS array into individual event object strings.
 * Each element is the raw text of one `{ … },` block.
 */
function splitEvents(src) {
  // Find the start of the array
  const arrStart = src.indexOf('export const TICKET_EVENTS');
  const bracketOpen = src.indexOf('[', arrStart);

  const header  = src.slice(0, bracketOpen + 1);    // everything up to and including '['
  const arrTail = src.slice(bracketOpen + 1);        // the rest, starting after '['

  // Walk character by character tracking brace depth to split event objects
  const events = [];
  let depth = 0;
  let blockStart = -1;

  for (let i = 0; i < arrTail.length; i++) {
    const ch = arrTail[i];
    if (ch === '{') {
      if (depth === 0) blockStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && blockStart !== -1) {
        // include the closing comma+newline if present
        let end = i + 1;
        // skip optional whitespace and comma
        while (end < arrTail.length && (arrTail[end] === ',' || arrTail[end] === '\r')) end++;
        if (arrTail[end] === '\n') end++;
        events.push({ text: arrTail.slice(blockStart, end), start: blockStart });
        blockStart = -1;
      }
    }
  }

  // Find everything after the last event (closing bracket + exports)
  const lastEvent = events[events.length - 1];
  const footer = arrTail.slice(lastEvent.start + lastEvent.text.length);

  return { header, events: events.map(e => e.text), footer };
}

/**
 * Extract the raw text inside `partners: [ … ]` from an event block.
 * Returns the individual partner-object strings.
 */
function extractPartners(block) {
  const pStart = block.indexOf('partners: [');
  if (pStart === -1) return [];

  let depth = 0;
  let inArray = false;
  let arrayContentStart = -1;
  let arrayContentEnd = -1;

  for (let i = pStart + 'partners: '.length; i < block.length; i++) {
    const ch = block[i];
    if (ch === '[' && !inArray) { inArray = true; depth = 1; arrayContentStart = i + 1; continue; }
    if (!inArray) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { arrayContentEnd = i + 1; break; }
    }
  }

  if (arrayContentStart === -1 || arrayContentEnd === -1) return [];
  return [block.slice(arrayContentStart, arrayContentEnd).trim()];
}

/**
 * Append partner text to the clean event block's partners array.
 */
function appendPartner(cleanBlock, partnerContent) {
  // Find the closing `    ],` of the partners array
  const closeIdx = cleanBlock.lastIndexOf('    ],');
  if (closeIdx === -1) return cleanBlock;

  const before = cleanBlock.slice(0, closeIdx);
  const after  = cleanBlock.slice(closeIdx);

  // Make sure existing last partner ends with a comma
  const trimmed = before.trimEnd();
  const separator = trimmed.endsWith(',') ? '\n' : ',\n';

  return trimmed + separator + '      ' + partnerContent + ',\n' + '    ' + after.trimStart();
}

// ── main ───────────────────────────────────────────────────────────────────

console.log('Parsing events…');
const { header, events, footer } = splitEvents(src);
console.log(`  Total event blocks: ${events.length}`);

// Build a map: cleanSlug → index in events[]
const cleanIndex = new Map(); // slug → array index
for (let i = 0; i < events.length; i++) {
  const slug = extractSlug(events[i]);
  if (slug && !isDuplicate(slug)) {
    cleanIndex.set(slug, i);
  }
}

let merged = 0;
let removed = 0;
const toRemove = new Set();

for (let i = 0; i < events.length; i++) {
  const slug = extractSlug(events[i]);
  if (!slug || !isDuplicate(slug)) continue;

  const base = baseSlug(slug);
  const cleanIdx = cleanIndex.get(base);

  if (cleanIdx !== undefined) {
    // Merge partners
    const [partnerContent] = extractPartners(events[i]);
    if (partnerContent) {
      events[cleanIdx] = appendPartner(events[cleanIdx], partnerContent);
      merged++;
    }
  }

  toRemove.add(i);
  removed++;
}

console.log(`  Merged: ${merged} partners into clean entries`);
console.log(`  Removing: ${removed} duplicate blocks`);

// Rebuild the file
const kept = events.filter((_, i) => !toRemove.has(i));
const newSrc = header + '\n' + kept.join('\n') + footer;

fs.writeFileSync(FILE, newSrc, 'utf-8');
console.log('\n✅  Done. tickets.ts updated.\n');
