import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';
import { GUIDES } from '../src/guides-data.mjs';

const base = process.argv[2] || 'https://shopmarginlab.pages.dev';
const routes = [
  '/',
  '/compare/',
  '/templates/',
  '/guides/',
  '/legal/',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/feed.xml',
  ...(SITE_CONFIG.indexNowKey ? [`/${SITE_CONFIG.indexNowKey}.txt`] : []),
  '/styles.css',
  '/shared.js',
  '/favicon.svg',
  '/og-card.svg',
  ...CALCULATORS.map((c) => `/${c.slug}/`),
  ...GUIDES.map((g) => `/guides/${g.slug}/`),
];

let ok = 0;
const failures = [];
let sitemapUrls = 0;

for (const r of routes) {
  try {
    const res = await fetch(base + r);
    const body = await res.text();
    if (res.status !== 200) {
      failures.push(`${r} -> HTTP ${res.status}`);
      continue;
    }
    if (r === '/') {
      if (body.includes('YOUR_')) failures.push('HOME contains YOUR_ placeholder');
      for (const product of Object.values(SITE_CONFIG.products)) {
        if (!body.includes(product.checkoutUrl)) {
          failures.push(`HOME missing product checkoutUrl ${product.checkoutUrl}`);
        }
      }
      if (!body.includes('poshmark-fee-calculator')) failures.push('HOME missing v3 calculator links');
      if (!body.includes('cad1da804f7b4d96a19ba0c6a11ac227')) failures.push('HOME missing Cloudflare Web Analytics beacon');
    }
    if (r === '/compare/' && !body.includes('Shopify Basic')) {
      failures.push('/compare/ missing 7-channel table');
    }
    if (r === '/llms.txt' && !body.includes('ShopMarginLab')) {
      failures.push('/llms.txt missing brand index');
    }
    if (r === '/sitemap.xml') {
      sitemapUrls = (body.match(/<loc>/g) || []).length;
      const expectedUrls = 5 + CALCULATORS.length + GUIDES.length;
      if (sitemapUrls !== expectedUrls) failures.push(`Expected ${expectedUrls} sitemap URLs, got ${sitemapUrls}`);
    }
    ok++;
  } catch (err) {
    failures.push(`${r} -> ${err.message}`);
  }
}

try {
  const redir = await fetch(base + '/compare', { redirect: 'manual' });
  if (redir.status !== 301) failures.push(`Expected 301 on /compare, got ${redir.status}`);
} catch (err) {
  failures.push(`Redirect check failed -> ${err.message}`);
}

console.log(`LIVE_ROUTES_OK=${ok}/${routes.length} SITEMAP_URLS=${sitemapUrls} FAILURES=${failures.length}`);
if (failures.length > 0) {
  console.error(failures.slice(0, 10).join('\n'));
  process.exit(1);
}
