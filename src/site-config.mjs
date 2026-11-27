/**
 * CENTRAL MONETIZATION & BRAND CONFIGURATION
 * Replace affiliate partner URLs with your approved Impact / PartnerStack / Printify / Link My Books tracking URLs,
 * then run `npm run build` and redeploy to update all 12 calculators, 4 SEO guides, sitemaps, and disclosures automatically!
 */

export const SITE_CONFIG = {
  brandName: 'ShopMarginLab',
  tagline: 'Free 2026 E-Commerce Fee, ROAS, POD & Tax Calculators',
  domain: process.env.PUBLIC_SITE_URL || 'https://shopmarginlab.pages.dev',
  supportEmail: 'digitalnomadstep@gmail.com',
  founderName: 'Nguyen Chi Thanh',
  founderRole: 'Founder & E-Commerce Unit-Economics Researcher',
  lastReviewedDate: '2026-11-27',
  cloudflareAnalyticsToken: 'cad1da804f7b4d96a19ba0c6a11ac227',
  indexNowKey: 'a4f8c92e1b7d4039e5a61c82d9b34f07',

  // =========================================================================
  // 1. AFFILIATE PARTNER LINKS
  // Clean official URLs are used prior to partner approval (never expose placeholder IDs publicly).
  // Once approved, paste your Impact.com / Printify / Link My Books tracking URL below.
  // =========================================================================
  affiliates: {
    shopify: {
      name: 'Shopify',
      badge: 'Save 6.5% Marketplace Fees',
      headline: 'Stop Losing 10%–25% Per Order to Marketplace Fees',
      pitch:
        'Launch your own high-converting storefront with 0% marketplace transaction fees when using Shopify Payments. Start your trial and lock in full customer ownership.',
      ctaLabel: 'Try Shopify Free Trial →',
      commissionNote: 'Up to $150/referral via Impact.com',
      // REPLACE WITH APPROVED IMPACT.COM SHOPIFY AFFILIATE LINK:
      url: 'https://www.shopify.com/free-trial?utm_source=shopmarginlab&utm_medium=calculator&utm_campaign=shopify_partner'
    },
    printify: {
      name: 'Printify',
      badge: 'Top POD Margin Partner',
      headline: 'Boost Your Print-on-Demand Margins by Up to 34%',
      pitch:
        'Compare 90+ global print providers and unlock up to 20% lower blank costs with Printify Premium—integrates in 1 click with Etsy, Shopify, and TikTok Shop US.',
      ctaLabel: 'Start Selling Free on Printify →',
      commissionNote: '5% recurring for 12 months',
      // REPLACE WITH APPROVED PRINTIFY AFFILIATE LINK:
      url: 'https://printify.com/?utm_source=shopmarginlab&utm_medium=calculator&utm_campaign=printify_partner'
    },
    linkMyBooks: {
      name: 'Link My Books',
      badge: 'Save 50% • Automated Bookkeeping',
      headline: 'Tired of Reconciling Etsy, Amazon, eBay & Shopify Payouts by Hand?',
      pitch:
        'Automatically split lump-sum payouts into exact gross sales, marketplace fees, refunds, and sales tax inside QuickBooks or Xero in 10 minutes a month—plus claim 50% off via our partner link.',
      ctaLabel: 'Claim 50% Off + 14-Day Free Trial →',
      commissionNote: '$50 bounty + 20% recurring (up to $1,000/referral) via Cello',
      // Approved Link My Books affiliate/referral link (Cello):
      url: 'https://linkmybooks.cello.so/mqa9XBXQElJ'
    }
  },

  // =========================================================================
  // 2. LIVE DIGITAL PRODUCTS (Hosted on Gumroad — Direct VN Bank Payout + 20% Upsell)
  // =========================================================================
  products: {
    freeCheatSheet: {
      id: 'free-seller-fee-tax-cheat-sheet-2026',
      title: 'FREE: 2026 US Seller Fee & IRS Schedule-C Tax Write-Off Cheat Sheet (.xlsx)',
      shortTitle: 'Free 2026 Fee & Tax Cheat Sheet',
      priceUsd: 0,
      originalPriceUsd: 12,
      fileName: 'FREE-2026-Seller-Fee-Tax-Cheat-Sheet.xlsx',
      bullets: [
        'Side-by-side 2026 US fee table: Etsy vs. Shopify Basic vs. TikTok Shop US',
        'Top overlooked IRS Schedule-C seller write-offs (home office, postage, samples, software)',
        'Instant $0 download — opens in Microsoft Excel & Google Sheets'
      ],
      checkoutUrl: 'https://nomadstep.gumroad.com/l/ioyene'
    },
    flagshipOs: {
      id: 'seller-profit-os-2026',
      title: '2026 Multi-Channel Seller Profit, Inventory & Schedule-C Tax Excel OS',
      shortTitle: 'Seller Profit & Tax Excel OS',
      priceUsd: 24,
      originalPriceUsd: 49,
      fileName: 'Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx',
      bullets: [
        '5 interconnected Microsoft Excel & Google Sheets tabs with pre-built live formulas',
        'SKU-level Landed COGS & Break-Even Pricing Matrix across Etsy, Shopify & TikTok Shop',
        '12-Month Order, Ad Spend & Net Profit Automated Dashboard',
        'Low-Stock Reorder Alert Tracker + US IRS Schedule-C Tax Deduction Log'
      ],
      checkoutUrl: 'https://nomadstep.gumroad.com/l/yihnkv'
    },
    podMatrix: {
      id: 'pod-pricing-matrix-2026',
      title: '2026 Print-on-Demand & Etsy Bulk Pricing Matrix (.xlsx)',
      shortTitle: 'POD & Etsy Pricing Matrix',
      priceUsd: 17,
      originalPriceUsd: 35,
      fileName: 'POD-Etsy-Launch-Pricing-Matrix-2026.xlsx',
      bullets: [
        'Compare 50 SKUs side-by-side with Offsite Ads (12%/15%) & Sale Discount protection',
        'Printify Standard vs. Printify Premium break-even threshold calculator',
        'Target ROAS & Daily Ad Budget Planner + 100-Listing SEO Keyword Tracker'
      ],
      checkoutUrl: 'https://nomadstep.gumroad.com/l/mkjzky'
    }
  }
};
