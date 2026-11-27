/**
 * Submits all ShopMarginLab URLs to IndexNow (Bing, DuckDuckGo, Yandex, Seznam, Naver)
 * Usage: node scripts/submit-indexnow.mjs
 */
import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';
import { GUIDES } from '../src/guides-data.mjs';

const base = SITE_CONFIG.domain.replace(/\/$/, '');
const host = new URL(base).host;
const key = SITE_CONFIG.indexNowKey;
if (!key) {
  console.error('Missing indexNowKey in src/site-config.mjs');
  process.exit(1);
}

const keyLocation = `${base}/${key}.txt`;
const verifyRes = await fetch(keyLocation);
const verifyBody = (await verifyRes.text()).trim();
if (verifyRes.status !== 200 || verifyBody !== key) {
  console.error(`Key file check failed at ${keyLocation}: HTTP ${verifyRes.status}`);
  process.exit(1);
}

const urlList = [
  `${base}/`,
  `${base}/compare/`,
  `${base}/templates/`,
  `${base}/guides/`,
  `${base}/about/`,
  `${base}/legal/`,
  ...CALCULATORS.map((c) => `${base}/${c.slug}/`),
  ...GUIDES.map((g) => `${base}/guides/${g.slug}/`),
];

const payload = { host, key, keyLocation, urlList };
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});
const text = await res.text().catch(() => '');
console.log(JSON.stringify({ endpoint: 'https://api.indexnow.org/indexnow', status: res.status, ok: res.ok, submittedUrls: urlList.length, keyLocation, response: text }));
if (!res.ok) process.exit(1);
