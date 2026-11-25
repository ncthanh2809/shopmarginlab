import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

export function createPreviewServer() {
  return createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');
    let rel = normalize(url.pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
    let target = join(DIST_DIR, rel);

    if (existsSync(target) && statSync(target).isDirectory()) {
      target = join(target, 'index.html');
    } else if (!extname(target) && existsSync(join(target, 'index.html'))) {
      target = join(target, 'index.html');
    }

    if (!target.startsWith(DIST_DIR) || !existsSync(target)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = extname(target).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(readFileSync(target));
  });
}

const isDirect = process.argv[1] && normalize(fileURLToPath(import.meta.url)) === normalize(process.argv[1]);
if (isDirect) {
  const port = Number(process.env.PORT || 4000);
  createPreviewServer().listen(port, () => {
    console.log(`\n🚀 ShopMarginLab Live Preview running at http://localhost:${port}`);
    console.log(`   • Home Hub               : http://localhost:${port}/`);
    console.log(`   • 2026 Etsy Calculator   : http://localhost:${port}/etsy-fee-calculator/`);
    console.log(`   • Shopify vs Etsy Tool   : http://localhost:${port}/shopify-vs-etsy-calculator/`);
    console.log(`   • Excel Storefront       : http://localhost:${port}/templates/\n`);
  });
}
