import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
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

const workerCode = `const BASE_SITE_CONFIG=${JSON.stringify(resolvedConfig)};
const BASE_CALCULATORS=${JSON.stringify(compactCalcs)};
const BASE_GUIDES=${JSON.stringify(GUIDES)};
const CSS_CONTENT=${JSON.stringify(cssMin)};
const SHARED_JS=${JSON.stringify(sharedJsRaw)};
let SITE_CONFIG=BASE_SITE_CONFIG;
let CALCULATORS=BASE_CALCULATORS;
let GUIDES=BASE_GUIDES;
${escFn}
${templateFns}
const FAVICON='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d9488"/><path d="M16 42l10-12 9 7 13-17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function mergeNested(b,o){if(!o||typeof o!=='object')return b;const out={...b};for(const[k,v]of Object.entries(o)){out[k]=v&&typeof v==='object'&&!Array.isArray(v)&&out[k]&&typeof out[k]==='object'?{...out[k],...v}:v;}return out;}
function mergeSiteConfig(b,o){if(!o||typeof o!=='object')return b;return{...b,...o,affiliates:mergeNested(b.affiliates,o.affiliates),products:mergeNested(b.products,o.products)};}
function mergeBySlug(b,ex){if(!Array.isArray(ex)||!ex.length)return b;const m=new Map(b.map(x=>[x.slug,x]));for(const it of ex)if(it&&it.slug)m.set(it.slug,it);return Array.from(m.values());}
function buildAssets(cfg,calcs,guides,ov){
SITE_CONFIG=cfg;CALCULATORS=calcs;GUIDES=guides;
const BASE=SITE_CONFIG.domain.replace(/\\/$/,'');
const ALL_PATHS=['/','/compare/','/templates/','/guides/','/about/','/legal/',...CALCULATORS.map(c=>'/'+c.slug+'/'),...GUIDES.map(g=>'/guides/'+g.slug+'/')];
const SITEMAP='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+ALL_PATHS.map(p=>'<url><loc>'+esc(BASE+p)+'</loc><priority>'+(p==='/'?'1.0':p==='/compare/'?'0.95':'0.85')+'</priority></url>').join('')+'</urlset>';
const ROBOTS='User-agent: *\\nAllow: /\\nSitemap: '+BASE+'/sitemap.xml\\n';
const LLMS=['# '+SITE_CONFIG.brandName,'> '+SITE_CONFIG.tagline,'','## Compare','- [7-Channel Showdown]('+BASE+'/compare/)','','## Calculators ('+CALCULATORS.length+')',...CALCULATORS.map(c=>'- ['+c.title+']('+BASE+'/'+c.slug+'/): '+c.metaDescription),'','## Guides ('+GUIDES.length+')',...GUIDES.map(g=>'- ['+g.title+']('+BASE+'/guides/'+g.slug+'/): '+g.metaDescription)].join('\\n');
const FEED='<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>'+esc(SITE_CONFIG.brandName)+'</title><link>'+esc(BASE)+'/</link><description>'+esc(SITE_CONFIG.tagline)+'</description><item><title>7-Channel Fee Showdown (2026)</title><link>'+esc(BASE)+'/compare/</link><guid>'+esc(BASE)+'/compare/</guid><description>Compare 7 US channels live.</description></item>'+GUIDES.map(g=>'<item><title>'+esc(g.title)+'</title><link>'+esc(BASE)+'/guides/'+g.slug+'/</link><guid>'+esc(BASE)+'/guides/'+g.slug+'/</guid><description>'+esc(g.metaDescription)+'</description></item>').join('')+'</channel></rss>';
const OGCARD='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0f172a"/><circle cx="1040" cy="110" r="230" fill="#0d9488" opacity="0.35"/><text x="80" y="140" font-family="system-ui,sans-serif" font-size="36" font-weight="800" fill="#5eead4">'+esc(SITE_CONFIG.brandName)+'</text><text x="80" y="260" font-family="system-ui,sans-serif" font-size="56" font-weight="800" fill="#ffffff">'+CALCULATORS.length+' Free 2026 E-Commerce &amp;</text><text x="80" y="335" font-family="system-ui,sans-serif" font-size="56" font-weight="800" fill="#ffffff">Reseller Profit Calculators</text><text x="80" y="420" font-family="system-ui,sans-serif" font-size="25" fill="#cbd5e1">Etsy • Shopify • Amazon FBA • eBay • Poshmark • Mercari • Depop • Whatnot • TikTok</text></svg>';
const a={
'/styles.css':{ct:'text/css; charset=utf-8',body:CSS_CONTENT},
'/shared.js':{ct:'application/javascript; charset=utf-8',body:SHARED_JS},
'/index.html':{ct:'text/html; charset=utf-8',body:buildHomePage()},
'/compare/index.html':{ct:'text/html; charset=utf-8',body:buildComparePage()},
'/templates/index.html':{ct:'text/html; charset=utf-8',body:buildTemplatesPage()},
'/guides/index.html':{ct:'text/html; charset=utf-8',body:buildGuidesIndexPage()},
'/about/index.html':{ct:'text/html; charset=utf-8',body:buildAboutPage()},
'/legal/index.html':{ct:'text/html; charset=utf-8',body:buildLegalPage()},
'/favicon.svg':{ct:'image/svg+xml',body:FAVICON},
'/og-card.svg':{ct:'image/svg+xml',body:OGCARD},
'/sitemap.xml':{ct:'application/xml; charset=utf-8',body:SITEMAP},
'/robots.txt':{ct:'text/plain; charset=utf-8',body:ROBOTS},
'/llms.txt':{ct:'text/plain; charset=utf-8',body:LLMS},
'/feed.xml':{ct:'application/rss+xml; charset=utf-8',body:FEED}
};
if(SITE_CONFIG.indexNowKey)a['/'+SITE_CONFIG.indexNowKey+'.txt']={ct:'text/plain; charset=utf-8',body:SITE_CONFIG.indexNowKey};
for(const c of CALCULATORS)a['/'+c.slug+'/index.html']={ct:'text/html; charset=utf-8',body:buildCalculatorPage(c)};
for(const g of GUIDES)a['/guides/'+g.slug+'/index.html']={ct:'text/html; charset=utf-8',body:buildGuidePage(g)};
if(ov&&typeof ov==='object'){for(const[k,v]of Object.entries(ov))if(v&&typeof v.body==='string')a[k]={ct:v.ct||'text/plain; charset=utf-8',body:v.body};}
return a;
}
let activeVer=null;
let lastCheckMs=0;
let activeAssets=buildAssets(BASE_SITE_CONFIG,BASE_CALCULATORS,BASE_GUIDES,null);
async function ensureAssets(env){
const kv=env&&env.SML_KV;
if(!kv)return activeAssets;
const now=Date.now();
if(now-lastCheckMs<30000&&activeVer!==null)return activeAssets;
lastCheckMs=now;
const mf=await kv.get('live_manifest',{type:'json',cacheTtl:30}).catch(()=>null);
if(!mf||!mf.ver||mf.ver===activeVer)return activeAssets;
const[cfgOv,calcOv,guideOv,assetOv]=await Promise.all([
mf.hasSiteConfig?kv.get('site_config',{type:'json',cacheTtl:30}).catch(()=>null):null,
mf.hasExtraCalcs?kv.get('extra_calculators',{type:'json',cacheTtl:30}).catch(()=>null):null,
mf.hasExtraGuides?kv.get('extra_guides',{type:'json',cacheTtl:30}).catch(()=>null):null,
mf.hasOverrides?kv.get('override_assets',{type:'json',cacheTtl:30}).catch(()=>null):null
]);
activeAssets=buildAssets(mergeSiteConfig(BASE_SITE_CONFIG,cfgOv),mergeBySlug(BASE_CALCULATORS,calcOv),mergeBySlug(BASE_GUIDES,guideOv),assetOv);
activeVer=mf.ver;
return activeAssets;
}
export default{async fetch(request,env){const u=new URL(request.url);let p=u.pathname;if(p.endsWith('/'))p+='index.html';else if(!p.includes('.'))return Response.redirect(u.origin+p+'/'+u.search,301);const ASSETS=await ensureAssets(env);const h=ASSETS[p];if(!h)return new Response('404 Not Found',{status:404});const cc=p.endsWith('.html')?'public, max-age=300, must-revalidate':'public, max-age=86400';return new Response(h.body,{headers:{'Content-Type':h.ct,'Cache-Control':cc,'X-Content-Type-Options':'nosniff'}});}};
`;

const outFile = join(ROOT, '.tmp', 'pages-worker-compact.mjs');
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, workerCode, 'utf8');

// Verify worker locally across all routes + KV override mode before deploying
const mod = await import('file:///' + outFile.replace(/\\/g, '/') + '?t=' + Date.now());
const testPaths = [
  '/',
  '/compare/',
  '/templates/',
  '/guides/',
  '/about/',
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

// Verify SML_KV live override path
const mockKvData = {
  live_manifest: { ver: 'kv-test-1', hasSiteConfig: true, hasOverrides: true },
  site_config: {
    extraHeadHtml: "<meta name='google-site-verification' content='test123'>",
    affiliates: { printify: { url: 'https://example.com/printify-live-test' } }
  },
  override_assets: { '/test-verify.txt': { ct: 'text/plain', body: 'ok-verify' } }
};
const mockEnv = { SML_KV: { async get(key) { return mockKvData[key] ?? null; } } };
const kvHome = await (await mod.default.fetch(new Request('https://shopmarginlab.pages.dev/'), mockEnv)).text();
assert.ok(kvHome.includes("google-site-verification' content='test123'"), 'KV extraHeadHtml override failed');
const kvPod = await (await mod.default.fetch(new Request('https://shopmarginlab.pages.dev/print-on-demand-profit-calculator/'), mockEnv)).text();
assert.ok(kvPod.includes('https://example.com/printify-live-test'), 'KV affiliate url override failed');
const kvAmazon = await (await mod.default.fetch(new Request('https://shopmarginlab.pages.dev/amazon-fba-fee-calculator/'), mockEnv)).text();
assert.ok(kvAmazon.includes('https://linkmybooks.cello.so/mqa9XBXQElJ'), 'Partial KV override should preserve Link My Books link');
const kvAsset = await (await mod.default.fetch(new Request('https://shopmarginlab.pages.dev/test-verify.txt'), mockEnv)).text();
assert.equal(kvAsset, 'ok-verify', 'KV custom asset override failed');

console.log(JSON.stringify({ outFile, routesVerified: testPaths.length, kvSelfTestPassed: true, bundleBytes: Buffer.byteLength(workerCode) }));
