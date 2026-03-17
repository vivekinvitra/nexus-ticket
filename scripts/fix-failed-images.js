/**
 * fix-failed-images.js
 * Fixes the small set of image URLs that failed in download-images.js:
 *  1. productserve.com awImageUrls whose underlying source (.gif venue images)
 *     are already downloaded — reuses the local path of the source image.
 *  2. Any remaining external imageUrl / awImageUrl / authorAvatar that still
 *     points to http(s) tries a direct fallback download.
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');
const crypto = require('crypto');

const ROOT       = path.join(__dirname, '..');
const IMG_DIR    = path.join(ROOT, 'public', 'images');
const DATA_DIR   = path.join(ROOT, 'src', 'lib', 'data');
const MAP_PATH   = path.join(IMG_DIR, 'url-map.json');
const DATA_FILES = ['leagues.ts', 'news.ts', 'tickets.ts'].map(f => path.join(DATA_DIR, f));

const urlMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf-8'));

function urlToFilename(rawUrl) {
  let ext = '.jpg';
  try {
    const pathname = new URL(rawUrl).pathname;
    const m = pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);
    if (m) ext = '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  } catch (_) {}
  return crypto.createHash('md5').update(rawUrl).digest('hex').slice(0, 16) + ext;
}

function downloadFile(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    if (fs.existsSync(dest)) return resolve(dest);

    const client = url.startsWith('https') ? https : require('http');
    const tmp = dest + '.tmp';
    const file = fs.createWriteStream(tmp);

    const req = client.get(url, { timeout: 20_000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 307].includes(res.statusCode)) {
        file.close();
        try { fs.unlinkSync(tmp); } catch (_) {}
        const loc = res.headers.location;
        const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
        return downloadFile(next, dest, redirects + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(tmp); } catch (_) {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); fs.renameSync(tmp, dest); resolve(dest); });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', (err) => { try { fs.unlinkSync(tmp); } catch (_) {} reject(err); });
  });
}

async function main() {
  let fixed = 0;
  const newMappings = {};

  for (const file of DATA_FILES) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Find any remaining external image URLs
    const re = /(?:imageUrl|awImageUrl|authorAvatar)\s*:\s*'(https?:\/\/[^']+)'/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const url = m[1];

      // Already mapped from a previous fix attempt this run
      if (newMappings[url]) {
        content = content.split(url).join(newMappings[url]);
        changed = true;
        continue;
      }

      // ── Strategy 1: productserve.com — reuse the source venue image ──
      if (url.includes('productserve.com')) {
        try {
          const parsed  = new URL(url);
          const srcEncoded = parsed.searchParams.get('url') || '';
          // srcEncoded is like "ssl%3Awww.footballticketnet.com%2F..."
          const src = 'https://' + decodeURIComponent(srcEncoded).replace(/^ssl:/i, '');
          const localPath = urlMap[src];
          if (localPath) {
            console.log(`  ✔ reuse  ${url.slice(0, 60)}…  →  ${localPath}`);
            newMappings[url] = localPath;
            content = content.split(url).join(localPath);
            changed = true;
            fixed++;
            continue;
          }
        } catch (e) { /* fall through to direct download */ }
      }

      // ── Strategy 2: direct download ──────────────────────────────────
      const filename = urlToFilename(url);
      const dest     = path.join(IMG_DIR, filename);
      try {
        await downloadFile(url, dest);
        const localPath = `/images/${filename}`;
        urlMap[url] = localPath;
        newMappings[url] = localPath;
        content = content.split(url).join(localPath);
        changed = true;
        fixed++;
        console.log(`  ✔ downloaded  ${url.slice(0, 70)}`);
      } catch (err) {
        console.warn(`  ✗ still failing  ${url.slice(0, 70)}  —  ${err.message}`);
      }
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`  Updated ${path.basename(file)}`);
    }
  }

  // Persist expanded URL map
  fs.writeFileSync(MAP_PATH, JSON.stringify(urlMap, null, 2));
  console.log(`\n✨  Fixed ${fixed} URL(s). Updated url-map.json.\n`);
}

main().catch(console.error);
