import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../src/calculators-data.mjs';
import { createPreviewServer } from '../scripts/preview-server.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PROD_DIST = join(ROOT, 'products', 'dist');

console.log('🧪 Running ShopMarginLab End-to-End Verification...');

// 1. Verify all 6 SEO calculator pages + JSON-LD + FTC Affiliate Disclosure
for (const calc of CALCULATORS) {
  const pageFile = join(DIST, calc.slug, 'index.html');
  assert.ok(existsSync(pageFile), `Missing built calculator page: ${calc.slug}`);
  const html = readFileSync(pageFile, 'utf8');
  assert.ok(html.includes('application/ld+json'), `Missing JSON-LD schema on ${calc.slug}`);
  assert.ok(html.includes('FAQPage'), `Missing FAQPage schema on ${calc.slug}`);
  assert.ok(html.includes('rel="sponsored noopener"'), `Missing compliant affiliate rel attribute on ${calc.slug}`);
  assert.ok(html.includes('closedby="any"'), `Missing native light-dismiss preview modal on ${calc.slug}`);
}

// 2. Verify Sitemap & Legal FTC Disclosure
assert.ok(existsSync(join(DIST, 'sitemap.xml')));
const legalHtml = readFileSync(join(DIST, 'legal', 'index.html'), 'utf8');
assert.ok(legalHtml.includes('FTC Affiliate Disclosure'));

// 3. Verify both OpenXML .xlsx digital products have valid PK ZIP signatures & live formulas inside
for (const xlsxName of [
  'Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx',
  'POD-Etsy-Launch-Pricing-Matrix-2026.xlsx'
]) {
  const fpath = join(PROD_DIST, xlsxName);
  assert.ok(existsSync(fpath), `Missing Excel workbook: ${xlsxName}`);
  const buf = readFileSync(fpath);
  assert.ok(statSync(fpath).size > 2000, `${xlsxName} size looks too small`);
  assert.equal(buf.readUInt32LE(0), 0x04034b50, `${xlsxName} must start with valid ZIP PK\\x03\\x04 signature`);

  // Walk ZIP entries and decompress sheet1.xml to confirm live <f> Excel formulas exist!
  let pos = 0;
  let foundSheet1Formula = false;
  while (pos + 30 < buf.length && buf.readUInt32LE(pos) === 0x04034b50) {
    const compSize = buf.readUInt32LE(pos + 18);
    const nameLen = buf.readUInt16LE(pos + 26);
    const extraLen = buf.readUInt16LE(pos + 28);
    const entryName = buf.subarray(pos + 30, pos + 30 + nameLen).toString('utf8');
    const dataStart = pos + 30 + nameLen + extraLen;
    if (entryName === 'xl/worksheets/sheet1.xml') {
      const xml = inflateRawSync(buf.subarray(dataStart, dataStart + compSize)).toString('utf8');
      assert.ok(xml.includes('<f>'), `${xlsxName} sheet1.xml must contain live Excel <f> formulas`);
      foundSheet1Formula = true;
    }
    pos = dataStart + compSize;
  }
  assert.ok(foundSheet1Formula, `Verified live Excel formulas inside ${xlsxName}`);
}

// 4. Verify 6 Pinterest 1000x1500 Pin SVGs & Schedule
for (const calc of CALCULATORS) {
  assert.ok(existsSync(join(PROD_DIST, 'pins', `pin-${calc.slug}.svg`)));
}
assert.ok(existsSync(join(PROD_DIST, 'pinterest-seo-descriptions.md')));

// 5. Verify HTTP Preview Server responds 200 OK
const srv = createPreviewServer();
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const { port } = srv.address();
try {
  const r1 = await fetch(`http://127.0.0.1:${port}/etsy-fee-calculator/`);
  assert.equal(r1.status, 200);
  const r2 = await fetch(`http://127.0.0.1:${port}/templates/`);
  assert.equal(r2.status, 200);
} finally {
  await new Promise((r) => srv.close(r));
}

console.log('✅ All 5 verification suites (6 SEO Calculators, JSON-LD, 2 Live-Formula .XLSX Workbooks, 6 Pinterest Pins, Preview Server) passed!');
