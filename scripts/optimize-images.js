#!/usr/bin/env node
/**
 * optimize-images.js
 * Converts images to WebP/AVIF and generates responsive srcset versions
 * Run: node scripts/optimize-images.js
 * Requires: npm install sharp
 */

const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '..', 'public', 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'optimized');
const BREAKPOINTS = [640, 1024, 1280, 1920];

async function optimizeImage(filePath) {
  try {
    const sharp = require('sharp');
    const filename = path.basename(filePath, path.extname(filePath));

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const width of BREAKPOINTS) {
      // WebP
      await sharp(filePath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(OUTPUT_DIR, `${filename}-${width}.webp`));

      // AVIF
      await sharp(filePath)
        .resize(width, null, { withoutEnlargement: true })
        .avif({ quality: 70 })
        .toFile(path.join(OUTPUT_DIR, `${filename}-${width}.avif`));
    }

    // Blur placeholder (20px wide)
    const blurBuffer = await sharp(filePath).resize(20).blur(10).webp({ quality: 20 }).toBuffer();
    const blurBase64 = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    console.log(`✅ Optimized: ${filename}`);
    return { filename, blurBase64 };
  } catch (err) {
    console.warn(`⚠️ Skipped ${filePath}: ${err.message}`);
    return null;
  }
}

async function run() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.log(`No images directory found at ${INPUT_DIR}. Creating it...`);
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    console.log('Add your images to public/images/ and run this script again.');
    return;
  }

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => /\.(jpg|jpeg|png|gif)$/i.test(f))
    .map((f) => path.join(INPUT_DIR, f));

  if (files.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${files.length} image(s) to optimize...\n`);

  const results = await Promise.all(files.map(optimizeImage));
  const manifest = results.filter(Boolean);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  );

  console.log(`\n✅ Done. Optimized ${manifest.length} image(s).`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

run().catch(console.error);
