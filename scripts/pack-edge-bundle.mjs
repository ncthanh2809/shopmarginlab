import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const buildSiteSrc = readFileSync(join(ROOT, 'src', 'build-site.mjs'), 'utf8');

// Re-use exact functions from build-site.mjs without Node fs/process dependencies
const escStart = buildSiteSrc.indexOf('function esc(str)');
const cssStart = buildSiteSrc.indexOf('const CSS_CONTENT =');
const renderStart = buildSiteSrc.indexOf('function renderHeader()');
const fnEnd = buildSiteSrc.indexOf('// Build entire static site');
if (escStart === -1 || cssStart === -1 || renderStart === -1 || fnEnd === -1) {
  throw new Error('Could not slice helper functions from build-site.mjs');
}
const escFn = buildSiteSrc.slice(escStart, cssStart).trim();
const templateFns = buildSiteSrc.slice(renderStart, fnEnd).trim();

const resolvedConfig = { ...SITE_CONFIG };
const cssRaw = readFileSync(join(DIST, 'styles.css'), 'utf8');
const sharedJsRaw = readFileSync(join(DIST, 'shared.js'), 'utf8');

const workerCode = `// Auto-generated compact Cloudflare Pages _worker.js (zero-CPU per request)
const SITE_CONFIG = ${JSON.stringify(resolvedConfig)};
const CALCULATORS = ${JSON.stringify(CALCULATORS)};
const CSS_CONTENT = ${JSON.stringify(cssRaw)};
const SHARED_JS = ${JSON.stringify(sharedJsRaw)};

${escFn}

${templateFns}

const base = SITE_CONFIG.domain.replace(/\\/$/, '');
const allPaths = ['/', '/templates/', '/legal/', ...CALCULATORS.map((c) => '/' + c.slug + '/')];
const sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n' +
  allPaths.map((p) => '  <url><loc>' + esc(base + p) + '</loc><priority>' + (p === '/' ? '1.0' : '0.85') + '</priority></url>').join('\\n') +
  '\\n</urlset>';

const ASSETS = {
  '/styles.css': { ct: 'text/css; charset=utf-8', body: CSS_CONTENT },
  '/shared.js': { ct: 'application/javascript; charset=utf-8', body: SHARED_JS },
  '/index.html': { ct: 'text/html; charset=utf-8', body: buildHomePage() },
  '/templates/index.html': { ct: 'text/html; charset=utf-8', body: buildTemplatesPage() },
  '/legal/index.html': { ct: 'text/html; charset=utf-8', body: buildLegalPage() },
  '/favicon.svg': {
    ct: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\\n  <rect width="64" height="64" rx="14" fill="#0d9488"/>\\n  <path d="M16 42l10-12 9 7 13-17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\\n</svg>'
  },
  '/og-card.svg': {
    ct: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">\\n  <rect width="1200" height="630" fill="#0f172a"/>\\n  <circle cx="1040" cy="110" r="230" fill="#0d9488" opacity="0.35"/>\\n  <text x="80" y="140" font-family="system-ui, sans-serif" font-size="36" font-weight="800" fill="#5eead4">' + esc(SITE_CONFIG.brandName) + '</text>\\n  <text x="80" y="260" font-family="system-ui, sans-serif" font-size="60" font-weight="800" fill="#ffffff">2026 E-Commerce Fee,</text>\\n  <text x="80" y="335" font-family="system-ui, sans-serif" font-size="60" font-weight="800" fill="#ffffff">ROAS &amp; Profit Calculators</text>\\n  <text x="80" y="420" font-family="system-ui, sans-serif" font-size="28" fill="#cbd5e1">Etsy • Shopify • TikTok Shop US • Print-on-Demand • Excel Profit OS</text>\\n</svg>'
  },
  '/sitemap.xml': { ct: 'application/xml; charset=utf-8', body: sitemapXml },
  '/robots.txt': { ct: 'text/plain; charset=utf-8', body: 'User-agent: *\\nAllow: /\\nSitemap: ' + base + '/sitemap.xml\\n' }
};

for (const calc of CALCULATORS) {
  ASSETS['/' + calc.slug + '/index.html'] = {
    ct: 'text/html; charset=utf-8',
    body: buildCalculatorPage(calc)
  };
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let p = url.pathname;
    if (p.endsWith('/')) p += 'index.html';
    else if (!p.includes('.')) return Response.redirect(url.origin + p + '/' + url.search, 301);
    const hit = ASSETS[p];
    if (!hit) return new Response('404 Not Found', { status: 404 });
    return new Response(hit.body, {
      headers: {
        'Content-Type': hit.ct,
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};
`;

const outFile = 'C:/Users/Admin/.gemini/antigravity/brain/ae4b040c-3405-4a40-b16a-0636ae5d6470/scratch/pages-worker-compact.js';
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, workerCode, 'utf8');

const mcpCode = `async () => {
  const workerSource = ${JSON.stringify(workerCode)};
  const form = new FormData();
  form.append("manifest", "{}");
  form.append("branch", "main");
  form.append("_worker.js", new Blob([workerSource], { type: "application/javascript+module" }), "_worker.js");
  const res = await cloudflare.request({
    method: "POST",
    path: \`/accounts/\${accountId}/pages/projects/shopmarginlab/deployments\`,
    body: form
  });
  return { id: res.result?.id, url: res.result?.url, aliases: res.result?.aliases, stage: res.result?.latest_stage };
}`;

const mcpCodeFile = 'C:/Users/Admin/.gemini/antigravity/brain/ae4b040c-3405-4a40-b16a-0636ae5d6470/scratch/mcp-code.txt';
const mcpCheckFile = 'C:/Users/Admin/.gemini/antigravity/brain/ae4b040c-3405-4a40-b16a-0636ae5d6470/scratch/mcp-check.mjs';
writeFileSync(mcpCodeFile, mcpCode, 'utf8');
writeFileSync(mcpCheckFile, `(${mcpCode})();`, 'utf8');
console.log(JSON.stringify({ outFile, bundleBytes: Buffer.byteLength(workerCode), mcpBytes: Buffer.byteLength(mcpCode) }));
