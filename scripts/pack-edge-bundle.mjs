import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';
import { GUIDES } from '../src/guides-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const buildSiteSrc = readFileSync(join(ROOT, 'src', 'build-site.mjs'), 'utf8');

const escStart = buildSiteSrc.indexOf('function esc(str)');
const cssStart = buildSiteSrc.indexOf('const CSS_CONTENT =');
const renderStart = buildSiteSrc.indexOf('function renderHeader()');
const fnEnd = buildSiteSrc.indexOf('// Build entire static site');
if (escStart === -1 || cssStart === -1 || renderStart === -1 || fnEnd === -1) {
  throw new Error('Could not slice helper functions from build-site.mjs');
}
const escFn = buildSiteSrc.slice(escStart, cssStart).trim();
const templateFns = buildSiteSrc
  .slice(renderStart, fnEnd)
  .trim()
  .replace(/\n[ \t]+/g, '\n');

const resolvedConfig = { ...SITE_CONFIG };
const cssMin = readFileSync(join(DIST, 'styles.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .trim();
const sharedJsRaw = readFileSync(join(DIST, 'shared.js'), 'utf8').replace(/\n[ \t]+/g, '\n').trim();

// Clean calculators: trim whitespace inside computeFnBody
const compactCalcs = CALCULATORS.map((c) => ({
  ...c,
  computeFnBody: c.computeFnBody.replace(/\n[ \t]+/g, '\n').trim()
}));

const workerCode = `const SITE_CONFIG=${JSON.stringify(resolvedConfig)};
const CALCULATORS=${JSON.stringify(compactCalcs)};
const GUIDES=${JSON.stringify(GUIDES)};
const CSS_CONTENT=${JSON.stringify(cssMin)};
const SHARED_JS=${JSON.stringify(sharedJsRaw)};
${escFn}
${templateFns}
const BASE=SITE_CONFIG.domain.replace(/\\/$/,'');
const ALL_PATHS=['/','/compare/','/templates/','/guides/','/legal/',...CALCULATORS.map(c=>'/'+c.slug+'/'),...GUIDES.map(g=>'/guides/'+g.slug+'/')];
const SITEMAP='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+ALL_PATHS.map(p=>'<url><loc>'+esc(BASE+p)+'</loc><priority>'+(p==='/'?'1.0':p==='/compare/'?'0.95':'0.85')+'</priority></url>').join('')+'</urlset>';
const ROBOTS='User-agent: *\\nAllow: /\\nSitemap: '+BASE+'/sitemap.xml\\n';
const LLMS=['# '+SITE_CONFIG.brandName,'> '+SITE_CONFIG.tagline,'','## Compare','- [7-Channel Showdown]('+BASE+'/compare/)','','## Calculators ('+CALCULATORS.length+')',...CALCULATORS.map(c=>'- ['+c.title+']('+BASE+'/'+c.slug+'/): '+c.metaDescription),'','## Guides ('+GUIDES.length+')',...GUIDES.map(g=>'- ['+g.title+']('+BASE+'/guides/'+g.slug+'/): '+g.metaDescription)].join('\\n');
const FEED='<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>'+esc(SITE_CONFIG.brandName)+'</title><link>'+esc(BASE)+'/</link><description>'+esc(SITE_CONFIG.tagline)+'</description><item><title>7-Channel Fee Showdown (2026)</title><link>'+esc(BASE)+'/compare/</link><guid>'+esc(BASE)+'/compare/</guid><description>Compare 7 US channels live.</description></item>'+GUIDES.map(g=>'<item><title>'+esc(g.title)+'</title><link>'+esc(BASE)+'/guides/'+g.slug+'/</link><guid>'+esc(BASE)+'/guides/'+g.slug+'/</guid><description>'+esc(g.metaDescription)+'</description></item>').join('')+'</channel></rss>';
const FAVICON='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d9488"/><path d="M16 42l10-12 9 7 13-17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const OGCARD='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0f172a"/><circle cx="1040" cy="110" r="230" fill="#0d9488" opacity="0.35"/><text x="80" y="140" font-family="system-ui,sans-serif" font-size="36" font-weight="800" fill="#5eead4">ShopMarginLab</text><text x="80" y="260" font-family="system-ui,sans-serif" font-size="56" font-weight="800" fill="#ffffff">' + CALCULATORS.length + ' Free 2026 E-Commerce &amp;</text><text x="80" y="335" font-family="system-ui,sans-serif" font-size="56" font-weight="800" fill="#ffffff">Reseller Profit Calculators</text><text x="80" y="420" font-family="system-ui,sans-serif" font-size="25" fill="#cbd5e1">Etsy • Shopify • Amazon FBA • eBay • Poshmark • Mercari • Depop • Whatnot • TikTok</text></svg>';
const ASSETS={
'/styles.css':{ct:'text/css; charset=utf-8',body:CSS_CONTENT},
'/shared.js':{ct:'application/javascript; charset=utf-8',body:SHARED_JS},
'/index.html':{ct:'text/html; charset=utf-8',body:buildHomePage()},
'/compare/index.html':{ct:'text/html; charset=utf-8',body:buildComparePage()},
'/templates/index.html':{ct:'text/html; charset=utf-8',body:buildTemplatesPage()},
'/guides/index.html':{ct:'text/html; charset=utf-8',body:buildGuidesIndexPage()},
'/legal/index.html':{ct:'text/html; charset=utf-8',body:buildLegalPage()},
'/favicon.svg':{ct:'image/svg+xml',body:FAVICON},
'/og-card.svg':{ct:'image/svg+xml',body:OGCARD},
'/sitemap.xml':{ct:'application/xml; charset=utf-8',body:SITEMAP},
'/robots.txt':{ct:'text/plain; charset=utf-8',body:ROBOTS},
'/llms.txt':{ct:'text/plain; charset=utf-8',body:LLMS},
'/feed.xml':{ct:'application/rss+xml; charset=utf-8',body:FEED}
};
if(SITE_CONFIG.indexNowKey)ASSETS['/'+SITE_CONFIG.indexNowKey+'.txt']={ct:'text/plain; charset=utf-8',body:SITE_CONFIG.indexNowKey};
for(const c of CALCULATORS)ASSETS['/'+c.slug+'/index.html']={ct:'text/html; charset=utf-8',body:buildCalculatorPage(c)};
for(const g of GUIDES)ASSETS['/guides/'+g.slug+'/index.html']={ct:'text/html; charset=utf-8',body:buildGuidePage(g)};
export default{async fetch(request){const u=new URL(request.url);let p=u.pathname;if(p.endsWith('/'))p+='index.html';else if(!p.includes('.'))return Response.redirect(u.origin+p+'/'+u.search,301);const h=ASSETS[p];if(!h)return new Response('404 Not Found',{status:404});const cc=p.endsWith('.html')?'public, max-age=300, must-revalidate':'public, max-age=86400';return new Response(h.body,{headers:{'Content-Type':h.ct,'Cache-Control':cc,'X-Content-Type-Options':'nosniff'}});}};
`;

const outFile = join(ROOT, '.tmp', 'pages-worker-compact.mjs');
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, workerCode, 'utf8');

// Verify worker locally across all routes before deploying
const mod = await import('file:///' + outFile.replace(/\\/g, '/') + '?t=' + Date.now());
const testPaths = [
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
  ...GUIDES.map((g) => `/guides/${g.slug}/`)
];
for (const tp of testPaths) {
  const res = await mod.default.fetch(new Request('https://shopmarginlab.pages.dev' + tp));
  if (res.status !== 200) throw new Error(`Worker self-test failed on ${tp}: HTTP ${res.status}`);
}

console.log(JSON.stringify({ outFile, routesVerified: testPaths.length, bundleBytes: Buffer.byteLength(workerCode) }));
