import { CALCULATORS } from '../src/calculators-data.mjs';
import { GUIDES } from '../src/guides-data.mjs';

const base = process.argv[2] || 'https://shopmarginlab.pages.dev';
const routes = [
  '/',
  '/templates/',
  '/guides/',
  '/legal/',
  '/sitemap.xml',
  '/robots.txt',
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
      for (const code of ['MGRn9', 'rgL6o', 'u1UYJ']) {
        if (!body.includes(code)) failures.push(`HOME missing Payhip code ${code}`);
      }
      if (!body.includes('amazon-fba-fee-calculator')) failures.push('HOME missing v2 calculator links');
    }
    if (r === '/sitemap.xml') {
      sitemapUrls = (body.match(/<loc>/g) || []).length;
      if (sitemapUrls !== 20) failures.push(`Expected 20 sitemap URLs, got ${sitemapUrls}`);
    }
    ok++;
  } catch (err) {
    failures.push(`${r} -> ${err.message}`);
  }
}

// Verify 301 redirect for no-trailing-slash URL
try {
  const redir = await fetch(base + '/etsy-fee-calculator', { redirect: 'manual' });
  if (redir.status !== 301) failures.push(`Expected 301 on /etsy-fee-calculator, got ${redir.status}`);
} catch (err) {
  failures.push(`Redirect check failed -> ${err.message}`);
}

console.log(`LIVE_ROUTES_OK=${ok}/${routes.length} SITEMAP_URLS=${sitemapUrls} FAILURES=${failures.length}`);
if (failures.length > 0) {
  console.error(failures.slice(0, 10).join('\n'));
  process.exit(1);
}
