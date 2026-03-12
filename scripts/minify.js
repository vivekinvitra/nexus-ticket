#!/usr/bin/env node
/**
 * minify.js
 * Post-build CSS/JS minification helper for Ticket-nexus
 * Run: node scripts/minify.js
 * (Next.js already minifies in production build — this adds extra passes)
 */

const fs = require('fs');
const path = require('path');

const NEXT_DIR = path.join(__dirname, '..', '.next', 'static');

async function minifyJs(content) {
  try {
    const { minify } = require('terser');
    const result = await minify(content, {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
      mangle: true,
      format: { comments: false },
    });
    return result.code || content;
  } catch {
    return content;
  }
}

async function minifyCss(content) {
  try {
    const postcss = require('postcss');
    const cssnano = require('cssnano');
    const result = await postcss([cssnano({ preset: 'default' })]).process(content, {
      from: undefined,
    });
    return result.css;
  } catch {
    return content;
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Skipping ${dir} (not found — run npm run build first)`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      let processed = false;
      const content = fs.readFileSync(fullPath, 'utf8');

      if (entry.name.endsWith('.js') && !entry.name.endsWith('.min.js')) {
        const minified = await minifyJs(content);
        fs.writeFileSync(fullPath, minified);
        processed = true;
      } else if (entry.name.endsWith('.css') && !entry.name.endsWith('.min.css')) {
        const minified = await minifyCss(content);
        fs.writeFileSync(fullPath, minified);
        processed = true;
      }

      if (processed) {
        console.log(`✅ Minified: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

(async () => {
  console.log('Starting minification...\n');
  await processDirectory(NEXT_DIR);
  console.log('\nMinification complete!');
})();
