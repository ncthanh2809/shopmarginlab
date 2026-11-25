import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from './site-config.mjs';
import { CALCULATORS } from './calculators-data.mjs';

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
  gap: 0.6rem;
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
  font-size: 0.9rem;
  padding: 0.35rem 0.65rem;
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
  padding: 0.42rem 0.8rem;
  font-size: 0.84rem;
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

.hint {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-block-end: 0.3rem;
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

.error-msg {
  display: none;
  color: var(--danger);
  font-size: 0.84rem;
  margin-block-start: 0.3rem;
}

:is(:user-invalid, .user-invalid-fallback) {
  border-color: var(--danger) !important;
  background-color: var(--danger-bg) !important;
}

:is(:user-invalid, .user-invalid-fallback) + .error-msg {
  display: block;
}

.result-hero {
  background: #0f172a;
  color: #f8fafc;
  border-radius: var(--radius-md);
  padding: 1.35rem;
  margin-block-end: 1.15rem;
}

.result-big {
  font-size: clamp(2rem, 4vw, 2.65rem);
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
}

dialog {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: clamp(1.25rem, 3vw, 1.8rem);
  max-inline-size: min(560px, calc(100vw - 2rem));
  inline-size: 100%;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-md);
}

dialog::backdrop {
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
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
`;

const SHARED_JS = `
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

// Accessible form error sync per validate-input-after-interaction guide
(() => {
  const linkError = (el, shown) => {
    const errorId = el.dataset?.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '').split(/\\s+/).filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };
  document.querySelectorAll('input[data-error]').forEach((el) => {
    el.setAttribute('aria-invalid', 'false');
    el.addEventListener('blur', () => {
      const bad = !el.validity.valid;
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      linkError(el, bad);
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true' && el.validity.valid) {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
      }
    });
  });
})();
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
      <nav aria-label="Calculator Navigation">
        <ul class="nav-list">
          ${CALCULATORS.slice(0, 4)
            .map((c) => `<li><a href="/${c.slug}/">${esc(c.shortName)}</a></li>`)
            .join('')}
          <li><a href="/templates/"><strong>📊 Excel Profit Bundles</strong></a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div style="display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:1.5rem">
        <div>
          <strong style="color:var(--text);font-size:1rem">${esc(SITE_CONFIG.brandName)}</strong>
          <p style="margin-top:0.4rem">Free, ultra-accurate 2026 fee &amp; margin calculators plus spreadsheet operating systems for Etsy, Shopify, POD, and TikTok Shop sellers.</p>
        </div>
        <div>
          <strong style="color:var(--text)">Free Seller Calculators</strong>
          <ul style="list-style:none;padding:0;margin:0.5rem 0 0">
            ${CALCULATORS.map((c) => `<li style="margin-bottom:0.35rem"><a href="/${c.slug}/" style="color:var(--text-muted);text-decoration:none">${esc(c.shortName)}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <strong style="color:var(--text)">Spreadsheets &amp; Legal</strong>
          <ul style="list-style:none;padding:0;margin:0.5rem 0 0">
            <li style="margin-bottom:0.35rem"><a href="/templates/" style="color:var(--text-muted);text-decoration:none">2026 Seller Excel Bundles ($17–$24)</a></li>
            <li style="margin-bottom:0.35rem"><a href="/legal/#affiliate-disclosure" style="color:var(--text-muted);text-decoration:none">FTC Affiliate Disclosure</a></li>
            <li style="margin-bottom:0.35rem"><a href="/legal/#privacy" style="color:var(--text-muted);text-decoration:none">Privacy &amp; Terms</a></li>
          </ul>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:1rem;font-size:0.8rem">
        © 2026 ${esc(SITE_CONFIG.brandName)}. Independent seller toolset; not endorsed by Etsy, Inc., Shopify Inc., or TikTok. Verify final tax figures with a licensed CPA.
      </div>
    </div>
  </footer>
  <script type="module" src="/shared.js"></script>`;
}

function buildHead({ title, description, canonicalPath, jsonLd = null }) {
  const fullUrl = `${SITE_CONFIG.domain.replace(/\/$/, '')}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(fullUrl)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(fullUrl)}">
  <meta property="og:image" content="${esc(SITE_CONFIG.domain.replace(/\/$/, ''))}/og-card.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/styles.css">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>`;
}

function buildCalculatorPage(calc) {
  const aff = SITE_CONFIG.affiliates[calc.primaryAffiliate];
  const aff2 = SITE_CONFIG.affiliates[calc.secondaryAffiliate];
  const prod = SITE_CONFIG.products[calc.recommendedProduct];
  const canonicalPath = `/${calc.slug}/`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calc.title,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
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

    <div class="calc-layout">
      <!-- Left: Inputs -->
      <section class="card" aria-label="Calculator Inputs">
        <h2 style="font-size:1.15rem;margin-bottom:1rem">1. Enter Your Order Numbers</h2>
        <form id="calcForm" onsubmit="return false">
          ${inputsHtml}
        </form>
      </section>

      <!-- Right: Instant Results + Breakdown Table -->
      <section aria-live="polite">
        <div class="result-hero">
          <div id="resPrimaryLabel" style="font-size:0.88rem;color:#cbd5e1;font-weight:600">Net Profit</div>
          <div id="resPrimaryVal" class="result-big" data-tone="positive">$0.00</div>
          <div class="kpi-row" id="resKpiRow"></div>
        </div>

        <div id="resAdviceBanner" class="card" style="margin-bottom:1.1rem;background:#f0fdfa;border-color:#99f6e4;font-size:0.92rem;font-weight:600;color:#115e59"></div>

        <div tabindex="0" role="region" aria-labelledby="breakdownCaption" class="table-wrapper">
          <table style="--label-2:'Amount'; --label-3:'Share';">
            <caption id="breakdownCaption">Line-by-Line Fee &amp; Margin Breakdown</caption>
            <thead>
              <tr>
                <th>Cost / Revenue Line</th>
                <th>USD Amount</th>
                <th>% of Gross</th>
              </tr>
            </thead>
            <tbody id="resTableBody"></tbody>
          </table>
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
          <button type="button" class="btn btn-secondary btn-sm" id="openSheetPreviewBtn">Preview 5 Tabs Inside</button>
        </div>
      </article>
    </section>

    <!-- SEO FAQ & Methodology -->
    <section class="card" style="margin-block: 2rem;">
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

    <!-- Internal SEO Cross-Links to Other Calculators -->
    <section style="margin-top:2.5rem">
      <h2 style="font-size:1.3rem">Explore More Free 2026 Seller Calculators</h2>
      <div class="grid-cards" style="margin-top:1rem">
        ${CALCULATORS.filter((c) => c.slug !== calc.slug)
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

  <!-- Native Light-Dismiss Spreadsheet Preview Modal -->
  <dialog id="sheetPreviewDialog" closedby="any" aria-labelledby="previewDialogTitle">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:0.9rem">
      <div>
        <span class="pill pill-gold">Microsoft Excel &amp; Google Sheets Compatible</span>
        <h2 id="previewDialogTitle" style="font-size:1.25rem;margin-top:0.4rem">What's Inside ${esc(prod.shortTitle)} ($${prod.priceUsd})</h2>
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
    <div class="toolbar" style="justify-content:flex-end;margin-top:1.1rem">
      <a href="${esc(prod.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-accent">Instant Download ($${prod.priceUsd}) →</a>
    </div>
  </dialog>

  <script type="module">
    const fmtUsd = (n) => (n < 0 ? '-$' + Math.abs(n).toFixed(2) : '$' + Number(n).toFixed(2));
    const pct = (part, whole) => (whole > 0 ? ((part / whole) * 100).toFixed(1) + '%' : '0.0%');

    function compute(v) {
      ${calc.computeFnBody}
    }

    function runCalc() {
      const v = {};
      document.querySelectorAll('[data-calc-input]').forEach((el) => {
        v[el.getAttribute('data-calc-input')] = Number(el.value || 0);
      });
      const out = compute(v);
      document.getElementById('resPrimaryLabel').textContent = out.primaryLabel;
      const big = document.getElementById('resPrimaryVal');
      big.textContent = out.primaryValue;
      big.setAttribute('data-tone', out.primaryTone || 'positive');

      document.getElementById('resKpiRow').innerHTML = out.kpis
        .map((k) => '<div><div style="font-size:0.78rem;color:#94a3b8">' + k.label + '</div><div style="font-size:1.12rem;font-weight:700;margin-top:0.15rem">' + k.value + '</div></div>')
        .join('');

      document.getElementById('resAdviceBanner').textContent = out.dynamicAdvice;

      document.getElementById('resTableBody').innerHTML = out.rows
        .map((r) => '<tr><th>' + r[0] + '</th><td style="font-weight:700">' + r[1] + '</td><td>' + r[2] + '</td></tr>')
        .join('');
    }

    document.querySelectorAll('[data-calc-input]').forEach((el) => el.addEventListener('input', runCalc));
    runCalc();

    const dlg = document.getElementById('sheetPreviewDialog');
    document.getElementById('openSheetPreviewBtn').addEventListener('click', () => dlg.showModal());
    document.getElementById('closeSheetPreviewBtn').addEventListener('click', () => dlg.close());
  </script>
  ${renderFooter()}
</body>
</html>`;
}

function buildHomePage() {
  const flagship = SITE_CONFIG.products.flagshipOs;
  const pod = SITE_CONFIG.products.podMatrix;
  return `${buildHead({
    title: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.tagline}`,
    description:
      'Free 2026 seller fee, profit margin, POD, and Break-Even ROAS calculators for Etsy, Shopify, and TikTok Shop US sellers—plus instant Excel profit operating systems.',
    canonicalPath: '/'
  })}
<body>
  ${renderHeader()}
  <main>
    <section style="padding-block:clamp(2.5rem,6vw,4.5rem);background:radial-gradient(circle at 85% 20%,#ccfbf1 0%,transparent 48%),var(--bg);border-bottom:1px solid var(--border)">
      <div class="container">
        <span class="pill">Updated for 2026 US Marketplace Fee Schedules</span>
        <h1 style="font-size:clamp(2rem,4.4vw,3.15rem);margin-top:0.65rem;max-inline-size:22ch">
          Know Your Real Net Profit Before You List or Scale Ads.
        </h1>
        <p style="font-size:1.12rem;color:var(--text-muted);max-inline-size:60ch">
          Instant, zero-signup calculators for Etsy, Shopify, Print-on-Demand, and TikTok Shop US sellers—paired with ready-to-use Excel profit &amp; tax workbooks.
        </p>
        <div class="toolbar" style="margin-top:1.35rem">
          <a href="/etsy-fee-calculator/" class="btn btn-primary">Open 2026 Etsy Fee Calculator →</a>
          <a href="/shopify-vs-etsy-calculator/" class="btn btn-secondary">Compare Shopify vs. Etsy Fees</a>
          <a href="/templates/" class="btn btn-accent">Browse Excel Toolkits ($17–$24)</a>
        </div>
      </div>
    </section>

    <section class="container" style="padding-block:3rem">
      <h2 style="font-size:1.65rem">6 Free Seller Profit &amp; Fee Calculators</h2>
      <p style="color:var(--text-muted)">Pick any tool below to run live margin math on mobile or desktop.</p>
      <div class="grid-cards" style="margin-top:1.25rem">
        ${CALCULATORS.map(
          (c) => `
          <article class="card" style="display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <span class="pill">${esc(c.badge)}</span>
              <h3 style="font-size:1.22rem;margin-top:0.6rem">${esc(c.h1)}</h3>
              <p style="color:var(--text-muted);font-size:0.92rem">${esc(c.metaDescription)}</p>
            </div>
            <a href="/${c.slug}/" class="btn btn-secondary btn-sm" style="margin-top:0.8rem;align-self:flex-start">Launch Calculator →</a>
          </article>`
        ).join('')}
      </div>
    </section>

    <section class="container" style="padding-block:1rem 3rem">
      <div class="card" style="background:#0f172a;color:#f8fafc;padding:clamp(1.5rem,4vw,2.5rem)">
        <span class="pill pill-gold">Done-For-You Seller Spreadsheets</span>
        <h2 style="font-size:clamp(1.5rem,3vw,2.1rem);margin-top:0.6rem">Upgrade From Single-Order Checks to a Full 12-Month Profit OS</h2>
        <p style="color:#cbd5e1;max-inline-size:62ch">
          Download our pre-built Microsoft Excel &amp; Google Sheets workbooks to track multi-SKU landed COGS, inventory reorder points, and US Schedule-C tax deductions in one place.
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
            <a href="${esc(pod.checkoutUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Get POD Pricing Matrix ($${pod.priceUsd}) →</a>
          </div>
        </div>
      </div>
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function buildTemplatesPage() {
  const { flagshipOs, podMatrix } = SITE_CONFIG.products;
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
      One-time purchase, zero monthly subscriptions. Works immediately in Microsoft Excel, Google Sheets, and Apple Numbers with unlocked formulas.
    </p>

    <div class="monetize-grid" style="margin-top:2rem">
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

mkdirSync(join(DIST_DIR, 'templates'), { recursive: true });
writeFileSync(join(DIST_DIR, 'templates', 'index.html'), buildTemplatesPage(), 'utf8');

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
  <text x="80" y="260" font-family="system-ui, sans-serif" font-size="60" font-weight="800" fill="#ffffff">2026 E-Commerce Fee,</text>
  <text x="80" y="335" font-family="system-ui, sans-serif" font-size="60" font-weight="800" fill="#ffffff">ROAS &amp; Profit Calculators</text>
  <text x="80" y="420" font-family="system-ui, sans-serif" font-size="28" fill="#cbd5e1">Etsy • Shopify • TikTok Shop US • Print-on-Demand • Excel Profit OS</text>
</svg>`,
  'utf8'
);

// Sitemap & Robots.txt
const base = SITE_CONFIG.domain.replace(/\/$/, '');
const allPaths = ['/', '/templates/', '/legal/', ...CALCULATORS.map((c) => `/${c.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths.map((p) => `  <url><loc>${esc(base + p)}</loc><priority>${p === '/' ? '1.0' : '0.85'}</priority></url>`).join('\n')}
</urlset>`;

writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(DIST_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`, 'utf8');

console.log(`✅ Built ${allPaths.length} static SEO pages into ${DIST_DIR}`);
