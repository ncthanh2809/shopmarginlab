/**
 * Automated Pinterest Vertical Pin Pack (1000x1500) + SEO Copy Generator
 * Generates 6 vertical infographic SVG Pins + ready-to-post Titles, SEO Descriptions & Destination URLs.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PINS_DIR = join(__dirname, '..', 'products', 'dist', 'pins');
mkdirSync(PINS_DIR, { recursive: true });

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const PIN_HOOKS = {
  'etsy-fee-calculator': {
    topPill: '2026 ETSY SELLER MATH',
    line1: 'How Much Does',
    line2: 'Etsy REALLY Take',
    line3: 'From a $35 Order?',
    bullets: ['• $0.20 Listing + 6.5% Shipping & Item', '• 3% + $0.25 Payment Processing', '• 12%–15% Offsite Ads Trap Explained'],
    cta: 'Use the Free 2026 Etsy Calculator →'
  },
  'shopify-vs-etsy-calculator': {
    topPill: 'ETSY VS SHOPIFY 2026',
    line1: 'At Exactly How Many',
    line2: 'Orders Is Shopify',
    line3: 'Cheaper Than Etsy?',
    bullets: ['• Hint: Just ~14 Orders/Mo ($40 AOV)!', '• 0% Marketplace Transaction Fee', '• Calculate Your Annual Savings Live'],
    cta: 'Run Side-by-Side Fee Comparison →'
  },
  'tiktok-shop-fee-calculator': {
    topPill: 'TIKTOK SHOP US SELLERS',
    line1: 'Don’t Set Creator',
    line2: 'Affiliate % Until',
    line3: 'You Run This Math!',
    bullets: ['• 6% US Referral Fee Breakdown', '• Creator Cut (15%–25%) Margin Check', '• Find Your Exact Max Safe Commission'],
    cta: 'Free TikTok Shop Profit Calculator →'
  },
  'print-on-demand-profit-calculator': {
    topPill: 'PRINTIFY & ETSY POD',
    line1: 'Print-on-Demand',
    line2: 'Pricing Formula',
    line3: 'That Never Loses $',
    bullets: ['• Test 10%–20% Sale Discounts Safely', '• Printify Premium 20% Off Break-Even', '• Shirts, Hoodies, Mugs & Totes'],
    cta: 'Try the Free POD Margin Tool →'
  },
  'roas-break-even-calculator': {
    topPill: 'META & TIKTOK ADS MATH',
    line1: 'Know Your Exact',
    line2: 'Break-Even ROAS',
    line3: 'Before Scaling Ads',
    bullets: ['• Instant Max Allowable CPA ($)', '• Compare 2x vs 3x vs 4x ROAS Profit', '• Built for Shopify & DTC Founders'],
    cta: 'Calculate Break-Even ROAS Free →'
  },
  'wholesale-retail-markup-calculator': {
    topPill: 'PRODUCT PRICING GUIDE',
    line1: 'Landed COGS &',
    line2: 'Wholesale vs Retail',
    line3: 'Keystone Calculator',
    bullets: ['• Factory + Freight + Import Tariffs', '• 50% Boutique Wholesale Margin Check', '• Profitable DTC Retail MSRP Formula'],
    cta: 'Price Your Products Profitably →'
  }
};

const mdLines = [
  `# Pinterest Organic Traffic Launch Pack (6 SEO Pins)`,
  `Upload the 6 vertical \`1000x1500\` graphics in \`products/dist/pins/\` to your **Pinterest Business** account (1–2 Pins/day) to drive high-intent US seller traffic for $0:\n`
];

for (const calc of CALCULATORS) {
  const hook = PIN_HOOKS[calc.slug];
  const destUrl = `${SITE_CONFIG.domain.replace(/\/$/, '')}/${calc.slug}/`;
  const svgName = `pin-${calc.slug}.svg`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
  <rect width="1000" height="1500" fill="#0f172a"/>
  <circle cx="880" cy="180" r="320" fill="#0d9488" opacity="0.28"/>
  <circle cx="120" cy="1360" r="260" fill="#f59e0b" opacity="0.16"/>
  <rect x="80" y="100" width="440" height="62" rx="31" fill="#0d9488"/>
  <text x="115" y="141" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#ffffff">${esc(hook.topPill)}</text>

  <text x="80" y="300" font-family="system-ui, sans-serif" font-size="76" font-weight="800" fill="#ffffff">${esc(hook.line1)}</text>
  <text x="80" y="395" font-family="system-ui, sans-serif" font-size="76" font-weight="800" fill="#5eead4">${esc(hook.line2)}</text>
  <text x="80" y="490" font-family="system-ui, sans-serif" font-size="76" font-weight="800" fill="#ffffff">${esc(hook.line3)}</text>

  <rect x="80" y="575" width="840" height="470" rx="28" fill="#1e293b" stroke="#334155" stroke-width="3"/>
  <text x="125" y="685" font-family="system-ui, sans-serif" font-size="36" font-weight="600" fill="#f8fafc">${esc(hook.bullets[0])}</text>
  <text x="125" y="810" font-family="system-ui, sans-serif" font-size="36" font-weight="600" fill="#f8fafc">${esc(hook.bullets[1])}</text>
  <text x="125" y="935" font-family="system-ui, sans-serif" font-size="36" font-weight="600" fill="#f8fafc">${esc(hook.bullets[2])}</text>

  <rect x="80" y="1140" width="840" height="115" rx="22" fill="#f59e0b"/>
  <text x="500" y="1210" text-anchor="middle" font-family="system-ui, sans-serif" font-size="38" font-weight="800" fill="#0f172a">${esc(hook.cta)}</text>

  <text x="500" y="1385" text-anchor="middle" font-family="system-ui, sans-serif" font-size="30" font-weight="700" fill="#94a3b8">${esc(SITE_CONFIG.brandName)} • 100% Free Interactive Tool</text>
</svg>`;

  writeFileSync(join(PINS_DIR, svgName), svg, 'utf8');

  mdLines.push(`---
## Pin: ${calc.shortName} (\`pins/${svgName}\`)
- **Destination Link:** \`${destUrl}\`
- **Pin Title:** \`${calc.title}\`
- **SEO Description:** \`${calc.metaDescription} Free interactive 2026 e-commerce calculator + downloadable Excel profit & Schedule-C tax tracker spreadsheet. #etsyseller #shopify #printondemand #smallbusinesstips #ecommerce2026\`
`);
}

const schedulePath = join(__dirname, '..', 'products', 'dist', 'pinterest-seo-descriptions.md');
writeFileSync(schedulePath, mdLines.join('\n'), 'utf8');

console.log(`✅ Generated 6 Pinterest 1000x1500 graphics + SEO descriptions in ${PINS_DIR}`);
