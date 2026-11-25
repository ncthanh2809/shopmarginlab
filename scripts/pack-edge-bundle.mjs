import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((ent) =>
    ent.isDirectory() ? walk(join(dir, ent.name)) : [join(dir, ent.name)]
  );
}

const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const assetMap = {};
for (const file of walk(DIST)) {
  const relPath = '/' + relative(DIST, file).replace(/\\/g, '/');
  const ext = extname(file).toLowerCase();
  assetMap[relPath] = {
    ct: MIMES[ext] || 'text/plain; charset=utf-8',
    body: readFileSync(file, 'utf8')
  };
}

const workerSource = `const ASSETS = ${JSON.stringify(assetMap)};
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

const outFile = 'C:/Users/Admin/.gemini/antigravity/brain/ae4b040c-3405-4a40-b16a-0636ae5d6470/scratch/pages-worker-fast.js';
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, workerSource, 'utf8');
console.log(JSON.stringify({ files: Object.keys(assetMap).length, bundleBytes: Buffer.byteLength(workerSource) }));
