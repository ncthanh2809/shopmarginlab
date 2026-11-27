import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from './site-config.mjs';
import { CALCULATORS } from './calculators-data.mjs';
import { GUIDES } from './guides-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const CSS_CONTENT = `:root {
  --brand: #0d9488;
  --brand-dark: #0f766e;
  --brand-soft: #ccfbf1;
  --accent: #d97706;
  --accent-soft: #fef3c7;
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-muted: #f1f5f9;
  --text: #0f172a;
  --text-muted: #475569;
  --border: #cbd5e1;
  --danger: #d93025;
  --danger-bg: #fce8e6;
  --success: #15803d;
  --success-bg: #dcfce7;
  --radius-md: 14px;
  --radius-lg: 20px;
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 12px 32px rgba(15, 23, 42, 0.08);
  --target-size: 24px;
}

@media (pointer: coarse) {
  :root {
    --target-size: 44px;
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.58;
  scroll-behavior: smooth;
  scroll-padding-top: 4.5rem;
}

body {
  margin: 0;
  overflow-wrap: break-word;
}

img, video {
  max-inline-size: 100%;
  block-size: auto;
}

:where(a, code) {
  overflow-wrap: anywhere;
}

h1, h2, h3 {
  text-wrap: balance;
  line-height: 1.22;
  letter-spacing: -0.02em;
  margin-block: 0 0.65rem;
}

p, li {
  text-wrap: pretty;
  margin-block: 0 0.75rem;
}

:where(
  button,
  select,
  textarea,
  input:not([type='checkbox'], [type='radio']),
  [role='button'],
  nav a,
  label:has(input[type='checkbox'], input[type='radio'])
) {
  min-block-size: var(--target-size);
  min-inline-size: var(--target-size);
}

:where([role='button'], nav a, label:has(input[type='checkbox'], input[type='radio'])) {
  display: inline-flex;
  align-items: center;
}

:where(nav, nav ul, .toolbar) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
}

:where(.toolbar > :not(button, input, select, textarea, a, [role='button'], label)) {
  min-inline-size: 0;
}

.visually-hidden:where(:not(:focus-within, :active)) {
  position: absolute !important;
  clip-path: inset(50%) !important;
  overflow: hidden !important;
  width: 1px !important;
  height: 1px !important;
  margin: -1px !important;
  padding: 0 !important;
  border: 0 !important;
  white-space: nowrap !important;
}

.container {
  max-inline-size: 1160px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 2rem);
}

.site-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  border-block-end: 1px solid var(--border);
  padding-block: 0.7rem;
}

.nav-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 800;
  font-size: 1.12rem;
  color: var(--text);
  text-decoration: none;
}

.brand-icon {
  display: inline-grid;
  place-items: center;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 9px;
  background: var(--brand);
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list a {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
}

.nav-list a:hover {
  background: var(--surface-muted);
  color: var(--text);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.65rem 1.15rem;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-weight: 700;
  font-size: 0.93rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.btn:active {
  transform: scale(0.985);
}

.btn-primary {
  background: var(--brand);
  color: #fff;
}

.btn-primary:hover {
  background: var(--brand-dark);
}

.btn-accent {
  background: #0f172a;
  color: #fff;
}

.btn-accent:hover {
  background: #1e293b;
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-secondary:hover {
  background: var(--surface-muted);
}

.btn-sm {
  padding: 0.4rem 0.78rem;
  font-size: 0.83rem;
}

.filter-chip {
  background: var(--surface);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
}

.filter-chip[aria-pressed='true'] {
  background: var(--text);
  color: #fff;
  border-color: var(--text);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--brand-soft);
  color: var(--brand-dark);
}

.pill-gold {
  background: var(--accent-soft);
  color: #92400e;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: clamp(1.15rem, 2.5vw, 1.65rem);
  box-shadow: var(--shadow-sm);
}

.calc-layout {
  display: grid;
  gap: 1.5rem;
  align-items: start;
  margin-block: 1.75rem 2.5rem;
}

@media (min-width: 920px) {
  .calc-layout {
    grid-template-columns: 1fr 1.15fr;
  }
}

.field {
  margin-block-end: 0.95rem;
}

.field label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-block-end: 0.25rem;
}

.field input,
.field select {
  inline-size: 100%;
  padding: 0.62rem 0.8rem;
  border-radius: 9px;
  border: 1.5px solid var(--border);
  font: inherit;
  background: var(--surface);
  color: var(--text);
}

.field input:focus,
.field select:focus {
  outline: 2px solid var(--brand);
  outline-offset: 1px;
  border-color: var(--brand);
}

.result-hero {
  background: #0f172a;
  color: #f8fafc;
  border-radius: var(--radius-md);
  padding: 1.35rem;
  margin-block-end: 1.15rem;
}

.result-big {
  font-size: clamp(1.85rem, 4vw, 2.55rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-block: 0.2rem 0.85rem;
}

.result-big[data-tone='positive'] { color: #5eead4; }
.result-big[data-tone='negative'] { color: #fca5a5; }
.result-big[data-tone='neutral'] { color: #fde68a; }

.kpi-row {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
  border-block-start: 1px solid #334155;
  padding-block-start: 0.9rem;
}

/* Responsive breakdown table per responsive-table guidance */
.table-wrapper {
  overflow: auto;
  max-inline-size: 100%;
  container-type: inline-size;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.table-wrapper table {
  inline-size: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
}

.table-wrapper caption {
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 700;
  background: var(--surface-muted);
  border-block-end: 1px solid var(--border);
}

.table-wrapper thead {
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
}

.table-wrapper thead th {
  background: var(--surface-muted);
  color: var(--text-muted);
  padding: 0.65rem 0.9rem;
  text-align: left;
  border-block-end: 1px solid var(--border);
}

.table-wrapper tbody th,
.table-wrapper tbody td {
  padding: 0.68rem 0.9rem;
  border-block-end: 1px solid #e2e8f0;
  text-align: left;
}

.table-wrapper tbody th {
  position: sticky;
  inset-inline-start: 0;
  z-index: 1;
  background: var(--surface);
  font-weight: 600;
}

@container (width < 560px) {
  .table-wrapper table,
  .table-wrapper thead,
  .table-wrapper tbody,
  .table-wrapper tr,
  .table-wrapper th,
  .table-wrapper td {
    display: block;
  }
  .table-wrapper thead {
    display: none;
  }
  .table-wrapper tr {
    margin: 0.65rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .table-wrapper tbody th {
    position: sticky;
    inset-block-start: 0;
    background: var(--surface-muted);
  }
  .table-wrapper td:nth-child(2)::before {
    content: var(--label-2) ': ';
    font-weight: 700;
    color: var(--text-muted);
  }
  .table-wrapper td:nth-child(3)::before {
    content: var(--label-3) ': ';
    font-weight: 700;
    color: var(--text-muted);
  }
  .compare-table td:nth-child(4)::before {
    content: var(--label-4) ': ';
    font-weight: 700;
    color: var(--text-muted);
  }
  .compare-table td:nth-child(5)::before {
    content: var(--label-5) ': ';
    font-weight: 700;
    color: var(--text-muted);
  }
}

.guide-prose p {
  max-inline-size: 68ch;
}

.monetize-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  margin-block: 1.5rem 2.5rem;
}

.affiliate-box {
  border: 2px solid var(--brand);
  background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%);
}

.product-box {
  border: 2px solid #0f172a;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.grid-cards {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

dialog {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: clamp(1.25rem, 3vw, 1.8rem);
  max-inline-size: min(600px, calc(100vw - 2rem));
  inline-size: 100%;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-md);
}

dialog::backdrop {
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
}

.toast {
  position: fixed;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
  z-index: 60;
  background: #0f172a;
  color: #f8fafc;
  padding: 0.75rem 1.15rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.toast[data-visible='true'] {
  opacity: 1;
  transform: translateY(0);
}

.disclosure-bar {
  background: var(--surface-muted);
  border-block-end: 1px solid var(--border);
  font-size: 0.78rem;
  color: var(--text-muted);
  padding-block: 0.35rem;
  text-align: center;
}

.site-footer {
  border-block-start: 1px solid var(--border);
  background: var(--surface);
  padding-block: 2.5rem;
  margin-block-start: 3.5rem;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.search-input {
  inline-size: min(100%, 340px);
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  font: inherit;
  font-size: 0.9rem;
  background: var(--surface);
  color: var(--text);
}

.search-input:focus {
  outline: 2px solid var(--brand);
  outline-offset: 1px;
  border-color: var(--brand);
}

.advice-card {
  margin-bottom: 1rem;
  background: #f0fdfa;
  border-color: #99f6e4;
  font-size: 0.92rem;
  color: #115e59;
}

.advice-text {
  font-weight: 600;
}

.action-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #99f6e4;
}

.embed-footer {
  display: none;
  margin-top: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

html.embed-mode .disclosure-bar,
html.embed-mode .site-header,
html.embed-mode .site-footer,
html.embed-mode .monetize-grid,
html.embed-mode .non-embed-section,
html.embed-mode .action-strip {
  display: none !important;
}

html.embed-mode .embed-footer {
  display: flex;
}

@media print {
  .disclosure-bar,
  .site-header,
  .site-footer,
  .toolbar,
  .monetize-grid,
  .non-embed-section,
  .action-strip,
  .toast,
  dialog {
    display: none !important;
  }
  body {
    background: #fff;
    color: #000;
  }
  .result-hero {
    background: #f1f5f9 !important;
    color: #0f172a !important;
    border: 2px solid #0f172a;
  }
  .result-big {
    color: #0f172a !important;
  }
}

.byline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.9rem;
  align-items: center;
  font-size: 0.84rem;
  color: var(--text-muted);
  margin-block: 0.75rem 1.25rem;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  background: var(--surface-muted);
  border: 1px solid #e2e8f0;
}

.byline-meta a {
  color: var(--brand-dark);
  font-weight: 600;
  text-decoration: none;
}

.byline-meta a:hover {
  text-decoration: underline;
}

.formula-box {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-inline-start: 4px solid var(--brand);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.86rem;
  color: var(--text);
  margin-block: 0.75rem 1rem;
}

.takeaway-box {
  background: #f0fdfa;
  border: 1.5px solid #99f6e4;
  border-radius: var(--radius-md);
  padding: 1.15rem 1.35rem;
  margin-block: 1.25rem 1.5rem;
}

.source-list {
  list-style: none;
  padding: 0;
  margin: 0.65rem 0 0;
  display: grid;
  gap: 0.45rem;
}

.source-list a {
  color: var(--brand-dark);
  font-weight: 600;
  font-size: 0.9rem;
}
`;

const SHARED_JS = `
// Detect ?embed=1 mode for clean iframe embeds with attribution backlink
if (new URLSearchParams(window.location.search).get('embed') === '1') {
  document.documentElement.classList.add('embed-mode');
}

// Light-dismiss Safari fallback per light-dismiss-a-dialog guide
if (!('closedBy' in HTMLDialogElement.prototype)) {
  document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    });
  });
}

// Accessible toast helper
window.showToast = (msg) => {
  let el = document.getElementById('appToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'appToast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.setAttribute('data-visible', 'true');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.setAttribute('data-visible', 'false'), 2800);
};
`;

function renderHeader() {
  return `
  <div class="disclosure-bar">
    Reader-supported seller tools: When you try software via links on our site, we may earn an affiliate commission at zero extra cost to you. <a href="/legal/#affiliate-disclosure" style="color:inherit">Learn more</a>.
  </div>
  <header class="site-header">
    <div class="container nav-inner">
      <a href="/" class="brand-link">
        <span class="brand-icon" aria-hidden="true">SM</span>
        <span>${esc(SITE_CONFIG.brandName)}</span>
      </a>
      <nav aria-label="Primary Navigation">
        <ul class="nav-list">
          <li><a href="/compare/">Compare 7 Channels</a></li>
          <li><a href="/etsy-fee-calculator/">Etsy Fees</a></li>
          <li><a href="/shopify-vs-etsy-calculator/">Shopify vs Etsy</a></li>
          <li><a href="/amazon-fba-fee-calculator/">Amazon FBA</a></li>
          <li><a href="/guides/">2026 Guides</a></li>
          <li><a href="/about/">Methodology</a></li>
          <li><a href="/templates/"><strong>📊 Excel Bundles ($0–$24)</strong></a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div style="display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));margin-bottom:1.5rem">
        <div>
          <strong style="color:var(--text);font-size:1rem">${esc(SITE_CONFIG.brandName)}</strong>
          <p style="margin-top:0.4rem">${CALCULATORS.length} free, ultra-accurate 2026 fee, ROAS, reseller &amp; tax calculators plus Excel operating systems for Etsy, Shopify, Amazon, eBay, Poshmark, Mercari, Whatnot, POD, and TikTok Shop sellers.</p>
        </div>
        <div>
          <strong style="color:var(--text)">Etsy, Shopify, POD &amp; ROAS</strong>
          <ul style="list-style:none;padding:0;margin:0.5rem 0 0">
            ${CALCULATORS.slice(0, 9)
              .map((c) => `<li style="margin-bottom:0.3rem"><a href="/${c.slug}/" style="color:var(--text-muted);text-decoration:none">${esc(c.shortName)}</a></li>`)
              .join('')}
          </ul>
        </div>
        <div>
          <strong style="color:var(--text)">Marketplaces, Resellers &amp; Tax</strong>
          <ul style="list-style:none;padding:0;margin:0.5rem 0 0">
            ${CALCULATORS.slice(9)
              .map((c) => `<li style="margin-bottom:0.3rem"><a href="/${c.slug}/" style="color:var(--text-muted);text-decoration:none">${esc(c.shortName)}</a></li>`)
              .join('')}
          </ul>
        </div>
        <div>
          <strong style="color:var(--text)">Compare, Guides &amp; Legal</strong>
          <ul style="list-style:none;padding:0;margin:0.5rem 0 0">
            <li style="margin-bottom:0.3rem"><a href="/compare/" style="color:var(--text-muted);text-decoration:none">7-Channel Live Fee Showdown</a></li>
            <li style="margin-bottom:0.3rem"><a href="/templates/" style="color:var(--text-muted);text-decoration:none">2026 Seller Excel Bundles ($0–$24)</a></li>
            <li style="margin-bottom:0.3rem"><a href="/guides/" style="color:var(--text-muted);text-decoration:none">2026 E-Commerce Fee &amp; Tax Guides (${GUIDES.length})</a></li>
            <li style="margin-bottom:0.3rem"><a href="/about/" style="color:var(--text-muted);text-decoration:none">About &amp; 2026 Verification Methodology</a></li>
            <li style="margin-bottom:0.3rem"><a href="/legal/#affiliate-disclosure" style="color:var(--text-muted);text-decoration:none">FTC Affiliate Disclosure</a></li>
            <li style="margin-bottom:0.3rem"><a href="/legal/#privacy" style="color:var(--text-muted);text-decoration:none">Privacy &amp; Terms</a></li>
            <li style="margin-bottom:0.3rem"><a href="/feed.xml" style="color:var(--text-muted);text-decoration:none">RSS Feed</a> • <a href="/llms.txt" style="color:var(--text-muted);text-decoration:none">LLMs.txt</a></li>
          </ul>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:1rem;font-size:0.8rem">
        © 2026 ${esc(SITE_CONFIG.brandName)}. Independent seller toolset audited by <a href="/about/" style="color:inherit">${esc(SITE_CONFIG.founderName || 'ShopMarginLab Research')}</a>; not endorsed by Etsy, Inc., Shopify Inc., Amazon, eBay, Poshmark, Mercari, Depop, Whatnot, or TikTok. Verify final tax figures with a licensed CPA.
      </div>
    </div>
  </footer>
  <script type="module" src="/shared.js?v=6"></script>${
    SITE_CONFIG.cloudflareAnalyticsToken
      ? `\n  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(SITE_CONFIG.cloudflareAnalyticsToken)}"}'></script>`
      : ''
  }`;
}

function buildHead({ title, description, canonicalPath, jsonLd = null }) {
  const fullUrl = `${SITE_CONFIG.domain.replace(/\/$/, '')}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name='impact-site-verification' value='ad2f4c43-e9aa-438e-a3d7-bc3a9de06a18'>${SITE_CONFIG.extraHeadHtml ? `\n  ${SITE_CONFIG.extraHeadHtml}` : ''}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(fullUrl)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="alternate" type="application/rss+xml" title="${esc(SITE_CONFIG.brandName)} 2026 Seller Guides" href="/feed.xml">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(fullUrl)}">
  <meta property="og:image" content="${esc(SITE_CONFIG.domain.replace(/\/$/, ''))}/og-card.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/styles.css?v=6">
  <script>if(location.search.indexOf('embed=1')!==-1)document.documentElement.classList.add('embed-mode');</script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>`;
}

function buildCalculatorPage(calc) {
  const aff = SITE_CONFIG.affiliates[calc.primaryAffiliate];
  const aff2 = SITE_CONFIG.affiliates[calc.secondaryAffiliate];
  const prod = SITE_CONFIG.products[calc.recommendedProduct];
  const freebie = SITE_CONFIG.products.freeCheatSheet;
  const canonicalPath = `/${calc.slug}/`;
  const matchingGuide = GUIDES.find((g) => g.relatedCalcSlug === calc.slug);
  const calcIdx = CALCULATORS.findIndex((c) => c.slug === calc.slug);
  const rotatedCalcs = [...CALCULATORS.slice(calcIdx + 1), ...CALCULATORS.slice(0, calcIdx)];
  const relatedCalcs = [
    ...rotatedCalcs.filter((c) => c.category === calc.category),
    ...rotatedCalcs.filter((c) => c.category !== calc.category)
  ].slice(0, 6);

  const baseUrl = SITE_CONFIG.domain.replace(/\/$/, '');
  const verifiedDate = calc.verifiedDate || SITE_CONFIG.lastReviewedDate || '2026-11-27';
  const founderName = SITE_CONFIG.founderName || 'Nguyen Chi Thanh';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calc.title,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      dateModified: verifiedDate,
      author: { '@type': 'Person', name: founderName, url: `${baseUrl}/about/` },
      publisher: { '@type': 'Organization', name: SITE_CONFIG.brandName, url: `${baseUrl}/` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: calc.metaDescription
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: calc.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_CONFIG.brandName, item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: calc.shortName, item: `${baseUrl}${canonicalPath}` }
      ]
    }
  ];

  const inputsHtml = calc.inputs
    .map((inp) => {
      if (inp.type === 'select') {
        return `
        <div class="field">
          <label for="inp_${inp.id}">${esc(inp.label)}</label>
          <select id="inp_${inp.id}" data-calc-input="${inp.id}">
            ${inp.options.map((o) => `<option value="${esc(o.value)}" ${o.value === inp.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}
          </select>
        </div>`;
      }
      return `
      <div class="field">
        <label for="inp_${inp.id}">${esc(inp.label)}</label>
        <input type="number" id="inp_${inp.id}" data-calc-input="${inp.id}" value="${inp.value}" step="${inp.step || 'any'}" min="${inp.min ?? 0}">
      </div>`;
    })
    .join('');

  return `${buildHead({ title: `${calc.title} | ${SITE_CONFIG.brandName}`, description: calc.metaDescription, canonicalPath, jsonLd })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block: 2rem;">
    <span class="pill">${esc(calc.badge)}</span>
    <h1 style="font-size:clamp(1.75rem,3.6vw,2.5rem);margin-top:0.55rem">${esc(calc.h1)}</h1>
    <p style="color:var(--text-muted);max-inline-size:68ch;font-size:1.05rem">${esc(calc.intro)}</p>
    <div class="byline-meta non-embed-section">
      <span>✓ Verified for 2026 US Fee Schedules</span>
      <span>•</span>
      <span>Updated <time datetime="${esc(verifiedDate)}">${esc(verifiedDate)}</time></span>
      <span>•</span>
      <span>Audited by <a href="/about/">${esc(founderName)}</a></span>
      <span>•</span>
      <a href="#methodology">Formula &amp; Primary Sources ↓</a>
    </div>

    <div class="calc-layout">
      <!-- Left: Inputs -->
      <section class="card" aria-label="Calculator Inputs">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-bottom:1rem">
          <h2 style="font-size:1.15rem;margin:0">1. Enter Your Numbers</h2>
          <button type="button" class="btn btn-secondary btn-sm" id="resetCalcBtn">Reset</button>
        </div>
        <form id="calcForm" onsubmit="return false">
          ${inputsHtml}
        </form>
      </section>

      <!-- Right: Instant Results + Breakdown Table + Viral Share/CSV Toolbar -->
      <section aria-live="polite">
        <div class="result-hero">
          <div id="resPrimaryLabel" style="font-size:0.88rem;color:#cbd5e1;font-weight:600">Net Profit</div>
          <div id="resPrimaryVal" class="result-big" data-tone="positive">$0.00</div>
          <div class="kpi-row" id="resKpiRow"></div>
        </div>

        <div class="card advice-card">
          <div id="resAdviceBanner" class="advice-text"></div>
          <div class="action-strip">
            <a href="${esc(aff.url)}" target="_blank" rel="sponsored noopener" class="btn btn-primary btn-sm">${esc(aff.ctaLabel)}</a>
            <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Free $0 Cheat Sheet →</a>
            <a href="/compare/" class="btn btn-secondary btn-sm">Compare 7 Channels →</a>${
              matchingGuide
                ? `\n            <a href="/guides/${matchingGuide.slug}/" class="btn btn-secondary btn-sm">2026 Fee Guide →</a>`
                : ''
            }
          </div>
        </div>

        <div class="toolbar" style="margin-bottom:1rem">
          <button type="button" class="btn btn-secondary btn-sm" id="copySummaryBtn">📋 Copy Breakdown</button>
          <button type="button" class="btn btn-secondary btn-sm" id="copyShareLinkBtn">🔗 Share Link</button>
          <button type="button" class="btn btn-secondary btn-sm" id="exportCsvBtn">⬇️ CSV</button>
          <button type="button" class="btn btn-secondary btn-sm" id="printPdfBtn">🖨️ Print / PDF</button>
          <button type="button" class="btn btn-secondary btn-sm" id="openEmbedBtn">&lt;/&gt; Embed Free</button>
        </div>

        <div tabindex="0" role="region" aria-labelledby="breakdownCaption" class="table-wrapper">
          <table style="--label-2:'Amount'; --label-3:'Share';">
            <caption id="breakdownCaption">Line-by-Line Fee &amp; Margin Breakdown</caption>
            <thead>
              <tr>
                <th>Cost / Revenue Line</th>
                <th>USD Amount</th>
                <th>% / Note</th>
              </tr>
            </thead>
            <tbody id="resTableBody"></tbody>
          </table>
        </div>

        <div class="embed-footer">
          <span>Powered by <strong>${esc(SITE_CONFIG.brandName)}</strong> (2026 Fee Rates)</span>
          <a href="${esc(SITE_CONFIG.domain.replace(/\/$/, '') + canonicalPath)}" target="_blank" rel="noopener" style="font-weight:700;color:var(--brand-dark)">Open Full Calculator + Free Excel Sheet →</a>
        </div>
      </section>
    </div>

    <!-- Dual Monetization Engine: Contextual Affiliate (Model 1) + Digital Excel Bundle (Model 2) -->
    <section aria-label="Recommended Seller Upgrades" class="monetize-grid">
      <article class="card affiliate-box">
        <span class="pill">${esc(aff.badge)} • Partner Tool</span>
        <h2 style="font-size:1.3rem;margin-top:0.55rem">${esc(aff.headline)}</h2>
        <p style="color:var(--text-muted);font-size:0.93rem">${esc(aff.pitch)}</p>
        <div class="toolbar" style="margin-top:1rem">
          <a href="${esc(aff.url)}" target="_blank" rel="sponsored noopener" class="btn btn-primary">${esc(aff.ctaLabel)}</a>
          <a href="${esc(aff2.url)}" target="_blank" rel="sponsored noopener" class="btn btn-secondary btn-sm">Also see: ${esc(aff2.name)} →</a>
        </div>
      </article>

      <article class="card product-box">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem">
          <span class="pill pill-gold">Instant .XLSX Download</span>
          <div>
            <del style="color:var(--text-muted);font-size:0.9rem">$${prod.originalPriceUsd}</del>
            <strong style="font-size:1.35rem;margin-left:0.3rem">$${prod.priceUsd}</strong>
          </div>
        </div>
        <h2 style="font-size:1.28rem;margin-top:0.55rem">${esc(prod.title)}</h2>
        <ul style="padding-left:1.15rem;font-size:0.9rem;color:var(--text-muted)">
          ${prod.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
        </ul>
        <div class="toolbar" style="margin-top:1rem">
          <a href="${esc(prod.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-accent">Download Excel Bundle ($${prod.priceUsd}) →</a>
          <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Free Cheat Sheet ($0) →</a>
          <button type="button" class="btn btn-secondary btn-sm" id="openSheetPreviewBtn">Preview Tabs Inside</button>
        </div>
      </article>
    </section>

    <!-- Formula Methodology, Worked 2026 Example & Primary Sources (E-E-A-T) -->
    ${
      calc.formulaSummary
        ? `<section id="methodology" class="card non-embed-section" style="margin-block: 2rem;">
      <span class="pill">2026 Verification &amp; Math Transparency</span>
      <h2 style="font-size:1.4rem;margin-top:0.55rem">How ${esc(calc.shortName)} Works (2026 Formula &amp; Worked Example)</h2>
      ${calc.whenToUse ? `<p style="color:var(--text-muted)"><strong>When to use this tool:</strong> ${esc(calc.whenToUse)}</p>` : ''}
      <div class="formula-box"><strong>Exact Formula:</strong> ${esc(calc.formulaSummary)}</div>
      ${
        calc.workedExample
          ? `<h3 style="font-size:1.1rem;margin-top:1rem">${esc(calc.workedExample.title)}</h3>
      <ul style="padding-left:1.2rem;color:var(--text-muted);font-size:0.95rem">
        ${calc.workedExample.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
      </ul>`
          : ''
      }
      ${
        Array.isArray(calc.sources) && calc.sources.length
          ? `<div style="margin-top:1.15rem;padding-top:0.95rem;border-top:1px solid #e2e8f0">
        <strong style="font-size:0.92rem">Primary 2026 Fee Sources Verified on ${esc(verifiedDate)}:</strong>
        <ul class="source-list">
          ${calc.sources.map((s) => `<li>↗ <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join('')}
        </ul>
        <p style="font-size:0.82rem;color:var(--text-muted);margin:0.75rem 0 0">
          Every calculator runs 100% locally in your browser and is mathematically independent of partner links. Read our <a href="/about/#verification-standards" style="color:var(--brand-dark);font-weight:600">5-Step Verification Methodology</a> or report a 2026 fee schedule update to <code>${esc(SITE_CONFIG.supportEmail)}</code>.
        </p>
      </div>`
          : ''
      }
    </section>`
        : ''
    }

    <!-- SEO FAQ & Methodology -->
    <section class="card non-embed-section" style="margin-block: 2rem;">
      <h2 style="font-size:1.4rem">Frequently Asked Questions (${esc(calc.shortName)})</h2>
      <div style="display:grid;gap:1.1rem;margin-top:1rem">
        ${calc.faqs
          .map(
            (f) => `
          <div style="border-bottom:1px solid #e2e8f0;padding-bottom:0.9rem">
            <h3 style="font-size:1.05rem">${esc(f.q)}</h3>
            <p style="color:var(--text-muted);margin-bottom:0">${esc(f.a)}</p>
          </div>`
          )
          .join('')}
      </div>
    </section>

    <!-- Internal SEO Cross-Links -->
    <section class="non-embed-section" style="margin-top:2.5rem">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.75rem">
        <h2 style="font-size:1.3rem;margin:0">Explore More Free 2026 Seller Calculators</h2>
        <a href="/compare/" style="font-weight:700;color:var(--brand-dark);text-decoration:none">Compare All 7 Channels Side-by-Side →</a>
      </div>
      <div class="grid-cards" style="margin-top:1rem">
        ${relatedCalcs
          .map(
            (other) => `
          <a href="/${other.slug}/" class="card" style="text-decoration:none;color:inherit;display:block">
            <span class="pill">${esc(other.badge)}</span>
            <h3 style="font-size:1.08rem;margin-top:0.5rem">${esc(other.shortName)}</h3>
            <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:0">${esc(other.metaDescription)}</p>
          </a>`
          )
          .join('')}
      </div>
    </section>
  </main>

  <!-- Native Embed Code Generator Modal (Passive Backlink Engine) -->
  <dialog id="embedDialog" closedby="any" aria-labelledby="embedDialogTitle">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:0.8rem">
      <div>
        <span class="pill">Free Blogger &amp; Agency Widget</span>
        <h2 id="embedDialogTitle" style="font-size:1.25rem;margin-top:0.4rem">Embed ${esc(calc.shortName)} on Your Site</h2>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" id="closeEmbedBtn" aria-label="Close embed modal">✕</button>
    </div>
    <p style="font-size:0.9rem;color:var(--text-muted)">Copy and paste this responsive HTML snippet into WordPress, Shopify, Webflow, or Ghost to give your readers a live 2026 fee calculator for free:</p>
    <textarea id="embedCodeBox" readonly rows="5" style="inline-size:100%;font-family:ui-monospace,monospace;font-size:0.8rem;padding:0.75rem;border-radius:10px;border:1.5px solid var(--border);background:var(--surface-muted);color:var(--text)"></textarea>
    <div class="toolbar" style="justify-content:flex-end;margin-top:0.9rem">
      <button type="button" class="btn btn-primary btn-sm" id="copyEmbedCodeBtn">📋 Copy Embed HTML</button>
    </div>
  </dialog>

  <!-- Native Light-Dismiss Spreadsheet Preview Modal -->
  <dialog id="sheetPreviewDialog" closedby="any" aria-labelledby="previewDialogTitle">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:0.9rem">
      <div>
        <span class="pill pill-gold">Microsoft Excel &amp; Google Sheets Compatible</span>
        <h2 id="previewDialogTitle" style="font-size:1.25rem;margin-top:0.4rem">Inside ${esc(prod.shortTitle)} ($${prod.priceUsd})</h2>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" id="closeSheetPreviewBtn" aria-label="Close preview">✕</button>
    </div>
    <ol style="padding-left:1.2rem;font-size:0.92rem;color:var(--text-muted)">
      <li><strong>Executive Profit Dashboard:</strong> Automatic 12-month revenue, marketplace fee bleed, ad spend, and net take-home profit rollup.</li>
      <li><strong>Multi-Channel SKU Pricing Matrix:</strong> Compare your exact margin on Etsy, Shopify, and TikTok Shop US side-by-side before running a sale.</li>
      <li><strong>Monthly Order &amp; Payout Log:</strong> Drop your monthly totals and see exact net margins instantly.</li>
      <li><strong>Inventory &amp; Reorder Alert Sheet:</strong> Flags SKUs automatically when units dip below safety stock.</li>
      <li><strong>US IRS Schedule-C Deduction Tracker:</strong> Organize home office, postage, supplies, and software write-offs cleanly for tax season.</li>
    </ol>
    <div class="toolbar" style="justify-content:space-between;margin-top:1.1rem">
      <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Start With $0 Cheat Sheet →</a>
      <a href="${esc(prod.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-accent">Instant Download ($${prod.priceUsd}) →</a>
    </div>
  </dialog>

  <script type="module">
    const fmtUsd = (n) => (n < 0 ? '-$' + Math.abs(n).toFixed(2) : '$' + Number(n).toFixed(2));
    const pct = (part, whole) => (whole > 0 ? ((part / whole) * 100).toFixed(1) + '%' : '0.0%');
    const CALC_NAME = ${JSON.stringify(calc.h1)};
    const CALC_SLUG = ${JSON.stringify(calc.slug)};
    let lastOut = null;

    function compute(v) {
      ${calc.computeFnBody}
    }

    function readInputs() {
      const v = {};
      document.querySelectorAll('[data-calc-input]').forEach((el) => {
        const key = el.getAttribute('data-calc-input');
        const raw = el.value;
        v[key] = el.tagName === 'SELECT' && isNaN(Number(raw)) ? raw : Number(raw || 0);
      });
      return v;
    }

    function applyQueryParams() {
      const params = new URLSearchParams(window.location.search);
      document.querySelectorAll('[data-calc-input]').forEach((el) => {
        const key = el.getAttribute('data-calc-input');
        if (params.has(key)) el.value = params.get(key);
      });
    }

    function runCalc() {
      const v = readInputs();
      const out = compute(v);
      lastOut = out;
      document.getElementById('resPrimaryLabel').textContent = out.primaryLabel;
      const big = document.getElementById('resPrimaryVal');
      big.textContent = out.primaryValue;
      big.setAttribute('data-tone', out.primaryTone || 'positive');

      document.getElementById('resKpiRow').innerHTML = out.kpis
        .map((k) => '<div><div style="font-size:0.78rem;color:#94a3b8">' + k.label + '</div><div style="font-size:1.1rem;font-weight:700;margin-top:0.15rem">' + k.value + '</div></div>')
        .join('');

      document.getElementById('resAdviceBanner').textContent = out.dynamicAdvice;

      document.getElementById('resTableBody').innerHTML = out.rows
        .map((r) => '<tr><th>' + r[0] + '</th><td style="font-weight:700">' + r[1] + '</td><td>' + r[2] + '</td></tr>')
        .join('');
    }

    applyQueryParams();
    document.querySelectorAll('[data-calc-input]').forEach((el) => {
      el.addEventListener('input', runCalc);
      el.addEventListener('change', runCalc);
    });
    runCalc();

    document.getElementById('resetCalcBtn').addEventListener('click', () => {
      document.getElementById('calcForm').reset();
      if (window.location.search) history.replaceState(null, '', window.location.pathname);
      runCalc();
      window.showToast?.('Inputs reset to 2026 defaults');
    });

    document.getElementById('copyShareLinkBtn').addEventListener('click', async () => {
      const params = new URLSearchParams();
      document.querySelectorAll('[data-calc-input]').forEach((el) => {
        params.set(el.getAttribute('data-calc-input'), el.value);
      });
      const shareUrl = window.location.origin + window.location.pathname + '?' + params.toString();
      try {
        await navigator.clipboard.writeText(shareUrl);
        window.showToast?.('Shareable calculator link copied!');
      } catch {
        window.showToast?.(shareUrl);
      }
    });

    document.getElementById('copySummaryBtn').addEventListener('click', async () => {
      if (!lastOut) return;
      const lines = [
        CALC_NAME,
        lastOut.primaryLabel + ': ' + lastOut.primaryValue,
        ...lastOut.rows.map((r) => '- ' + r[0] + ': ' + r[1] + ' (' + r[2] + ')'),
        '',
        'Calculated free at ' + window.location.origin + window.location.pathname
      ];
      try {
        await navigator.clipboard.writeText(lines.join('\\n'));
        window.showToast?.('Profit breakdown copied to clipboard!');
      } catch {
        window.showToast?.('Copy failed — select table text manually');
      }
    });

    document.getElementById('exportCsvBtn').addEventListener('click', () => {
      if (!lastOut) return;
      const csvRows = [
        ['Line Item', 'Amount', 'Share / Note'],
        ...lastOut.rows
      ].map((r) => r.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\\n');
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = CALC_SLUG + '-breakdown.csv';
      a.click();
      URL.revokeObjectURL(a.href);
      window.showToast?.('CSV downloaded! Need 50+ SKUs? Try our Excel OS.');
    });

    document.getElementById('printPdfBtn').addEventListener('click', () => window.print());

    const embedDlg = document.getElementById('embedDialog');
    const embedCodeBox = document.getElementById('embedCodeBox');
    document.getElementById('openEmbedBtn').addEventListener('click', () => {
      const pageUrl = window.location.origin + window.location.pathname;
      embedCodeBox.value =
        '<iframe src="' +
        pageUrl +
        '?embed=1" width="100%" height="680" style="border:1px solid #cbd5e1;border-radius:14px" loading="lazy" title="' +
        CALC_NAME +
        '"></iframe>\\n<p style="font-size:12px;margin-top:6px">Calculator by <a href="' +
        pageUrl +
        '" target="_blank" rel="noopener">ShopMarginLab</a></p>';
      embedDlg.showModal();
    });
    document.getElementById('closeEmbedBtn').addEventListener('click', () => embedDlg.close());
    document.getElementById('copyEmbedCodeBtn').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(embedCodeBox.value);
        window.showToast?.('Embed HTML copied!');
      } catch {
        embedCodeBox.select();
        window.showToast?.('Select and press Ctrl+C to copy');
      }
    });

    const dlg = document.getElementById('sheetPreviewDialog');
    document.getElementById('openSheetPreviewBtn').addEventListener('click', () => dlg.showModal());
    document.getElementById('closeSheetPreviewBtn').addEventListener('click', () => dlg.close());
  </script>
  ${renderFooter()}
</body>
</html>`;
}

function buildComparePage() {
  const shopifyAff = SITE_CONFIG.affiliates.shopify;
  const flagship = SITE_CONFIG.products.flagshipOs;
  const freebie = SITE_CONFIG.products.freeCheatSheet;
  const canonicalPath = '/compare/';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '2026 Multi-Channel Marketplace Fee Showdown (7 Platforms)',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Compare net profit and seller fees side-by-side across Shopify, TikTok Shop US, Etsy, Mercari, Whatnot, eBay, and Poshmark in one live calculator.'
  };

  return `${buildHead({
    title: `2026 7-Channel Marketplace Fee Comparison Calculator | ${SITE_CONFIG.brandName}`,
    description:
      'Enter one price and COGS to compare exact 2026 seller fees and net profit side-by-side across Shopify, TikTok Shop US, Mercari, Etsy, Whatnot, eBay, and Poshmark.',
    canonicalPath,
    jsonLd
  })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block:2.25rem">
    <span class="pill">Interactive 2026 7-Platform Showdown</span>
    <h1 style="font-size:clamp(1.85rem,3.8vw,2.65rem);margin-top:0.55rem">Where Do You Keep the Most Profit? Compare 7 US Sales Channels Live</h1>
    <p style="color:var(--text-muted);max-inline-size:68ch;font-size:1.05rem">
      Type your item price, shipping, and product cost once—instantly rank your net take-home profit across Shopify Basic, TikTok Shop US, Mercari, Etsy US, Whatnot Live, eBay US, and Poshmark.
    </p>

    <section class="card" style="margin-block:1.5rem">
      <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(175px,1fr))">
        <div class="field" style="margin:0">
          <label for="cmpPrice">Item Sale Price ($)</label>
          <input type="number" id="cmpPrice" value="40" step="1" min="1">
        </div>
        <div class="field" style="margin:0">
          <label for="cmpShipBuyer">Buyer-Paid Shipping ($)</label>
          <input type="number" id="cmpShipBuyer" value="5.95" step="0.25" min="0">
        </div>
        <div class="field" style="margin:0">
          <label for="cmpCogs">Product Cost / COGS ($)</label>
          <input type="number" id="cmpCogs" value="11" step="0.5" min="0">
        </div>
        <div class="field" style="margin:0">
          <label for="cmpShipActual">Actual Postage Cost ($)</label>
          <input type="number" id="cmpShipActual" value="5.5" step="0.25" min="0">
        </div>
        <div class="field" style="margin:0">
          <label for="cmpVolume">Monthly Orders (for Annual Diff)</label>
          <input type="number" id="cmpVolume" value="50" step="5" min="1">
        </div>
      </div>
    </section>

    <div class="result-hero" style="margin-bottom:1.5rem">
      <div style="font-size:0.88rem;color:#cbd5e1;font-weight:600">Highest Net Profit Channel At Your Price</div>
      <div id="cmpWinner" class="result-big" data-tone="positive">Shopify Basic</div>
      <div id="cmpSummary" style="color:#e2e8f0;font-size:0.98rem"></div>
    </div>

    <div tabindex="0" role="region" aria-labelledby="cmpCaption" class="table-wrapper">
      <table class="compare-table" style="--label-2:'Fees'; --label-3:'Net Profit'; --label-4:'Margin'; --label-5:'Calculator';">
        <caption id="cmpCaption">2026 Side-by-Side US Platform Fee &amp; Net Profit Ranking</caption>
        <thead>
          <tr>
            <th>Sales Channel (2026 US Rates)</th>
            <th>Platform + Card Fees</th>
            <th>Net Profit / Order</th>
            <th>Profit Margin</th>
            <th>Deep-Dive Tool</th>
          </tr>
        </thead>
        <tbody id="cmpBody"></tbody>
      </table>
    </div>

    <section aria-label="Additional 2026 Channel Comparisons" style="margin-top:1.5rem">
      <div class="grid-cards">
        <article class="card">
          <span class="pill">0% US Selling Fee</span>
          <h2 style="font-size:1.12rem;margin-top:0.5rem">Selling Vintage or Streetwear on Depop?</h2>
          <p style="font-size:0.88rem;color:var(--text-muted)">Depop US charges 0% commission + 3.3% + $0.45 processing (and optional 12% Boosted Listings)—saving $5+ vs. Poshmark on a $38 flip.</p>
          <div class="toolbar">
            <a href="/depop-fee-calculator/" class="btn btn-secondary btn-sm">Depop Calculator →</a>
            <a href="/guides/depop-fees-2026-guide/" class="btn btn-secondary btn-sm">Depop 2026 Guide →</a>
          </div>
        </article>
        <article class="card">
          <span class="pill">Creator % vs. Offsite Ads</span>
          <h2 style="font-size:1.12rem;margin-top:0.5rem">Etsy vs. TikTok Shop US Volume Battle</h2>
          <p style="font-size:0.88rem;color:var(--text-muted)">Compare 60+ monthly orders across Etsy (9.5% + $0.45 + Offsite Ads) and TikTok Shop US (6% referral + 10%–20% creator cuts).</p>
          <div class="toolbar">
            <a href="/etsy-vs-tiktok-shop-calculator/" class="btn btn-secondary btn-sm">Etsy vs. TikTok Calc →</a>
            <a href="/guides/etsy-vs-tiktok-shop-2026-guide/" class="btn btn-secondary btn-sm">Channel Guide →</a>
          </div>
        </article>
        <article class="card">
          <span class="pill">Full Reseller Playbook</span>
          <h2 style="font-size:1.12rem;margin-top:0.5rem">Cross-Listing Strategy Across All Channels</h2>
          <p style="font-size:0.88rem;color:var(--text-muted)">Read our 2026 reseller fee breakdown and see when moving repeat marketplace buyers to Shopify saves thousands.</p>
          <div class="toolbar">
            <a href="/guides/reseller-platform-fees-compared-2026/" class="btn btn-secondary btn-sm">Read Full Breakdown →</a>
          </div>
        </article>
      </div>
    </section>

    <section class="monetize-grid" style="margin-top:2rem">
      <article class="card affiliate-box">
        <span class="pill">${esc(shopifyAff.badge)} • Partner Tool</span>
        <h2 style="font-size:1.28rem;margin-top:0.5rem">${esc(shopifyAff.headline)}</h2>
        <p style="font-size:0.92rem;color:var(--text-muted)">${esc(shopifyAff.pitch)}</p>
        <a href="${esc(shopifyAff.url)}" target="_blank" rel="sponsored noopener" class="btn btn-primary">${esc(shopifyAff.ctaLabel)}</a>
      </article>
      <article class="card product-box">
        <span class="pill pill-gold">Track 50+ SKUs Across Channels</span>
        <h2 style="font-size:1.28rem;margin-top:0.5rem">${esc(flagship.title)} ($${flagship.priceUsd})</h2>
        <p style="font-size:0.92rem;color:var(--text-muted)">Compare all your SKUs side-by-side in Microsoft Excel or Google Sheets with automatic 12-month profit &amp; Schedule-C tax rollups.</p>
        <div class="toolbar">
          <a href="${esc(flagship.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-accent">Get Excel OS ($${flagship.priceUsd}) →</a>
          <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Free Cheat Sheet ($0) →</a>
        </div>
      </article>
    </section>
  </main>

  <script type="module">
    const fmt = (n) => (n < 0 ? '-$' + Math.abs(n).toFixed(2) : '$' + Number(n).toFixed(2));
    function renderCompare() {
      const price = Number(document.getElementById('cmpPrice').value || 0);
      const shipB = Number(document.getElementById('cmpShipBuyer').value || 0);
      const cogs = Number(document.getElementById('cmpCogs').value || 0);
      const shipA = Number(document.getElementById('cmpShipActual').value || 0);
      const vol = Math.max(1, Number(document.getElementById('cmpVolume').value || 50));

      const gross = price + shipB;
      const estTax = gross * 0.07;

      const rows = [
        {
          name: 'Shopify Basic (2.9% + $0.30 + $39/mo amortized)',
          fee: gross * 0.029 + 0.30 + 39 / vol,
          profit: gross - (gross * 0.029 + 0.30 + 39 / vol) - cogs - shipA,
          slug: 'shopify-profit-margin-calculator'
        },
        {
          name: 'TikTok Shop US (6.0% Organic Referral)',
          fee: gross * 0.06,
          profit: gross - gross * 0.06 - cogs - shipA,
          slug: 'tiktok-shop-fee-calculator'
        },
        {
          name: 'Etsy US Organic ($0.20 + 6.5% + 3% + $0.25)',
          fee: 0.45 + gross * 0.095,
          profit: gross - (0.45 + gross * 0.095) - cogs - shipA,
          slug: 'etsy-fee-calculator'
        },
        {
          name: 'Mercari US (10.0% Flat Seller Fee)',
          fee: gross * 0.10,
          profit: price - gross * 0.10 - cogs,
          slug: 'mercari-fee-calculator'
        },
        {
          name: 'Whatnot Live (8% + 2.9% + $0.30 incl. ship & tax)',
          fee: price * 0.08 + (gross + estTax) * 0.029 + 0.30,
          profit: price - (price * 0.08 + (gross + estTax) * 0.029 + 0.30) - cogs,
          slug: 'whatnot-fee-calculator'
        },
        {
          name: 'eBay US No-Store (13.6% incl. ship & tax + $0.40)',
          fee: (gross + estTax) * 0.136 + (gross > 10 ? 0.40 : 0.30),
          profit: gross - ((gross + estTax) * 0.136 + (gross > 10 ? 0.40 : 0.30)) - cogs - shipA,
          slug: 'ebay-fee-calculator'
        },
        {
          name: 'Poshmark US ($2.95 under $15 / 20% over $15)',
          fee: price < 15 ? 2.95 : price * 0.20,
          profit: price - (price < 15 ? 2.95 : price * 0.20) - cogs,
          slug: 'poshmark-fee-calculator'
        }
      ].sort((a, b) => b.profit - a.profit);

      const best = rows[0];
      const worst = rows[rows.length - 1];
      const annualGap = (best.profit - worst.profit) * vol * 12;

      document.getElementById('cmpWinner').textContent = best.name.split(' (')[0] + ' (' + fmt(best.profit) + '/order)';
      document.getElementById('cmpSummary').textContent =
        'At ' + vol + ' orders/month, selling on ' + best.name.split(' (')[0] + ' keeps ' + fmt(best.profit - worst.profit) + ' more per order (' + fmt(annualGap) + '/year!) than ' + worst.name.split(' (')[0] + '.';

      document.getElementById('cmpBody').innerHTML = rows
        .map((r, i) => {
          const margin = gross > 0 ? ((r.profit / gross) * 100).toFixed(1) + '%' : '0.0%';
          const badge = i === 0 ? ' <span class="pill" style="margin-left:0.35rem">#1 Best</span>' : '';
          return '<tr><th>' + r.name + badge + '</th><td>-' + fmt(r.fee) + '</td><td style="font-weight:800;color:' + (r.profit >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + fmt(r.profit) + '</td><td>' + margin + '</td><td><a href="/' + r.slug + '/" style="font-weight:700;color:var(--brand-dark)">Open Tool →</a></td></tr>';
        })
        .join('');
    }
    ['cmpPrice', 'cmpShipBuyer', 'cmpCogs', 'cmpShipActual', 'cmpVolume'].forEach((id) => {
      document.getElementById(id).addEventListener('input', renderCompare);
    });
    renderCompare();
  </script>
  ${renderFooter()}
</body>
</html>`;
}

function buildHomePage() {
  const freebie = SITE_CONFIG.products.freeCheatSheet;
  const flagship = SITE_CONFIG.products.flagshipOs;
  const pod = SITE_CONFIG.products.podMatrix;
  const baseUrl = SITE_CONFIG.domain.replace(/\/$/, '');
  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.brandName,
      url: baseUrl + '/',
      logo: baseUrl + '/favicon.svg'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '2026 Free E-Commerce & Reseller Calculators',
      itemListElement: CALCULATORS.map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: c.title,
        url: `${baseUrl}/${c.slug}/`
      }))
    }
  ];
  return `${buildHead({
    title: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.tagline}`,
    description:
      `${CALCULATORS.length} free 2026 seller fee, profit margin, Amazon FBA, eBay, Poshmark, Mercari, Whatnot, POD, ROAS, and US Schedule-C tax calculators—plus instant Excel profit operating systems.`,
    canonicalPath: '/',
    jsonLd: homeJsonLd
  })}
<body>
  ${renderHeader()}
  <main>
    <section style="padding-block:clamp(2.5rem,6vw,4.5rem);background:radial-gradient(circle at 85% 20%,#ccfbf1 0%,transparent 48%),var(--bg);border-bottom:1px solid var(--border)">
      <div class="container">
        <span class="pill">Updated for 2026 US Marketplace Fee &amp; Tax Schedules</span>
        <h1 style="font-size:clamp(2rem,4.4vw,3.15rem);margin-top:0.65rem;max-inline-size:22ch">
          Know Your Real Net Profit Before You List or Scale Ads.
        </h1>
        <p style="font-size:1.12rem;color:var(--text-muted);max-inline-size:64ch">
          ${CALCULATORS.length} instant, zero-signup calculators for Etsy, Shopify, TikTok Shop US, Amazon FBA, eBay, Poshmark, Mercari, Whatnot &amp; Print-on-Demand sellers—paired with unlocked Excel profit &amp; tax workbooks.
        </p>
        <div class="toolbar" style="margin-top:1.35rem">
          <a href="/compare/" class="btn btn-primary">⚡ Compare 7 Channels Live →</a>
          <a href="/etsy-fee-calculator/" class="btn btn-secondary">2026 Etsy Fee Calculator</a>
          <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary">Free Cheat Sheet ($0)</a>
          <a href="/templates/" class="btn btn-accent">Excel Toolkits ($0–$24)</a>
        </div>
      </div>
    </section>

    <section class="container" style="padding-block:3rem">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem">
        <div>
          <h2 style="font-size:1.65rem;margin-bottom:0.25rem">${CALCULATORS.length} Free 2026 E-Commerce &amp; Reseller Calculators</h2>
          <p id="calcCountLabel" style="color:var(--text-muted);margin:0">Showing all ${CALCULATORS.length} interactive tools — shareable links, CSV export, PDF print &amp; free embed.</p>
        </div>
        <input type="search" id="calcSearch" class="search-input" placeholder="Search Etsy, Amazon, Poshmark, Whatnot, Tax..." aria-label="Search calculators">
      </div>
      <div class="toolbar" role="group" aria-label="Filter calculators by category" style="margin-top:1rem">
        <button type="button" class="filter-chip" data-filter="all" aria-pressed="true">All (${CALCULATORS.length})</button>
        <button type="button" class="filter-chip" data-filter="etsy-pod" aria-pressed="false">Etsy &amp; POD</button>
        <button type="button" class="filter-chip" data-filter="shopify-dtc" aria-pressed="false">Shopify &amp; DTC</button>
        <button type="button" class="filter-chip" data-filter="marketplaces" aria-pressed="false">Amazon, eBay, TikTok &amp; Resellers</button>
        <button type="button" class="filter-chip" data-filter="ads-tax" aria-pressed="false">ROAS &amp; US Tax</button>
      </div>
      <div class="grid-cards" id="calcGrid" style="margin-top:1.35rem">
        ${CALCULATORS.map(
          (c) => `
          <article class="card" data-category="${esc(c.category)}" data-search="${esc((c.shortName + ' ' + c.h1 + ' ' + c.badge + ' ' + c.metaDescription).toLowerCase())}" style="display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <span class="pill">${esc(c.badge)}</span>
              <h3 style="font-size:1.18rem;margin-top:0.6rem">${esc(c.h1)}</h3>
              <p style="color:var(--text-muted);font-size:0.9rem">${esc(c.metaDescription)}</p>
            </div>
            <a href="/${c.slug}/" class="btn btn-secondary btn-sm" style="margin-top:0.8rem;align-self:flex-start">Launch Calculator →</a>
          </article>`
        ).join('')}
      </div>
    </section>

    <section class="container" style="padding-block:0.5rem 2.5rem">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.15rem">
        <h2 style="font-size:1.55rem;margin:0">2026 Seller Fee &amp; Margin Playbooks (${GUIDES.length})</h2>
        <a href="/guides/" style="font-weight:700;color:var(--brand-dark);text-decoration:none">View All ${GUIDES.length} Guides →</a>
      </div>
      <div class="grid-cards">
        ${GUIDES.map(
          (g) => `
          <a href="/guides/${g.slug}/" class="card" style="text-decoration:none;color:inherit;display:block">
            <span class="pill">${esc(g.badge)} • ${esc(g.readTime)}</span>
            <h3 style="font-size:1.1rem;margin-top:0.55rem">${esc(g.title)}</h3>
            <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:0">${esc(g.metaDescription)}</p>
          </a>`
        ).join('')}
      </div>
    </section>

    <section class="container" style="padding-block:1rem 3rem">
      <div class="card" style="background:#0f172a;color:#f8fafc;padding:clamp(1.5rem,4vw,2.5rem)">
        <span class="pill pill-gold">Done-For-You Seller Spreadsheets</span>
        <h2 style="font-size:clamp(1.5rem,3vw,2.1rem);margin-top:0.6rem">Upgrade From Single-Order Checks to a Full 12-Month Profit OS</h2>
        <p style="color:#cbd5e1;max-inline-size:62ch">
          Start free with our $0 2026 Seller Fee &amp; Schedule-C Tax Cheat Sheet—or unlock our 5-tab Excel &amp; Google Sheets Profit OS with live formulas and zero monthly fees.
        </p>
        <div class="monetize-grid" style="margin-bottom:0">
          <div class="card" style="color:var(--text)">
            <span class="pill pill-gold">Best Seller • $${flagship.priceUsd}</span>
            <h3 style="margin-top:0.5rem">${esc(flagship.title)}</h3>
            <ul style="padding-left:1.1rem;font-size:0.9rem;color:var(--text-muted)">
              ${flagship.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
            </ul>
            <a href="${esc(flagship.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Get Flagship Excel OS ($${flagship.priceUsd}) →</a>
          </div>
          <div class="card" style="color:var(--text)">
            <span class="pill">POD Edition • $${pod.priceUsd}</span>
            <h3 style="margin-top:0.5rem">${esc(pod.title)}</h3>
            <ul style="padding-left:1.1rem;font-size:0.9rem;color:var(--text-muted)">
              ${pod.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
            </ul>
            <div class="toolbar">
              <a href="${esc(pod.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Get POD Matrix ($${pod.priceUsd}) →</a>
              <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Free Cheat Sheet ($0) →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <script type="module">
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('#calcGrid [data-category]');
    const searchInput = document.getElementById('calcSearch');
    const countLabel = document.getElementById('calcCountLabel');
    let activeCat = 'all';

    function applyFilters() {
      const q = (searchInput.value || '').trim().toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const matchCat = activeCat === 'all' || card.getAttribute('data-category') === activeCat;
        const matchSearch = !q || (card.getAttribute('data-search') || '').includes(q);
        const visible = matchCat && matchSearch;
        card.style.display = visible ? 'flex' : 'none';
        if (visible) shown++;
      });
      countLabel.textContent = 'Showing ' + shown + ' of ' + cards.length + ' interactive 2026 tools';
    }

    chips.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCat = btn.getAttribute('data-filter');
        chips.forEach((c) => c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'));
        applyFilters();
      });
    });
    searchInput.addEventListener('input', applyFilters);
  </script>
  ${renderFooter()}
</body>
</html>`;
}

function buildTemplatesPage() {
  const { freeCheatSheet, flagshipOs, podMatrix } = SITE_CONFIG.products;
  return `${buildHead({
    title: `2026 E-Commerce Excel Profit & Tax Spreadsheets | ${SITE_CONFIG.brandName}`,
    description:
      'Instant-download Microsoft Excel and Google Sheets profit, inventory, POD pricing, and Schedule-C tax workbooks for Etsy, Shopify, and TikTok Shop sellers.',
    canonicalPath: '/templates/'
  })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block:2.5rem">
    <span class="pill pill-gold">Instant Digital Download (.XLSX)</span>
    <h1 style="font-size:clamp(1.85rem,3.8vw,2.65rem);margin-top:0.55rem">2026 E-Commerce Profit, Inventory &amp; Tax Excel Workbooks</h1>
    <p style="color:var(--text-muted);max-inline-size:64ch;font-size:1.05rem">
      One-time purchase, zero monthly subscriptions. Works immediately in Microsoft Excel, Google Sheets, and Apple Numbers with unlocked live formulas.
    </p>

    <article class="card affiliate-box" style="margin-top:1.75rem">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem">
        <span class="pill">Free Seller Lead Magnet • $0.00</span>
        <strong>100% Free Instant .XLSX Download</strong>
      </div>
      <h2 style="margin-top:0.55rem">${esc(freeCheatSheet.title)}</h2>
      <ul style="padding-left:1.15rem;color:var(--text-muted)">
        ${freeCheatSheet.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
      </ul>
      <a href="${esc(freeCheatSheet.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-primary">Download Free Cheat Sheet ($0) →</a>
    </article>

    <div class="monetize-grid" style="margin-top:1.5rem">
      <article class="card product-box">
        <span class="pill pill-gold">Flagship 5-Tab Bundle • $${flagshipOs.priceUsd}</span>
        <h2 style="margin-top:0.55rem">${esc(flagshipOs.title)}</h2>
        <ul style="padding-left:1.15rem;color:var(--text-muted)">
          ${flagshipOs.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
        </ul>
        <a href="${esc(flagshipOs.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-accent">Buy &amp; Download Instantly ($${flagshipOs.priceUsd}) →</a>
      </article>

      <article class="card">
        <span class="pill">Print-on-Demand Specialist • $${podMatrix.priceUsd}</span>
        <h2 style="margin-top:0.55rem">${esc(podMatrix.title)}</h2>
        <ul style="padding-left:1.15rem;color:var(--text-muted)">
          ${podMatrix.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
        </ul>
        <a href="${esc(podMatrix.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-primary">Buy &amp; Download Instantly ($${podMatrix.priceUsd}) →</a>
      </article>
    </div>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function buildGuidesIndexPage() {
  return `${buildHead({
    title: `2026 E-Commerce Fee, Profit Margin & Tax Guides | ${SITE_CONFIG.brandName}`,
    description:
      'In-depth 2026 guides covering Etsy US fees, Shopify vs. Etsy break-even math, TikTok Shop creator margins, and US IRS Schedule-C seller tax write-offs.',
    canonicalPath: '/guides/'
  })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block:2.5rem">
    <span class="pill">2026 Seller Research &amp; Guides</span>
    <h1 style="font-size:clamp(1.85rem,3.8vw,2.65rem);margin-top:0.55rem">2026 E-Commerce Profit, Fee &amp; Tax Playbooks</h1>
    <p style="color:var(--text-muted);max-inline-size:66ch;font-size:1.05rem">
      Data-backed breakdowns of marketplace fee schedules and pricing formulas—paired with interactive calculators so you can verify every penny for your own store.
    </p>
    <div class="grid-cards" style="margin-top:1.75rem">
      ${GUIDES.map(
        (g) => `
        <article class="card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <span class="pill">${esc(g.badge)} • ${esc(g.readTime)}</span>
            <h2 style="font-size:1.25rem;margin-top:0.6rem">${esc(g.title)}</h2>
            <p style="color:var(--text-muted);font-size:0.93rem">${esc(g.metaDescription)}</p>
          </div>
          <div class="toolbar" style="margin-top:0.85rem">
            <a href="/guides/${g.slug}/" class="btn btn-primary btn-sm">Read Full Guide →</a>
            <a href="/${g.relatedCalcSlug}/" class="btn btn-secondary btn-sm">Open Calculator</a>
          </div>
        </article>`
      ).join('')}
    </div>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function buildGuidePage(guide) {
  const aff = SITE_CONFIG.affiliates[guide.primaryAffiliate];
  const prod = SITE_CONFIG.products[guide.recommendedProduct];
  const freebie = SITE_CONFIG.products.freeCheatSheet;
  const canonicalPath = `/guides/${guide.slug}/`;
  const baseUrl = SITE_CONFIG.domain.replace(/\/$/, '');
  const founderName = SITE_CONFIG.founderName || 'Nguyen Chi Thanh';
  const datePublished = guide.datePublished || '2026-11-10';
  const dateModified = guide.dateModified || SITE_CONFIG.lastReviewedDate || '2026-11-27';
  const guideIdx = GUIDES.findIndex((g) => g.slug === guide.slug);
  const relatedGuides = [...GUIDES.slice(guideIdx + 1), ...GUIDES.slice(0, guideIdx)].slice(0, 3);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.metaDescription,
      datePublished,
      dateModified,
      mainEntityOfPage: `${baseUrl}${canonicalPath}`,
      author: { '@type': 'Person', name: founderName, url: `${baseUrl}/about/` },
      publisher: { '@type': 'Organization', name: SITE_CONFIG.brandName, url: `${baseUrl}/` }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_CONFIG.brandName, item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: '2026 Guides', item: `${baseUrl}/guides/` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: `${baseUrl}${canonicalPath}` }
      ]
    }
  ];

  return `${buildHead({ title: `${guide.title} | ${SITE_CONFIG.brandName}`, description: guide.metaDescription, canonicalPath, jsonLd })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block:2.5rem;max-inline-size:860px">
    <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.75rem">
      <a href="/" style="color:inherit">Home</a> / <a href="/guides/" style="color:inherit">2026 Guides</a>
    </p>
    <span class="pill">${esc(guide.badge)} • ${esc(guide.readTime)}</span>
    <h1 style="font-size:clamp(1.75rem,1rem + 2vw,2.5rem);margin-top:0.55rem">${esc(guide.title)}</h1>
    <p style="font-size:1.08rem;color:var(--text-muted);max-inline-size:68ch">${esc(guide.metaDescription)}</p>
    <div class="byline-meta">
      <span>By <a href="/about/">${esc(founderName)}</a></span>
      <span>•</span>
      <span>Published <time datetime="${esc(datePublished)}">${esc(datePublished)}</time></span>
      <span>•</span>
      <span>Verified <time datetime="${esc(dateModified)}">${esc(dateModified)}</time></span>
      <span>•</span>
      <a href="/about/#verification-standards">Editorial Standards</a>
    </div>

    ${
      Array.isArray(guide.keyTakeaways) && guide.keyTakeaways.length
        ? `<aside class="takeaway-box" aria-label="Key 2026 Takeaways">
      <strong style="display:block;color:var(--brand-dark);margin-bottom:0.45rem">Key 2026 Takeaways</strong>
      <ul style="padding-left:1.15rem;margin:0;color:var(--text);font-size:0.94rem">
        ${guide.keyTakeaways.map((k) => `<li style="margin-bottom:0.35rem">${esc(k)}</li>`).join('')}
      </ul>
    </aside>`
        : ''
    }

    <div class="card affiliate-box" style="margin-block:1.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem">
      <div>
        <strong>Run your exact numbers in 10 seconds:</strong>
        <div style="font-size:0.9rem;color:var(--text-muted)">Interactive 2026 calculator with shareable breakdown &amp; CSV export.</div>
      </div>
      <a href="/${guide.relatedCalcSlug}/" class="btn btn-primary">${esc(guide.relatedCalcLabel)}</a>
    </div>

    ${
      guide.table
        ? `<div tabindex="0" role="region" aria-labelledby="guideTableCaption" class="table-wrapper" style="margin-block:1.5rem">
      <table class="compare-table" style="${guide.table.headers
        .slice(1)
        .map((h, i) => `--label-${i + 2}:'${esc(h)}';`)
        .join(' ')}">
        <caption id="guideTableCaption">${esc(guide.table.caption)}</caption>
        <thead>
          <tr>${guide.table.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${guide.table.rows
            .map(
              (r) =>
                `<tr><th>${esc(r[0])}</th>${r
                  .slice(1)
                  .map((c, idx) => `<td${idx === r.length - 2 ? ' style="font-weight:700"' : ''}>${esc(c)}</td>`)
                  .join('')}</tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`
        : ''
    }

    ${guide.sections
      .map(
        (sec) => `
      <section class="card guide-prose" style="margin-bottom:1.25rem">
        <h2 style="font-size:1.35rem">${esc(sec.heading)}</h2>
        ${sec.paragraphs.map((p) => `<p style="color:var(--text-muted);font-size:0.98rem">${esc(p)}</p>`).join('')}
      </section>`
      )
      .join('')}

    ${
      Array.isArray(guide.sources) && guide.sources.length
        ? `<section class="card" style="margin-bottom:1.5rem;background:var(--surface-muted)">
      <h2 style="font-size:1.15rem">Primary 2026 Sources &amp; Official Fee Documentation</h2>
      <ul class="source-list">
        ${guide.sources.map((s) => `<li>↗ <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join('')}
      </ul>
      <p style="font-size:0.84rem;color:var(--text-muted);margin:0.85rem 0 0">
        <strong>Editorial &amp; Tax Note:</strong> All calculations reflect published 2026 US marketplace rates verified on ${esc(dateModified)} for educational planning only and do not constitute certified accounting or legal advice. See our <a href="/about/" style="color:var(--brand-dark);font-weight:600">About &amp; Verification Methodology</a>.
      </p>
    </section>`
        : ''
    }

    <section class="monetize-grid" aria-label="Next Steps">
      <article class="card affiliate-box">
        <span class="pill">${esc(aff.badge)} • Partner Tool</span>
        <h2 style="font-size:1.22rem;margin-top:0.5rem">${esc(aff.headline)}</h2>
        <p style="font-size:0.9rem;color:var(--text-muted)">${esc(aff.pitch)}</p>
        <a href="${esc(aff.url)}" target="_blank" rel="sponsored noopener" class="btn btn-primary btn-sm">${esc(aff.ctaLabel)}</a>
      </article>
      <article class="card product-box">
        <span class="pill pill-gold">Instant .XLSX Spreadsheets</span>
        <h2 style="font-size:1.22rem;margin-top:0.5rem">Track Every Channel &amp; Tax Write-Off in One Sheet</h2>
        <p style="font-size:0.9rem;color:var(--text-muted)">Grab our $0 2026 Fee &amp; Tax Cheat Sheet or upgrade straight to the 5-Tab Seller Profit OS ($${prod.priceUsd}).</p>
        <div class="toolbar">
          <a href="${esc(freebie.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Free Cheat Sheet ($0) →</a>
          <a href="${esc(prod.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-accent btn-sm">Full Excel OS ($${prod.priceUsd}) →</a>
        </div>
      </article>
    </section>

    <section style="margin-top:2rem">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem">
        <h2 style="font-size:1.3rem;margin:0">More 2026 Seller Fee &amp; Margin Guides</h2>
        <div class="toolbar">
          <a href="/compare/" style="font-weight:700;color:var(--brand-dark);text-decoration:none">Compare 7 Channels →</a>
          <a href="/guides/" style="font-weight:700;color:var(--brand-dark);text-decoration:none">All ${GUIDES.length} Guides →</a>
        </div>
      </div>
      <div class="grid-cards">
        ${relatedGuides
          .map(
            (other) => `
          <a href="/guides/${other.slug}/" class="card" style="text-decoration:none;color:inherit;display:block">
            <span class="pill">${esc(other.badge)} • ${esc(other.readTime)}</span>
            <h3 style="font-size:1.05rem;margin-top:0.5rem">${esc(other.title)}</h3>
            <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0">${esc(other.metaDescription)}</p>
          </a>`
          )
          .join('')}
      </div>
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function buildAboutPage() {
  const baseUrl = SITE_CONFIG.domain.replace(/\/$/, '');
  const founderName = SITE_CONFIG.founderName || 'Nguyen Chi Thanh';
  const founderRole = SITE_CONFIG.founderRole || 'Founder & E-Commerce Unit-Economics Researcher';
  const reviewed = SITE_CONFIG.lastReviewedDate || '2026-11-27';
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: `About ${SITE_CONFIG.brandName} & 2026 Fee Verification Methodology`,
      url: `${baseUrl}/about/`,
      dateModified: reviewed,
      mainEntity: {
        '@type': 'Organization',
        name: SITE_CONFIG.brandName,
        url: `${baseUrl}/`,
        email: SITE_CONFIG.supportEmail,
        founder: {
          '@type': 'Person',
          name: founderName,
          jobTitle: founderRole
        }
      }
    }
  ];

  const primarySources = [
    { name: 'Etsy US Seller Fees & Offsite Ads Policy', url: 'https://help.etsy.com/hc/en-us/articles/360035902374-Beginner-s-Guide-to-Etsy-Fees' },
    { name: 'Shopify Official US Plans & Shopify Payments Rates', url: 'https://www.shopify.com/pricing' },
    { name: 'TikTok Shop US Seller Academy — Referral & Refund Fees', url: 'https://seller-us.tiktok.com/university/essay?knowledge_id=6837887923128065' },
    { name: 'Amazon Seller Central — US Referral & FBA Pricing', url: 'https://sell.amazon.com/pricing' },
    { name: 'eBay US Help Center — Final Value Fees & Store Discounts', url: 'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822' },
    { name: 'Poshmark Support — US Commission & Shipping Policies', url: 'https://support.poshmark.com/s/article/810758272' },
    { name: 'Mercari US Help Center — 10% Flat Seller Fee Schedule', url: 'https://www.mercari.com/us/help_center/article/169/' },
    { name: 'Depop Help Center — US 0% Commission & Payments Processing', url: 'https://depophelp.zendesk.com/hc/en-us/articles/360001791127-Selling-fees' },
    { name: 'Whatnot Help Center — Official US Seller Fee Tiers', url: 'https://help.whatnot.com/hc/en-us/articles/4407962164621-Whatnot-Seller-Fees' },
    { name: 'Printify & Printful Official POD Blank Pricing', url: 'https://printify.com/pricing/' },
    { name: 'IRS — Schedule C (Form 1040) & Self-Employment Tax Guidance', url: 'https://www.irs.gov/forms-pubs/about-schedule-c-form-1040' }
  ];

  return `${buildHead({
    title: `About ${SITE_CONFIG.brandName} — 2026 Fee Verification Methodology & Editorial Policy`,
    description:
      'Learn who builds ShopMarginLab, how every 2026 US marketplace fee calculator is verified against official schedules, our automated math testing, and FTC independence standards.',
    canonicalPath: '/about/',
    jsonLd
  })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block:2.5rem;max-inline-size:860px">
    <span class="pill">Independent Research • Verified ${esc(reviewed)}</span>
    <h1 style="font-size:clamp(1.85rem,3.8vw,2.65rem);margin-top:0.55rem">About ${esc(SITE_CONFIG.brandName)} &amp; Our 2026 Verification Methodology</h1>
    <p style="font-size:1.06rem;color:var(--text-muted);max-inline-size:68ch">
      ${esc(SITE_CONFIG.brandName)} was built to solve one recurring problem for independent US e-commerce sellers, Print-on-Demand creators, and resellers: headline marketplace fees almost never match what actually disappears from your payout statement.
    </p>

    <section class="card" style="margin-top:1.5rem">
      <h2 style="font-size:1.35rem">1. Who Builds and Maintains ShopMarginLab</h2>
      <p style="color:var(--text-muted)">
        ${esc(SITE_CONFIG.brandName)} is founded and maintained by <strong>${esc(founderName)}</strong> (${esc(founderRole)}). Every calculator, multi-channel comparison model, and unlocked Excel workbook is authored specifically for small-business unit economics—focusing on the real edge cases that silently drain margin: fees applied to buyer-paid shipping and state sales tax, mandatory Etsy Offsite Ads thresholds, TikTok creator affiliate stacking, and US Schedule-C tax set-asides.
      </p>
      <p style="color:var(--text-muted);margin-bottom:0">
        Have a correction, fee update, or feature request? Email us directly at <code>${esc(SITE_CONFIG.supportEmail)}</code>. We audit reported marketplace schedule changes within 72 hours.
      </p>
    </section>

    <section id="verification-standards" class="card" style="margin-top:1.25rem">
      <h2 style="font-size:1.35rem">2. Our 5-Step 2026 Fee Verification Process</h2>
      <ol style="padding-left:1.25rem;color:var(--text-muted);font-size:0.96rem">
        <li><strong>Primary Documentation Audit:</strong> Every rate is checked directly against official US marketplace fee schedules and IRS Schedule-C publications (listed below), never copied blindly from outdated blog posts.</li>
        <li><strong>Tax &amp; Shipping Fee-Basis Normalization:</strong> We explicitly model platform-specific nuances—such as eBay, Whatnot, and Depop applying processing/FVF percentages to state sales tax, versus Poshmark charging strictly on item sale price.</li>
        <li><strong>Automated Zero-NaN Formula Testing:</strong> Before any deployment goes live, our automated test suite executes every JavaScript calculation function across default inputs and every dropdown tier to confirm zero broken formulas or edge-case errors.</li>
        <li><strong>100% Client-Side Privacy:</strong> All calculator math executes locally inside your browser. Your store prices, COGS, and revenue figures are never sent to or stored on our servers.</li>
        <li><strong>Transparent Scope &amp; YMYL Boundaries:</strong> Our US Schedule-C tax estimators and financial workbooks are strictly for cash-flow planning and education—we clearly note where sellers should consult a licensed CPA (e.g., S-Corp elections, inventory accounting methods, or multi-state sales tax nexus).</li>
      </ol>
    </section>

    <section class="card" style="margin-top:1.25rem">
      <h2 style="font-size:1.35rem">3. Editorial Independence &amp; How We Keep Tools Free</h2>
      <p style="color:var(--text-muted)">
        All ${CALCULATORS.length} interactive calculators and ${GUIDES.length} playbooks are 100% free with zero signup walls or paywalled results. To fund ongoing maintenance and hosting, ${esc(SITE_CONFIG.brandName)} earns revenue from two clearly disclosed sources: (1) optional digital Excel/Google Sheets templates on Gumroad, and (2) clearly labeled affiliate links (marked <code>rel="sponsored"</code>) for seller tools like Shopify, Printify, and Link My Books.
      </p>
      <p style="color:var(--text-muted);margin-bottom:0">
        <strong>Strict Math Independence:</strong> No affiliate partner can pay to alter a fee rate, hide a subscription cost, or manipulate ranking order inside our <a href="/compare/" style="color:var(--brand-dark);font-weight:600">7-Channel Live Fee Comparison</a>. Read our full <a href="/legal/#affiliate-disclosure" style="color:var(--brand-dark);font-weight:600">FTC Affiliate Disclosure &amp; Terms</a>.
      </p>
    </section>

    <section class="card" style="margin-top:1.25rem">
      <h2 style="font-size:1.35rem">4. Primary 2026 Fee &amp; Tax Sources Directory</h2>
      <p style="color:var(--text-muted);font-size:0.94rem">Last full schedule verification: <strong>${esc(reviewed)}</strong></p>
      <ul class="source-list">
        ${primarySources.map((s) => `<li>↗ <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a></li>`).join('')}
      </ul>
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function buildLegalPage() {
  return `${buildHead({
    title: `FTC Affiliate Disclosure, Privacy & Terms | ${SITE_CONFIG.brandName}`,
    description: `FTC Affiliate Disclosure, Privacy Policy, and Digital Product Terms of Use for ${SITE_CONFIG.brandName}.`,
    canonicalPath: '/legal/'
  })}
<body>
  ${renderHeader()}
  <main class="container" style="padding-block:2.5rem;max-inline-size:820px">
    <h1>Legal, Privacy &amp; FTC Affiliate Disclosure</h1>
    <section id="affiliate-disclosure" class="card" style="margin-top:1.5rem">
      <h2>1. FTC Affiliate Disclosure</h2>
      <p>
        In compliance with Federal Trade Commission (FTC) guidelines, please note that ${esc(SITE_CONFIG.brandName)} participates in partner and affiliate marketing programs (including e-commerce storefront, print-on-demand, and bookkeeping software partners). When you click partner links marked on our calculator pages and register or subscribe, we may receive a referral commission at <strong>zero additional cost to you</strong>. Our calculator formulas remain 100% objective and mathematically independent.
      </p>
    </section>
    <section id="privacy" class="card" style="margin-top:1.25rem">
      <h2>2. Zero-Tracking Calculator Privacy</h2>
      <p>
        All numbers entered into our fee and margin calculators are computed 100% locally inside your web browser—we never transmit or store your private store revenue, COGS, or SKU pricing on our servers.
      </p>
    </section>
    <section id="terms" class="card" style="margin-top:1.25rem">
      <h2>3. Digital Spreadsheet Terms &amp; Disclaimer</h2>
      <p>
        Our downloadable Excel workbooks and web calculators are provided for educational financial planning purposes only and do not constitute certified accounting, legal, or tax advice. Digital template purchases include single-business license usage. Contact <code>${esc(SITE_CONFIG.supportEmail)}</code> for customer support.
      </p>
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

// Build entire static site
mkdirSync(DIST_DIR, { recursive: true });
writeFileSync(join(DIST_DIR, 'styles.css'), CSS_CONTENT, 'utf8');
writeFileSync(join(DIST_DIR, 'shared.js'), SHARED_JS, 'utf8');
writeFileSync(join(DIST_DIR, 'index.html'), buildHomePage(), 'utf8');

mkdirSync(join(DIST_DIR, 'compare'), { recursive: true });
writeFileSync(join(DIST_DIR, 'compare', 'index.html'), buildComparePage(), 'utf8');

mkdirSync(join(DIST_DIR, 'templates'), { recursive: true });
writeFileSync(join(DIST_DIR, 'templates', 'index.html'), buildTemplatesPage(), 'utf8');

mkdirSync(join(DIST_DIR, 'guides'), { recursive: true });
writeFileSync(join(DIST_DIR, 'guides', 'index.html'), buildGuidesIndexPage(), 'utf8');
for (const guide of GUIDES) {
  const gdir = join(DIST_DIR, 'guides', guide.slug);
  mkdirSync(gdir, { recursive: true });
  writeFileSync(join(gdir, 'index.html'), buildGuidePage(guide), 'utf8');
}

mkdirSync(join(DIST_DIR, 'about'), { recursive: true });
writeFileSync(join(DIST_DIR, 'about', 'index.html'), buildAboutPage(), 'utf8');

mkdirSync(join(DIST_DIR, 'legal'), { recursive: true });
writeFileSync(join(DIST_DIR, 'legal', 'index.html'), buildLegalPage(), 'utf8');

for (const calc of CALCULATORS) {
  const dir = join(DIST_DIR, calc.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildCalculatorPage(calc), 'utf8');
}

// Favicon & OpenGraph Social Card
writeFileSync(
  join(DIST_DIR, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0d9488"/>
  <path d="M16 42l10-12 9 7 13-17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  'utf8'
);

writeFileSync(
  join(DIST_DIR, 'og-card.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f172a"/>
  <circle cx="1040" cy="110" r="230" fill="#0d9488" opacity="0.35"/>
  <text x="80" y="140" font-family="system-ui, sans-serif" font-size="36" font-weight="800" fill="#5eead4">${esc(SITE_CONFIG.brandName)}</text>
  <text x="80" y="260" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#ffffff">${CALCULATORS.length} Free 2026 E-Commerce &amp;</text>
  <text x="80" y="335" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#ffffff">Reseller Profit Calculators</text>
  <text x="80" y="420" font-family="system-ui, sans-serif" font-size="25" fill="#cbd5e1">Etsy • Shopify • Amazon FBA • eBay • Poshmark • Mercari • Depop • Whatnot • TikTok</text>
</svg>`,
  'utf8'
);

// IndexNow Verification Key File (instant Bing / DuckDuckGo / Yandex / Seznam indexing)
if (SITE_CONFIG.indexNowKey) {
  writeFileSync(join(DIST_DIR, `${SITE_CONFIG.indexNowKey}.txt`), SITE_CONFIG.indexNowKey, 'utf8');
}

// Sitemap, Robots.txt, llms.txt (AI Search Discovery), and RSS feed.xml
const base = SITE_CONFIG.domain.replace(/\/$/, '');
const allPaths = [
  '/',
  '/compare/',
  '/templates/',
  '/guides/',
  '/about/',
  '/legal/',
  ...CALCULATORS.map((c) => `/${c.slug}/`),
  ...GUIDES.map((g) => `/guides/${g.slug}/`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths.map((p) => `  <url><loc>${esc(base + p)}</loc><priority>${p === '/' ? '1.0' : p === '/compare/' ? '0.95' : '0.85'}</priority></url>`).join('\n')}
</urlset>`;

writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(
  join(DIST_DIR, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
  'utf8'
);

const llmsTxt = [
  `# ${SITE_CONFIG.brandName}`,
  `> ${SITE_CONFIG.tagline}. Free browser-based 2026 US marketplace fee calculators, multi-channel profit comparison, and unlocked Excel seller workbooks.`,
  '',
  '## Interactive Multi-Channel Comparison & Methodology',
  `- [7-Channel Live Fee Showdown](${base}/compare/): Compare net profit across Shopify, TikTok Shop US, Etsy, Mercari, Whatnot, eBay, and Poshmark simultaneously.`,
  `- [About & 2026 Verification Methodology](${base}/about/): Editorial standards, 5-step fee verification workflow, and official primary sources.`,
  '',
  `## Free 2026 Interactive Calculators (${CALCULATORS.length})`,
  ...CALCULATORS.map((c) => `- [${c.title}](${base}/${c.slug}/): ${c.metaDescription}`),
  '',
  `## 2026 Seller Fee & Tax Playbooks (${GUIDES.length})`,
  ...GUIDES.map((g) => `- [${g.title}](${base}/guides/${g.slug}/): ${g.metaDescription}`),
  '',
  '## Unlocked Excel & Google Sheets Seller Workbooks',
  `- [All Templates ($0–$24)](${base}/templates/)`,
  `- Free 2026 US Seller Fee & Schedule-C Tax Cheat Sheet ($0): ${SITE_CONFIG.products.freeCheatSheet.checkoutUrl}`,
  `- 2026 Multi-Channel Seller Profit, Inventory & Tax Excel OS ($24): ${SITE_CONFIG.products.flagshipOs.checkoutUrl}`,
  `- 2026 POD & Etsy Bulk Pricing Matrix ($17): ${SITE_CONFIG.products.podMatrix.checkoutUrl}`
].join('\n');
writeFileSync(join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf8');

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(SITE_CONFIG.brandName)} — 2026 E-Commerce Fee &amp; Profit Guides</title>
    <link>${esc(base)}/</link>
    <description>${esc(SITE_CONFIG.tagline)}</description>
    <language>en-us</language>
    <item>
      <title>Interactive 7-Channel Marketplace Fee Showdown (2026)</title>
      <link>${esc(base)}/compare/</link>
      <guid>${esc(base)}/compare/</guid>
      <description>Compare Shopify, TikTok Shop US, Etsy, Mercari, Whatnot, eBay, and Poshmark fees side-by-side in one live calculator.</description>
    </item>
${GUIDES.map(
  (g) => `    <item>
      <title>${esc(g.title)}</title>
      <link>${esc(base)}/guides/${g.slug}/</link>
      <guid>${esc(base)}/guides/${g.slug}/</guid>
      <description>${esc(g.metaDescription)}</description>
    </item>`
).join('\n')}
  </channel>
</rss>`;
writeFileSync(join(DIST_DIR, 'feed.xml'), feedXml, 'utf8');

console.log(`✅ Built ${allPaths.length} static SEO pages (${CALCULATORS.length} calculators + ${GUIDES.length} guides + /compare/ + llms.txt + feed.xml) into ${DIST_DIR}`);
