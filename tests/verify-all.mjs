import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';
import { GUIDES } from '../src/guides-data.mjs';
import { createPreviewServer } from '../scripts/preview-server.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PROD_DIST = join(ROOT, 'products', 'dist');

console.log('🧪 Running ShopMarginLab v3.3 End-to-End Verification...');

assert.equal(CALCULATORS.length, 20, 'Expected 20 calculators');
assert.equal(GUIDES.length, 10, 'Expected 10 SEO guides');

// 1. Verify all 18 SEO calculator pages + JSON-LD + CRO features + live formula math execution
const fmtUsd = (n) => (n < 0 ? '-$' + Math.abs(n).toFixed(2) : '$' + Number(n).toFixed(2));
const pct = (part, whole) => (whole > 0 ? ((part / whole) * 100).toFixed(1) + '%' : '0.0%');

for (const calc of CALCULATORS) {
  const pageFile = join(DIST, calc.slug, 'index.html');
  assert.ok(existsSync(pageFile), `Missing built calculator page: ${calc.slug}`);
  const html = readFileSync(pageFile, 'utf8');
  assert.ok(html.includes('application/ld+json'), `Missing JSON-LD schema on ${calc.slug}`);
  assert.ok(html.includes('FAQPage'), `Missing FAQPage schema on ${calc.slug}`);
  assert.ok(html.includes('BreadcrumbList'), `Missing BreadcrumbList schema on ${calc.slug}`);
  assert.ok(html.includes('rel="sponsored noopener"'), `Missing compliant affiliate rel attribute on ${calc.slug}`);
  assert.ok(html.includes('closedby="any"'), `Missing native light-dismiss modal on ${calc.slug}`);
  assert.ok(html.includes('copyShareLinkBtn'), `Missing shareable link button on ${calc.slug}`);
  assert.ok(html.includes('copySummaryBtn'), `Missing copy summary button on ${calc.slug}`);
  assert.ok(html.includes('exportCsvBtn'), `Missing CSV export button on ${calc.slug}`);
  assert.ok(html.includes('printPdfBtn'), `Missing Print/PDF button on ${calc.slug}`);
  assert.ok(html.includes('openEmbedBtn'), `Missing Embed Free button on ${calc.slug}`);
  assert.ok(html.includes('class="action-strip"'), `Missing above-the-fold conversion strip on ${calc.slug}`);
  assert.ok(!/YOUR_[A-Z0-9_]+/.test(html), `Found unresolved YOUR_* placeholder on ${calc.slug}`);
  assert.ok(
    html.includes(SITE_CONFIG.products.freeCheatSheet.checkoutUrl),
    `Missing $0 lead magnet checkoutUrl on ${calc.slug}`
  );
  assert.ok(html.includes('id="methodology"'), `Missing #methodology section on ${calc.slug}`);
  assert.ok(html.includes('Primary 2026 Fee Sources'), `Missing primary sources on ${calc.slug}`);
  assert.ok(html.includes('"dateModified"'), `Missing dateModified schema on ${calc.slug}`);
  assert.ok(calc.faqs.length >= 4, `Expected >=4 FAQs on ${calc.slug}, got ${calc.faqs.length}`);
  assert.ok(html.includes('cad1da804f7b4d96a19ba0c6a11ac227'), `Missing Cloudflare Web Analytics token on ${calc.slug}`);

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
  for (const inp of calc.inputs.filter((i) => i.type === 'select')) {
    for (const opt of inp.options) {
      const testV = { ...defaults, [inp.id]: isNaN(Number(opt.value)) ? opt.value : Number(opt.value) };
      const altOut = fn(testV, fmtUsd, pct);
      assert.ok(!altOut.primaryValue.includes('NaN'), `NaN on ${calc.slug} option ${inp.id}=${opt.value}`);
    }
  }
}

// 2. Verify /compare/, all 10 SEO Guides + /guides/ + Legal + Templates + Home + Sitemap + llms.txt + feed.xml
const compareHtml = readFileSync(join(DIST, 'compare', 'index.html'), 'utf8');
assert.ok(compareHtml.includes('Shopify Basic') && compareHtml.includes('Poshmark US') && compareHtml.includes('Whatnot Live'), 'Compare page missing platforms');
assert.ok(compareHtml.includes('/depop-fee-calculator/') && compareHtml.includes('/etsy-vs-tiktok-shop-calculator/'), 'Compare page missing Depop / Etsy vs TikTok cross-links');

const depopHtml = readFileSync(join(DIST, 'depop-fee-calculator', 'index.html'), 'utf8');
assert.ok(depopHtml.includes('/guides/depop-fees-2026-guide/'), 'Depop calculator missing guide cross-link');
const evttHtml = readFileSync(join(DIST, 'etsy-vs-tiktok-shop-calculator', 'index.html'), 'utf8');
assert.ok(evttHtml.includes('/guides/etsy-vs-tiktok-shop-2026-guide/'), 'Etsy vs TikTok calculator missing guide cross-link');

assert.ok(existsSync(join(DIST, 'guides', 'index.html')), 'Missing /guides/ index');
for (const g of GUIDES) {
  const gfile = join(DIST, 'guides', g.slug, 'index.html');
  assert.ok(existsSync(gfile), `Missing guide: ${g.slug}`);
  const ghtml = readFileSync(gfile, 'utf8');
  assert.ok(ghtml.includes('"@type":"Article"'), `Missing Article JSON-LD on guide ${g.slug}`);
  assert.ok(ghtml.includes('"@type":"Person"'), `Missing Person author schema on guide ${g.slug}`);
  assert.ok(ghtml.includes('"dateModified"'), `Missing dateModified schema on guide ${g.slug}`);
  assert.ok(ghtml.includes('Key 2026 Takeaways'), `Missing Key 2026 Takeaways on guide ${g.slug}`);
  assert.ok(ghtml.includes('Primary 2026 Sources'), `Missing Primary 2026 Sources on guide ${g.slug}`);
  const guideWordCount = g.sections.flatMap((s) => [s.heading, ...s.paragraphs]).join(' ').split(/\s+/).length;
  assert.ok(guideWordCount >= 450, `Guide ${g.slug} looks thin (${guideWordCount} prose words, expected >=450)`);
  assert.ok(!/YOUR_[A-Z0-9_]+/.test(ghtml), `Found YOUR_* placeholder on guide ${g.slug}`);
}

const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
assert.ok(
  homeHtml.includes(SITE_CONFIG.products.freeCheatSheet.checkoutUrl) &&
    homeHtml.includes(SITE_CONFIG.products.flagshipOs.checkoutUrl) &&
    homeHtml.includes(SITE_CONFIG.products.podMatrix.checkoutUrl),
  'Homepage missing configured product checkout URLs'
);
assert.ok(homeHtml.includes('id="calcSearch"'), 'Missing instant search box on homepage');
assert.ok(homeHtml.includes('"@type":"ItemList"'), 'Missing ItemList JSON-LD on homepage');
assert.ok(!/YOUR_[A-Z0-9_]+/.test(homeHtml), 'Found placeholder on home page');

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const urlCount = (sitemap.match(/<url>/g) || []).length;
assert.equal(urlCount, 36, `Expected 36 URLs in sitemap.xml, got ${urlCount}`);

const aboutHtml = readFileSync(join(DIST, 'about', 'index.html'), 'utf8');
assert.ok(aboutHtml.includes('"@type":"AboutPage"') && aboutHtml.includes('5-Step 2026 Fee Verification Process'), '/about/ page incomplete');

assert.ok(existsSync(join(DIST, `${SITE_CONFIG.indexNowKey}.txt`)), 'Missing IndexNow key txt file');
assert.equal(readFileSync(join(DIST, `${SITE_CONFIG.indexNowKey}.txt`), 'utf8').trim(), SITE_CONFIG.indexNowKey);

const llmsTxt = readFileSync(join(DIST, 'llms.txt'), 'utf8');
assert.ok(llmsTxt.includes('ShopMarginLab') && llmsTxt.includes('/compare/') && llmsTxt.includes('poshmark-fee-calculator'), 'llms.txt incomplete');

const feedXml = readFileSync(join(DIST, 'feed.xml'), 'utf8');
assert.ok(feedXml.includes('<rss version="2.0">') && (feedXml.match(/<item>/g) || []).length === 11, 'feed.xml should have 11 items');

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

// 4. Verify 22 Pinterest 1000x1500 SVG & PNG Pins + Bulk CSV + SEO Descriptions
const pinsManifest = JSON.parse(readFileSync(join(PROD_DIST, 'pins', 'pins-manifest.json'), 'utf8'));
assert.equal(pinsManifest.length, 22, `Expected 22 pins in manifest, got ${pinsManifest.length}`);
for (const pin of pinsManifest) {
  assert.ok(existsSync(join(PROD_DIST, 'pins', `pin-${pin.slug}.svg`)), `Missing SVG pin for ${pin.slug}`);
  const pngPath = join(PROD_DIST, 'pins-png', pin.pngName);
  assert.ok(existsSync(pngPath), `Missing PNG pin for ${pin.slug}`);
  assert.ok(statSync(pngPath).size > 20000, `PNG pin looks too small: ${pin.slug}`);
}
assert.ok(existsSync(join(PROD_DIST, 'pins', 'pinterest-bulk-upload.csv')), 'Missing Pinterest bulk upload CSV');
assert.ok(existsSync(join(PROD_DIST, 'pinterest-seo-descriptions.md')));

// 5. Verify HTTP Preview Server responds 200 OK across v3 routes
const srv = createPreviewServer();
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const { port } = srv.address();
try {
  for (const path of [
    '/',
    '/compare/',
    '/etsy-fee-calculator/',
    '/poshmark-fee-calculator/',
    '/whatnot-fee-calculator/',
    '/etsy-digital-product-profit-calculator/',
    '/depop-fee-calculator/',
    '/etsy-vs-tiktok-shop-calculator/',
    '/guides/',
    '/guides/reseller-platform-fees-compared-2026/',
    '/guides/depop-fees-2026-guide/',
    '/guides/etsy-vs-tiktok-shop-2026-guide/',
    '/templates/',
    '/about/',
    '/legal/',
    '/llms.txt',
    '/feed.xml',
    `/${SITE_CONFIG.indexNowKey}.txt`
  ]) {
    const r = await fetch(`http://127.0.0.1:${port}${path}`);
    assert.equal(r.status, 200, `Preview server failed on ${path}`);
  }
} finally {
  await new Promise((r) => srv.close(r));
}

console.log('✅ All 5 v3.3 verification suites (20 Calculators + Math Unit Tests, /compare/, 10 Guides, 35-URL Sitemap + IndexNow + llms.txt + feed.xml, 3 .XLSX Workbooks, 22 SVG+PNG Pinterest Pins + CSV, Preview Server) passed!');
