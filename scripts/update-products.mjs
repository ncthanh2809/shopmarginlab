/**
 * 1-Click Digital Product Checkout URL Updater for ShopMarginLab (Gumroad / Payhip / etc.)
 * Usage:
 *   node scripts/update-products.mjs --free "https://..." --flagship "https://..." --pod "https://..."
 *
 * Updates src/site-config.mjs cleanly, rebuilds static pages & edge worker bundle, and runs npm test.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const cfgPath = join(ROOT, 'src', 'site-config.mjs');

const args = process.argv.slice(2);
const updates = {};
for (let i = 0; i < args.length; i += 2) {
  const flag = args[i];
  const val = args[i + 1];
  if (!val || !/^https?:\/\//i.test(val)) {
    console.error(`Invalid or missing URL for ${flag}`);
    process.exit(1);
  }
  if (flag === '--free') updates.freeCheatSheet = val;
  else if (flag === '--flagship') updates.flagshipOs = val;
  else if (flag === '--pod') updates.podMatrix = val;
  else {
    console.error(`Unknown flag: ${flag}. Use --free, --flagship, or --pod.`);
    process.exit(1);
  }
}

if (Object.keys(updates).length === 0) {
  console.log('Usage: node scripts/update-products.mjs --free <URL> [--flagship <URL>] [--pod <URL>]');
  process.exit(0);
}

let src = readFileSync(cfgPath, 'utf8');
for (const [key, newUrl] of Object.entries(updates)) {
  const rx = new RegExp(`(${key}:\\s*\\{[\\s\\S]*?checkoutUrl:\\s*')([^']+)(')`);
  if (!rx.test(src)) {
    console.error(`Could not locate checkoutUrl field for product "${key}" in src/site-config.mjs`);
    process.exit(1);
  }
  src = src.replace(rx, `$1${newUrl}$3`);
  console.log(`✅ Updated ${key} checkoutUrl -> ${newUrl}`);
}

writeFileSync(cfgPath, src, 'utf8');
console.log('🔨 Rebuilding site + edge worker bundle + running tests...');
execSync('npm run build:site && node scripts/pack-edge-bundle.mjs && npm test', { cwd: ROOT, stdio: 'inherit' });
console.log('🚀 Ready to deploy updated checkout links to Cloudflare Pages!');
