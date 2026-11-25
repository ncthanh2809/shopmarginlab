import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../src/calculators-data.mjs';
import { GUIDES } from '../src/guides-data.mjs';
import { createPreviewServer } from '../scripts/preview-server.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PROD_DIST = join(ROOT, 'products', 'dist');

console.log('🧪 Running ShopMarginLab v2 End-to-End Verification...');

assert.equal(CALCULATORS.length, 12, 'Expected 12 calculators');
assert.equal(GUIDES.length, 4, 'Expected 4 SEO guides');

// 1. Verify all 12 SEO calculator pages + JSON-LD + CRO features + live formula math execution
const fmtUsd = (n) => (n < 0 ? '-$' + Math.abs(n).toFixed(2) : '$' + Number(n).toFixed(2));
const pct = (part, whole) => (whole > 0 ? ((part / whole) * 100).toFixed(1) + '%' : '0.0%');

for (const calc of CALCULATORS) {
  const pageFile = join(DIST, calc.slug, 'index.html');
  assert.ok(existsSync(pageFile), `Missing built calculator page: ${calc.slug}`);
  const html = readFileSync(pageFile, 'utf8');
  assert.ok(html.includes('application/ld+json'), `Missing JSON-LD schema on ${calc.slug}`);
  assert.ok(html.includes('FAQPage'), `Missing FAQPage schema on ${calc.slug}`);
  assert.ok(html.includes('rel="sponsored noopener"'), `Missing compliant affiliate rel attribute on ${calc.slug}`);
  assert.ok(html.includes('closedby="any"'), `Missing native light-dismiss preview modal on ${calc.slug}`);
  assert.ok(html.includes('copyShareLinkBtn'), `Missing shareable link button on ${calc.slug}`);
  assert.ok(html.includes('copySummaryBtn'), `Missing copy summary button on ${calc.slug}`);
  assert.ok(html.includes('exportCsvBtn'), `Missing CSV export button on ${calc.slug}`);
  assert.ok(!/YOUR_[A-Z0-9_]+/.test(html), `Found unresolved YOUR_* placeholder on ${calc.slug}`);
  assert.ok(html.includes('https://payhip.com/b/MGRn9'), `Missing $0 Payhip lead magnet link on ${calc.slug}`);

  // Execute calculator computeFnBody with default inputs + every select option to verify zero NaN!
  const fn = new Function('v', 'fmtUsd', 'pct', calc.computeFnBody);
  const defaults = {};
  for (const inp of calc.inputs) {
    defaults[inp.id] = inp.type === 'select' && isNaN(Number(inp.value)) ? inp.value : Number(inp.value);
  }
  const out = fn(defaults, fmtUsd, pct);
  assert.ok(out && typeof out.primaryValue === 'string' && !out.primaryValue.includes('NaN'), `NaN in primaryValue for ${calc.slug}`);
  assert.ok(Array.isArray(out.rows) && out.rows.length >= 4, `Expected >=4 rows on ${calc.slug}`);
  for (const row of out.rows) {
    assert.ok(!row.join(' ').includes('NaN'), `NaN in breakdown row for ${calc.slug}: ${row.join(' | ')}`);
  }
  // Test alternate select options
  for (const inp of calc.inputs.filter((i) => i.type === 'select')) {
    for (const opt of inp.options) {
      const testV = { ...defaults, [inp.id]: isNaN(Number(opt.value)) ? opt.value : Number(opt.value) };
      const altOut = fn(testV, fmtUsd, pct);
      assert.ok(!altOut.primaryValue.includes('NaN'), `NaN on ${calc.slug} option ${inp.id}=${opt.value}`);
    }
  }
}

// 2. Verify all 4 SEO Guides + /guides/ index + Legal + Templates + Home + Sitemap
assert.ok(existsSync(join(DIST, 'guides', 'index.html')), 'Missing /guides/ index');
for (const g of GUIDES) {
  const gfile = join(DIST, 'guides', g.slug, 'index.html');
  assert.ok(existsSync(gfile), `Missing guide: ${g.slug}`);
  const ghtml = readFileSync(gfile, 'utf8');
  assert.ok(ghtml.includes('"@type":"Article"'), `Missing Article JSON-LD on guide ${g.slug}`);
  assert.ok(!/YOUR_[A-Z0-9_]+/.test(ghtml), `Found YOUR_* placeholder on guide ${g.slug}`);
}

const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
assert.ok(homeHtml.includes('https://payhip.com/b/MGRn9') && homeHtml.includes('https://payhip.com/b/rgL6o') && homeHtml.includes('https://payhip.com/b/u1UYJ'));
assert.ok(!/YOUR_[A-Z0-9_]+/.test(homeHtml), 'Found placeholder on home page');

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const urlCount = (sitemap.match(/<url>/g) || []).length;
assert.equal(urlCount, 20, `Expected 20 URLs in sitemap.xml, got ${urlCount}`);

const legalHtml = readFileSync(join(DIST, 'legal', 'index.html'), 'utf8');
assert.ok(legalHtml.includes('FTC Affiliate Disclosure'));

// 3. Verify all 3 OpenXML .xlsx digital products have valid PK ZIP signatures & live formulas inside
for (const xlsxName of [
  'FREE-2026-Seller-Fee-Tax-Cheat-Sheet.xlsx',
  'Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx',
  'POD-Etsy-Launch-Pricing-Matrix-2026.xlsx'
]) {
  const fpath = join(PROD_DIST, xlsxName);
  assert.ok(existsSync(fpath), `Missing Excel workbook: ${xlsxName}`);
  const buf = readFileSync(fpath);
  assert.ok(statSync(fpath).size > 2000, `${xlsxName} size looks too small`);
  assert.equal(buf.readUInt32LE(0), 0x04034b50, `${xlsxName} must start with valid ZIP PK\\x03\\x04 signature`);

  let pos = 0;
  let foundSheet1 = false;
  while (pos + 30 < buf.length && buf.readUInt32LE(pos) === 0x04034b50) {
    const compSize = buf.readUInt32LE(pos + 18);
    const nameLen = buf.readUInt16LE(pos + 26);
    const extraLen = buf.readUInt16LE(pos + 28);
    const entryName = buf.subarray(pos + 30, pos + 30 + nameLen).toString('utf8');
    const dataStart = pos + 30 + nameLen + extraLen;
    if (entryName === 'xl/worksheets/sheet1.xml') {
      const xml = inflateRawSync(buf.subarray(dataStart, dataStart + compSize)).toString('utf8');
      if (xlsxName !== 'FREE-2026-Seller-Fee-Tax-Cheat-Sheet.xlsx') {
        assert.ok(xml.includes('<f>'), `${xlsxName} sheet1.xml must contain live Excel <f> formulas`);
      }
      foundSheet1 = true;
    }
    pos = dataStart + compSize;
  }
  assert.ok(foundSheet1, `Verified worksheet XML inside ${xlsxName}`);
}

// 4. Verify 12 Pinterest 1000x1500 SVG & PNG Pins + SEO Descriptions
for (const calc of CALCULATORS) {
  assert.ok(existsSync(join(PROD_DIST, 'pins', `pin-${calc.slug}.svg`)), `Missing SVG pin for ${calc.slug}`);
  const pngPath = join(PROD_DIST, 'pins-png', `pin-${calc.slug}.png`);
  assert.ok(existsSync(pngPath), `Missing PNG pin for ${calc.slug}`);
  assert.ok(statSync(pngPath).size > 20000, `PNG pin looks too small: ${calc.slug}`);
}
assert.ok(existsSync(join(PROD_DIST, 'pinterest-seo-descriptions.md')));

// 5. Verify HTTP Preview Server responds 200 OK across calculators, guides, and templates
const srv = createPreviewServer();
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const { port } = srv.address();
try {
  for (const path of ['/', '/etsy-fee-calculator/', '/amazon-fba-fee-calculator/', '/ecommerce-tax-calculator/', '/guides/', '/guides/etsy-fees-2026-complete-breakdown/', '/templates/']) {
    const r = await fetch(`http://127.0.0.1:${port}${path}`);
    assert.equal(r.status, 200, `Preview server failed on ${path}`);
  }
} finally {
  await new Promise((r) => srv.close(r));
}

console.log('✅ All 5 verification suites (12 SEO Calculators + Math Unit Tests, 4 Guides, 3 .XLSX Workbooks, 12 SVG+PNG Pinterest Pins, Preview Server) passed!');
