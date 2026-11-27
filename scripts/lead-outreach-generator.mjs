/**
 * ShopMarginLab Personalized 1-to-1 Email Outreach Generator
 *
 * Usage:
 *   node scripts/lead-outreach-generator.mjs
 *   node scripts/lead-outreach-generator.mjs scripts/verified-prospects-batch1.csv --out=outreach/verified-campaigns.md --export-json=.tmp/batch1.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG } from '../src/site-config.mjs';
import { CALCULATORS } from '../src/calculators-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function parseCsvText(csvText) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r' && next === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i++;
    } else if (ch === '\n' || ch === '\r') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const rawArgs = process.argv.slice(2);
const flags = {};
let positionalInput = '';

for (const arg of rawArgs) {
  if (arg.startsWith('--')) {
    const eq = arg.indexOf('=');
    if (eq > 2) {
      flags[arg.slice(2, eq)] = arg.slice(eq + 1);
    }
  } else if (!positionalInput) {
    positionalInput = arg;
  }
}

const inputPath = resolve(rootDir, flags.input || positionalInput || join('scripts', 'verified-prospects-batch1.csv'));
const outPath = resolve(rootDir, flags.out || join('outreach', 'verified-campaigns.md'));
const exportJsonPath = flags['export-json'] ? resolve(rootDir, flags['export-json']) : '';
const writeBodiesDir = flags['write-bodies'] ? resolve(rootDir, flags['write-bodies']) : '';
const baseDomain = (flags.url || SITE_CONFIG.domain || 'https://shopmarginlab.com').replace(/\/+$/, '');
const fromEmail = flags['from-email'] || process.env.OUTREACH_FROM_EMAIL || SITE_CONFIG.supportEmail;
const freeSheetUrl = SITE_CONFIG.products.freeCheatSheet.checkoutUrl;

const CALC_DISPLAY_MAP = {
  compare: '7-Channel Live Fee Showdown',
  'etsy-fee-calculator': 'Etsy Fee Calculator',
  'etsy-digital-product-profit-calculator': 'Etsy Digital Product Profit Calculator',
  'etsy-vs-tiktok-shop-calculator': 'Etsy vs. TikTok Shop Calculator',
  'shopify-vs-etsy-calculator': 'Shopify vs. Etsy Calculator',
  'etsy-offsite-ads-calculator': 'Etsy Offsite Ads Calculator',
  'printful-vs-printify-calculator': 'Printify vs. Printful Calculator',
  'print-on-demand-profit-calculator': 'Print-on-Demand Profit Calculator',
  'shopify-profit-margin-calculator': 'Shopify Profit Margin Calculator',
  'shopify-fee-calculator': 'Shopify Plan and Fee Calculator',
  'depop-fee-calculator': 'Depop Fee Calculator',
  'tiktok-shop-fee-calculator': 'TikTok Shop Fee Calculator',
  'ecommerce-tax-calculator': '1099-K and Schedule-C Tax Estimator',
  'bundle-discount-profit-calculator': 'Bundle Discount Profit Calculator'
};

const calcBySlug = new Map(CALCULATORS.map((c) => [c.slug, c]));

function buildRouteUrl(slug) {
  if (!slug || slug === 'compare') return `${baseDomain}/compare/`;
  return `${baseDomain}/${slug}/`;
}

function buildEmbedUrl(slug) {
  return `${buildRouteUrl(slug)}?embed=1`;
}

function getCalcLabel(slug) {
  if (CALC_DISPLAY_MAP[slug]) return CALC_DISPLAY_MAP[slug];
  const meta = calcBySlug.get(slug);
  return meta ? meta.shortName : '2026 Seller Fee Calculator';
}

function shortenBrand(brand) {
  return brand
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s*—\s*.+$/, '')
    .trim();
}

function buildCampaign(prospect) {
  const {
    brand,
    contactName,
    email,
    segment,
    batch,
    calcSlug,
    guideSlug,
    hook,
    website
  } = prospect;

  const calcUrl = buildRouteUrl(calcSlug);
  const embedUrl = buildEmbedUrl(calcSlug);
  const guideUrl = guideSlug ? `${baseDomain}/guides/${guideSlug}/` : `${baseDomain}/guides/`;
  const compareUrl = `${baseDomain}/compare/`;
  const calcLabel = getCalcLabel(calcSlug);
  const shortBrand = shortenBrand(brand);

  let subject = '';
  let body = '';
  let followUpSubject = '';
  let followUpBody = '';

  if (segment === 'etsy-educator') {
    subject = `Free 2026 ${calcLabel} resource for ${shortBrand}`;
    body = [
      `Hi ${contactName},`,
      '',
      `${hook}.`,
      '',
      `I built a free, zero-signup suite of 20 interactive 2026 US seller fee and profit calculators at ShopMarginLab (${baseDomain}/), and thought the ${calcLabel} might be genuinely useful for your audience:`,
      calcUrl,
      '',
      `There is no login wall, no email gate, and no popups—just live 2026 US fee math (Etsy 6.5% on item + shipping, 12%/15% Offsite Ads, Printify vs. Printful blanks, and Shopify break-even) plus a 1-click HTML embed widget (?embed=1) if you ever want an interactive calculator inside a blog post or student resource page.`,
      '',
      `We also put together a $0 unlocked Excel/Google Sheets 2026 Fee & Schedule-C Tax Cheat Sheet you are welcome to share freely:`,
      freeSheetUrl,
      '',
      `If there is a specific pricing scenario or fee quirk your students ask about most, let me know—happy to add it.`,
      '',
      `Best,`,
      `Thanh Nguyen`,
      `Founder, ShopMarginLab`,
      `${baseDomain}/`
    ].join('\n');

    followUpSubject = `Re: ${subject}`;
    followUpBody = `Hi ${contactName} — quick follow-up in case this got buried. Here is the clean iframe-ready link if you ever want to drop a zero-signup calculator into a lesson or blog post: ${embedUrl}. Happy to customize a preset URL with default numbers for your niche anytime.`;
  } else if (segment === 'reseller-tiktok-shopify') {
    const channelPitch = calcSlug === 'tiktok-shop-fee-calculator' || calcSlug === 'etsy-vs-tiktok-shop-calculator'
      ? `It models TikTok Shop US's 6% referral fee alongside 15%-20% creator affiliate commissions and shipping subsidies—showing the exact $40+ bundle threshold where creator-driven volume stays profitable.`
      : calcSlug === 'shopify-vs-etsy-calculator' || calcSlug === 'shopify-fee-calculator' || calcSlug === 'shopify-profit-margin-calculator'
        ? `It calculates the exact monthly order break-even point (~14 orders/mo at $42 AOV) where moving repeat marketplace buyers to Shopify saves $2,600+/year in fees, with zero login or email gate.`
        : `It lets sellers enter item price, shipping, and COGS once to rank real net profit live across all 7 US channels (Shopify Basic, TikTok Shop US, Etsy, Mercari, Whatnot Live, eBay, and Poshmark)—plus a dedicated Depop 0% vs. 12% Boosted calculator.`;

    subject = `Free 2026 ${calcLabel} widget for ${shortBrand}`;
    body = [
      `Hi ${contactName},`,
      '',
      `${hook}.`,
      '',
      `I put together a free, zero-signup interactive tool at ShopMarginLab that fits well alongside your content and seller workflows:`,
      calcUrl,
      '',
      `${channelPitch}`,
      '',
      `Two quick ways it can help your audience or team:`,
      `1. Shareable preset links & CSV breakdown export (100% browser-based, no signup required).`,
      `2. 1-click free HTML embed (${embedUrl}) if you want an interactive fee calculator directly on a blog guide or onboarding page.`,
      '',
      `If you ever test it and notice a marketplace fee nuance we should add for 2026, I would love to hear your take.`,
      '',
      `Best,`,
      `Thanh Nguyen`,
      `Founder, ShopMarginLab`,
      `${baseDomain}/`
    ].join('\n');

    followUpSubject = `Re: ${subject}`;
    followUpBody = `Hi ${contactName} — bumping this gently. You can also preview the full 7-Channel Fee Showdown (${compareUrl}) or grab the standalone embed link (${embedUrl}) anytime with zero account setup.`;
  } else if (segment === 'ecommerce-cpa') {
    subject = `Free 2026 1099-K and Schedule-C estimator for ${shortBrand} clients`;
    body = [
      `Hi ${contactName},`,
      '',
      `${hook}.`,
      '',
      `I built a free, zero-login 2026 US E-Commerce Seller Tax & Quarterly 1040-ES Estimator at ShopMarginLab to help marketplace sellers stop panicking over gross Form 1099-K numbers:`,
      calcUrl,
      '',
      `Sellers can plug in gross payouts, marketplace fees, shipping labels, and Schedule-C deductions to see their estimated 15.3% self-employment tax, quarterly set-aside, and tax savings per $1,000 of tracked write-offs—plus compare 7 US channels side-by-side at ${compareUrl}.`,
      '',
      `We also released an unlocked $0 2026 Fee & IRS Schedule-C Tax Cheat Sheet (.xlsx) you can share directly with onboarding clients if helpful:`,
      freeSheetUrl,
      '',
      `No signup, no spam, and completely free to bookmark or embed (?embed=1) on your client resources page.`,
      '',
      `Best,`,
      `Thanh Nguyen`,
      `Founder, ShopMarginLab`,
      `${baseDomain}/`
    ].join('\n');

    followUpSubject = `Re: ${subject}`;
    followUpBody = `Hi ${contactName} — quick follow-up ahead of quarterly tax prep: happy to send over the clean ?embed=1 snippet for your resource page (${embedUrl}) or adjust any deduction category if your Etsy/Shopify clients ask for something specific.`;
  } else {
    const bundleNote = calcSlug === 'bundle-discount-profit-calculator'
      ? 'and multi-unit bundle discounts'
      : `and multi-unit bundle discounts (${baseDomain}/bundle-discount-profit-calculator/)`;
    subject = `Free 2026 Etsy vs Shopify margin toolkit for ${shortBrand}`;
    body = [
      `Hi ${contactName},`,
      '',
      `${hook}.`,
      '',
      `Since you run across handmade marketplace and Shopify economics firsthand, I wanted to share a free, zero-signup calculator suite I built called ShopMarginLab:`,
      calcUrl,
      '',
      `In 10 seconds you can test exact 2026 US fees across Etsy (including 12%/15% Offsite Ads), Shopify Basic, TikTok Shop, ${bundleNote}—and export clean CSV breakdowns or print-ready PDFs without entering an email.`,
      '',
      `If you track multiple SKUs in Excel or Google Sheets, here is our free $0 2026 Seller Fee & Schedule-C Tax Cheat Sheet (.xlsx) as well:`,
      freeSheetUrl,
      '',
      `Hope it saves you a few minutes on your next pricing or bundle check!`,
      '',
      `Warmly,`,
      `Thanh Nguyen`,
      `Founder, ShopMarginLab`,
      `${baseDomain}/`
    ].join('\n');

    followUpSubject = `Re: ${subject}`;
    followUpBody = `Hi ${contactName} — hope your week of orders is going smoothly! Just sharing the 7-channel quick check link (${compareUrl}) in case you ever compare new sales channels alongside Shopify.`;
  }

  return {
    ...prospect,
    calcUrl,
    embedUrl,
    guideUrl,
    subject,
    body,
    followUpSubject,
    followUpBody
  };
}

const rawCsv = readFileSync(inputPath, 'utf8');
const rows = parseCsvText(rawCsv);
if (rows.length < 2) {
  console.error('Prospect CSV needs a header row and at least 1 row.');
  process.exit(1);
}

const headers = rows[0].map((h) => h.trim().toLowerCase());
const col = (name) => headers.indexOf(name.toLowerCase());

const prospects = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const brand = (r[col('brandorfirm')] || '').trim();
  const email = (r[col('email')] || '').trim();
  if (!brand || !email) continue;

  prospects.push({
    index: prospects.length + 1,
    brand,
    contactName: (r[col('contactname')] || 'Team').trim(),
    email,
    segment: (r[col('segment')] || 'etsy-educator').trim(),
    batch: Number((r[col('batch')] || '1').trim()),
    calcSlug: (r[col('targetcalcslug')] || 'compare').trim(),
    guideSlug: (r[col('targetguideslug')] || '').trim(),
    hook: (r[col('personalhook')] || '').trim(),
    website: (r[col('website')] || '').trim()
  });
}

const campaigns = prospects.map(buildCampaign);

const mdLines = [
  `# ShopMarginLab — Verified 1-to-1 Customer & Partner Email Outreach Queue`,
  `- **Generated at:** ${new Date().toISOString()}`,
  `- **Source CSV:** \`${inputPath.replace(rootDir + '\\', '').replace(rootDir + '/', '')}\``,
  `- **Live App URL:** ${baseDomain}/`,
  `- **Sender Identity:** Thanh Nguyen <${fromEmail}>`,
  `- **Free Lead Magnet ($0 Cheat Sheet):** ${freeSheetUrl}`,
  `- **Total Verified Prospects:** ${campaigns.length} (Batch 1: ${campaigns.filter((c) => c.batch === 1).length} | Batch 2: ${campaigns.filter((c) => c.batch === 2).length})`,
  ''
];

for (const c of campaigns) {
  mdLines.push(`---`);
  mdLines.push(`## #${c.index} [Batch ${c.batch}] ${c.brand}`);
  mdLines.push(`- **Recipient:** ${c.contactName} (\`${c.email}\`)`);
  mdLines.push(`- **Segment:** \`${c.segment}\` | **Website:** ${c.website}`);
  mdLines.push(`- **Target Tool:** ${c.calcUrl} (Embed: ${c.embedUrl})`);
  mdLines.push('');
  mdLines.push(`### Day 1 Email`);
  mdLines.push(`**To:** \`${c.email}\``);
  mdLines.push(`**Subject:** ${c.subject}`);
  mdLines.push('');
  mdLines.push('```text');
  mdLines.push(c.body);
  mdLines.push('```');
  mdLines.push('');
  mdLines.push(`### Day 4 Follow-Up`);
  mdLines.push(`**Subject:** ${c.followUpSubject}`);
  mdLines.push('');
  mdLines.push('> ' + c.followUpBody);
  mdLines.push('');
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, mdLines.join('\n'), 'utf8');

if (exportJsonPath) {
  mkdirSync(dirname(exportJsonPath), { recursive: true });
  writeFileSync(exportJsonPath, JSON.stringify(campaigns, null, 2), 'utf8');
}

if (writeBodiesDir) {
  mkdirSync(writeBodiesDir, { recursive: true });
  for (const c of campaigns) {
    const filePath = join(writeBodiesDir, `prospect-${String(c.index).padStart(2, '0')}.txt`);
    writeFileSync(filePath, c.body + '\n', 'utf8');
  }
}

console.log(`Generated ${campaigns.length} personalized ShopMarginLab email campaigns -> ${outPath}`);
