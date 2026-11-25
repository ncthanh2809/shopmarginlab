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
const templateFns = buildSiteSrc.slice(renderStart, fnEnd).trim();

const resolvedConfig = { ...SITE_CONFIG };
const cssRaw = readFileSync(join(DIST, 'styles.css'), 'utf8');
const sharedJsRaw = readFileSync(join(DIST, 'shared.js'), 'utf8');
const faviconRaw = readFileSync(join(DIST, 'favicon.svg'), 'utf8');
const ogCardRaw = readFileSync(join(DIST, 'og-card.svg'), 'utf8');
const sitemapRaw = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const robotsRaw = readFileSync(join(DIST, 'robots.txt'), 'utf8');

const workerCode = `// Auto-generated compact Cloudflare Pages _worker.js (zero-CPU per request)
const SITE_CONFIG = ${JSON.stringify(resolvedConfig)};
const CALCULATORS = ${JSON.stringify(CALCULATORS)};
const GUIDES = ${JSON.stringify(GUIDES)};
const CSS_CONTENT = ${JSON.stringify(cssRaw)};
const SHARED_JS = ${JSON.stringify(sharedJsRaw)};

${escFn}

${templateFns}

const ASSETS = {
  '/styles.css': { ct: 'text/css; charset=utf-8', body: CSS_CONTENT },
  '/shared.js': { ct: 'application/javascript; charset=utf-8', body: SHARED_JS },
  '/index.html': { ct: 'text/html; charset=utf-8', body: buildHomePage() },
  '/templates/index.html': { ct: 'text/html; charset=utf-8', body: buildTemplatesPage() },
  '/guides/index.html': { ct: 'text/html; charset=utf-8', body: buildGuidesIndexPage() },
  '/legal/index.html': { ct: 'text/html; charset=utf-8', body: buildLegalPage() },
  '/favicon.svg': { ct: 'image/svg+xml', body: ${JSON.stringify(faviconRaw)} },
  '/og-card.svg': { ct: 'image/svg+xml', body: ${JSON.stringify(ogCardRaw)} },
  '/sitemap.xml': { ct: 'application/xml; charset=utf-8', body: ${JSON.stringify(sitemapRaw)} },
  '/robots.txt': { ct: 'text/plain; charset=utf-8', body: ${JSON.stringify(robotsRaw)} }
};

for (const calc of CALCULATORS) {
  ASSETS['/' + calc.slug + '/index.html'] = {
    ct: 'text/html; charset=utf-8',
    body: buildCalculatorPage(calc)
  };
}
for (const guide of GUIDES) {
  ASSETS['/guides/' + guide.slug + '/index.html'] = {
    ct: 'text/html; charset=utf-8',
    body: buildGuidePage(guide)
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
  const dep = await cloudflare.request({
    method: "POST",
    path: \`/accounts/\${accountId}/pages/projects/shopmarginlab/deployments\`,
    body: form
  });
  const id = dep.result?.id;
  await new Promise((r) => setTimeout(r, 6000));
  const check = await cloudflare.request({
    method: "GET",
    path: \`/accounts/\${accountId}/pages/projects/shopmarginlab/deployments/\${id}\`
  });
  return { id, url: check.result?.url, latest_stage: check.result?.latest_stage };
}`;

const mcpCodeFile = 'C:/Users/Admin/.gemini/antigravity/brain/ae4b040c-3405-4a40-b16a-0636ae5d6470/scratch/mcp-code.txt';
const mcpCheckFile = 'C:/Users/Admin/.gemini/antigravity/brain/ae4b040c-3405-4a40-b16a-0636ae5d6470/scratch/mcp-check.mjs';
writeFileSync(mcpCodeFile, mcpCode, 'utf8');
writeFileSync(mcpCheckFile, `(${mcpCode})();`, 'utf8');
console.log(JSON.stringify({ outFile, bundleBytes: Buffer.byteLength(workerCode), mcpBytes: Buffer.byteLength(mcpCode) }));
