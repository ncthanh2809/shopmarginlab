/**
 * 1-Click Affiliate URL Updater for ShopMarginLab
 * Usage:
 *   node scripts/update-affiliates.mjs --shopify "https://shopify.pxf.io/YOUR_ID" --printify "https://try.printify.com/YOUR_ID" --linkmybooks "https://linkmybooks.com/?via=YOUR_ID"
 *
 * Updates src/site-config.mjs cleanly, rebuilds all 31+ pages & edge worker bundle, and runs npm test.
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
  if (flag === '--shopify') updates.shopify = val;
  else if (flag === '--printify') updates.printify = val;
  else if (flag === '--linkmybooks') updates.linkMyBooks = val;
  else {
    console.error(`Unknown flag: ${flag}. Use --shopify, --printify, or --linkmybooks.`);
    process.exit(1);
  }
}

if (Object.keys(updates).length === 0) {
  console.log('Usage: node scripts/update-affiliates.mjs --shopify <URL> [--printify <URL>] [--linkmybooks <URL>]');
  process.exit(0);
}

let src = readFileSync(cfgPath, 'utf8');
for (const [key, newUrl] of Object.entries(updates)) {
  const rx = new RegExp(`(${key}:\\s*\\{[\\s\\S]*?url:\\s*')([^']+)(')`);
  if (!rx.test(src)) {
    console.error(`Could not locate url field for affiliate "${key}" in src/site-config.mjs`);
    process.exit(1);
  }
  src = src.replace(rx, `$1${newUrl}$3`);
  console.log(`✅ Updated ${key} affiliate URL -> ${newUrl}`);
}

writeFileSync(cfgPath, src, 'utf8');
console.log('🔨 Rebuilding site + verifying tests...');
execSync('npm run build:site && node scripts/pack-edge-bundle.mjs && npm test', { cwd: ROOT, stdio: 'inherit' });
console.log('🚀 Ready to deploy updated affiliate links to Cloudflare Pages!');
