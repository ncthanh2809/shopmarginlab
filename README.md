# ShopMarginLab — 20 Free 2026 E-Commerce & Reseller Profit Calculators

**Live Free Web App (No Signup, 100% Client-Side):** https://shopmarginlab.com/

ShopMarginLab is an open-source, zero-signup suite of **20 interactive 2026 US marketplace fee, POD, ROAS, and Schedule-C tax calculators** plus a live **7-Channel Fee Showdown** (`/compare/`) and **10 in-depth 2026 seller guides** (`/guides/`).

---

## Key Features (100% Browser-Based, Zero Login)

- **7-Channel Live Fee Showdown (`/compare/`):** Enter price, shipping, and COGS once to rank real net profit across **Shopify Basic**, **TikTok Shop US**, **Etsy US**, **Mercari**, **Whatnot Live**, **eBay US**, and **Poshmark**.
- **20 Dedicated 2026 Calculators:**
  - **Etsy & POD:** Etsy Fee Calculator (incl. 12%/15% Offsite Ads), Etsy Offsite Ads Survival, Etsy Digital Product Profit, Print-on-Demand Profit, Printify vs. Printful Comparison
  - **Shopify & DTC:** Shopify vs. Etsy Break-Even, Shopify Profit Margin, Shopify Plans (Basic vs. Grow vs. Advanced), Bundle & BOGO Discount Optimizer, Landed COGS & Wholesale Markup
  - **Marketplaces & Resellers:** Amazon FBA & Break-Even ACoS, eBay US Final Value & Promoted Listings, TikTok Shop US & Creator Commission, Etsy vs. TikTok Shop US, Poshmark, Mercari, Depop US (0% selling fee + 3.3% + $0.45 + 12% Boosted), Whatnot Live Auction
  - **Ads & US Tax:** Break-Even ROAS & Target CPA, US Seller Self-Employment & Quarterly 1040-ES Tax Estimator
- **Built-In Utility Features:** Shareable preset URLs, CSV breakdown export, print-to-PDF layout, and a 1-click free HTML `<iframe>` embed generator (`?embed=1`).
- **Downloadable Excel & Google Sheets Workbooks (`/templates/`):** Unlocked `.xlsx` workbooks built with live OpenXML formulas.

---

## Local Development & Testing

```bash
# Build all static HTML pages, XML sitemaps, llms.txt, feed.xml & IndexNow key
npm run build:site

# Rebuild Excel (.xlsx) digital products
npm run build:products

# Run end-to-end verification suite (math + HTML + OpenXML + pins + preview server)
npm test

# Start local preview server on http://localhost:4000
npm start

# Submit all 35 URLs to IndexNow (Bing, DuckDuckGo, Yandex, Seznam, Naver)
node scripts/submit-indexnow.mjs
```

---

## License

MIT License — see [LICENSE](./LICENSE).
