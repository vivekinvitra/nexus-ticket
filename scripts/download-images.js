/**
 * download-images.js
 * Downloads all imageUrl / awImageUrl / authorAvatar images from
 * src/lib/data/{leagues,news,tickets}.ts into public/images/
 * then rewrites those URLs in the data files.
 *
 * Usage:  node scripts/download-images.js
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const crypto = require('crypto');

// ── Config ────────────────────────────────────────────────────────────────────
const ROOT        = path.join(__dirname, '..');
const IMG_DIR     = path.join(ROOT, 'public', 'images');
const DATA_DIR    = path.join(ROOT, 'src', 'lib', 'data');
const DATA_FILES  = ['leagues.ts', 'news.ts', 'tickets.ts'].map(f => path.join(DATA_DIR, f));
const CONCURRENCY = 10;   // parallel downloads at a time

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract all unique http image URLs from a TS source string */
function extractUrls(content) {
  const urls = new Set();
  // Match any of these field names followed by a quoted URL
  const re = /(?:imageUrl|awImageUrl|authorAvatar)\s*:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const u = m[1].trim();
    if (u.startsWith('http')) urls.add(u);
  }
  return urls;
}

/** Derive a stable local filename from a URL */
function urlToFilename(rawUrl) {
  // Detect extension from the pathname portion only
  let ext = '.jpg';
  try {
    const parsed = new URL(rawUrl);
    const pathname = parsed.pathname;
    const extMatch = pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i);
    if (extMatch) {
      ext = extMatch[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      ext = '.' + ext;
    }
  } catch (_) { /* ignore */ }

  const hash = crypto.createHash('md5').update(rawUrl).digest('hex').slice(0, 16);
  return `${hash}${ext}`;
}

/** Download url → dest, following up to 5 redirects */
function downloadFile(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    if (fs.existsSync(dest)) return resolve({ dest, skipped: true });

    const client = url.startsWith('https') ? https : http;
    const tmp = dest + '.tmp';
    const file = fs.createWriteStream(tmp);

    const req = client.get(url, { timeout: 20_000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        file.close();
        try { fs.unlinkSync(tmp); } catch (_) {}
        return downloadFile(res.headers.location, dest, redirects + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(tmp); } catch (_) {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        fs.renameSync(tmp, dest);
        resolve({ dest, skipped: false });
      });
    });

    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', (err) => {
      try { fs.unlinkSync(tmp); } catch (_) {}
      reject(err);
    });
  });
}

/** Run tasks with limited concurrency */
async function pool(tasks, limit) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Ensure output directory exists
  fs.mkdirSync(IMG_DIR, { recursive: true });

  // ── Step 1: Collect all unique URLs ──────────────────────────────────────
  console.log('\n📂  Scanning data files for image URLs…');
  const allUrls = new Set();

  for (const file of DATA_FILES) {
    const content = fs.readFileSync(file, 'utf-8');
    const found = extractUrls(content);
    console.log(`   ${path.basename(file)}: ${found.size} URLs`);
    for (const u of found) allUrls.add(u);
  }
  console.log(`\n   Total unique URLs: ${allUrls.size}`);

  // ── Step 2: Download ──────────────────────────────────────────────────────
  console.log(`\n⬇️   Downloading with concurrency=${CONCURRENCY}…`);

  const urlMap = {}; // url → /images/filename
  let downloaded = 0, skipped = 0, failed = 0;

  const urls = [...allUrls];
  const tasks = urls.map((url) => async () => {
    const filename = urlToFilename(url);
    const dest = path.join(IMG_DIR, filename);
    try {
      const result = await downloadFile(url, dest);
      urlMap[url] = `/images/${filename}`;
      if (result.skipped) skipped++; else downloaded++;
    } catch (err) {
      failed++;
      console.warn(`   ✗ FAILED [${url.slice(0, 70)}…] — ${err.message}`);
    }
    const done = downloaded + skipped + failed;
    if (done % 100 === 0) {
      process.stdout.write(`   Progress: ${done}/${urls.length}\r`);
    }
  });

  await pool(tasks, CONCURRENCY);

  console.log(`\n   ✅ Downloaded: ${downloaded}  |  ⏭  Skipped (cached): ${skipped}  |  ❌ Failed: ${failed}`);

  // ── Step 3: Save URL map ──────────────────────────────────────────────────
  const mapPath = path.join(IMG_DIR, 'url-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
  console.log(`\n💾  URL map saved → public/images/url-map.json`);

  // ── Step 4: Rewrite data files ────────────────────────────────────────────
  console.log('\n✏️   Rewriting data files…');

  for (const file of DATA_FILES) {
    let content = fs.readFileSync(file, 'utf-8');
    let replacements = 0;

    for (const [url, local] of Object.entries(urlMap)) {
      // Escape special regex chars in the URL
      const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const before = content;
      content = content.replace(new RegExp(escaped, 'g'), local);
      if (content !== before) replacements++;
    }

    fs.writeFileSync(file, content, 'utf-8');
    console.log(`   ${path.basename(file)}: ${replacements} URL(s) replaced`);
  }

  console.log('\n✨  Done! All images are in public/images/\n');
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
