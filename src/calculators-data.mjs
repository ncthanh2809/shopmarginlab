/**
 * 18 High-Intent 2026 E-Commerce & Reseller SEO Calculators
 * Verified against 2026 US Marketplace Fee Schedules (Etsy, Shopify, TikTok Shop US, Amazon FBA, eBay, Poshmark, Mercari, Whatnot, POD, ROAS, Markup, Bundles, Schedule-C Tax).
 */

export const CALCULATORS = [
  {
    slug: 'etsy-fee-calculator',
    category: 'etsy-pod',
    shortName: 'Etsy Fee Calculator',
    badge: 'Updated for 2026 US Rates',
    title: '2026 Etsy Fee & Profit Margin Calculator (With Offsite Ads)',
    metaDescription:
      'Calculate exact 2026 Etsy seller fees ($0.20 listing, 6.5% transaction, 3% + $0.25 Etsy Payments, and 12%–15% Offsite Ads), net profit, and break-even price.',
    h1: '2026 Etsy Fee & Net Profit Calculator',
    intro:
      'See exactly how much Etsy keeps from every order—including the 6.5% transaction fee on shipping, 3% + $0.25 US payment processing, and optional 12%/15% Offsite Ads.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'itemPrice', label: 'Item Sale Price ($ USD)', type: 'number', value: 34.0, step: 0.5, min: 0 },
      { id: 'shippingCharged', label: 'Shipping Charged to Buyer ($)', type: 'number', value: 5.0, step: 0.5, min: 0 },
      { id: 'itemCost', label: 'Product Cost / COGS ($)', type: 'number', value: 9.5, step: 0.25, min: 0 },
      { id: 'actualShipping', label: 'Actual Postage Label Cost ($)', type: 'number', value: 4.6, step: 0.25, min: 0 },
      {
        id: 'offsiteAdsRate',
        label: 'Etsy Offsite Ads Attribution',
        type: 'select',
        value: '0',
        options: [
          { value: '0', label: 'Organic Order — 0% Offsite Ads' },
          { value: '0.15', label: '15% Offsite Ads (Shop under $10k/yr)' },
          { value: '0.12', label: '12% Mandatory Offsite Ads (Shop $10k+/yr)' }
        ]
      },
      { id: 'adCost', label: 'Optional On-Site Etsy Ads Spend Per Order ($)', type: 'number', value: 0, step: 0.5, min: 0 }
    ],
    computeFnBody: `
      const gross = v.itemPrice + v.shippingCharged;
      const listingFee = 0.20;
      const transactionFee = gross * 0.065;
      const processingFee = gross > 0 ? gross * 0.03 + 0.25 : 0;
      const offsiteFee = Math.min(100, gross * v.offsiteAdsRate);
      const totalEtsyFees = listingFee + transactionFee + processingFee + offsiteFee;
      const totalCosts = v.itemCost + v.actualShipping + v.adCost + totalEtsyFees;
      const netProfit = gross - totalCosts;
      const marginPct = gross > 0 ? (netProfit / gross) * 100 : 0;
      const effectiveTakeRate = gross > 0 ? (totalEtsyFees / gross) * 100 : 0;
      const fixedDirect = v.itemCost + v.actualShipping + v.adCost + 0.45 - v.shippingCharged * (1 - 0.095 - v.offsiteAdsRate);
      const breakEvenItemPrice = Math.max(0, fixedDirect / Math.max(0.05, 1 - 0.095 - v.offsiteAdsRate));

      return {
        primaryLabel: 'Net Profit Per Order',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 0 ? 'positive' : 'negative',
        kpis: [
          { label: 'Profit Margin', value: marginPct.toFixed(1) + '%' },
          { label: 'Total Etsy Fees', value: fmtUsd(totalEtsyFees) + ' (' + effectiveTakeRate.toFixed(1) + '%)' },
          { label: 'Break-Even Item Price', value: fmtUsd(breakEvenItemPrice) }
        ],
        rows: [
          ['Gross Buyer Revenue (Item + Shipping)', fmtUsd(gross), '100.0%'],
          ['Etsy Listing Fee', '-' + fmtUsd(listingFee), pct(listingFee, gross)],
          ['Etsy Transaction Fee (6.5% incl. shipping)', '-' + fmtUsd(transactionFee), pct(transactionFee, gross)],
          ['Etsy Payments Processing (3% + $0.25 US)', '-' + fmtUsd(processingFee), pct(processingFee, gross)],
          ['Offsite Ads Fee (capped at $100)', '-' + fmtUsd(offsiteFee), pct(offsiteFee, gross)],
          ['Product COGS + Actual Shipping + Ads', '-' + fmtUsd(v.itemCost + v.actualShipping + v.adCost), pct(v.itemCost + v.actualShipping + v.adCost, gross)],
          ['Net Seller Take-Home Profit', fmtUsd(netProfit), marginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: effectiveTakeRate > 14
          ? 'Alert: Etsy is taking ' + effectiveTakeRate.toFixed(1) + '% of your top-line revenue! Moving repeat customers to a $39/mo Shopify store cuts per-order fees down to ~2.9% + $0.30.'
          : 'Healthy baseline fee load (' + effectiveTakeRate.toFixed(1) + '%). Insert a QR insert card in every package to capture repeat orders at 0% marketplace commission on Shopify.'
      };
    `,
    faqs: [
      {
        q: 'Does Etsy charge the 6.5% transaction fee on shipping in 2026?',
        a: 'Yes. Etsy applies its 6.5% transaction fee to the total order amount paid by the buyer, including item price, buyer-paid shipping, and gift wrap (excluding US state sales tax collected by Etsy).'
      },
      {
        q: 'When are Etsy Offsite Ads mandatory?',
        a: 'Shops under $10,000 USD in rolling 365-day sales pay 15% on attributed orders and can opt out anytime. Once a shop crosses $10,000 in 12 months, Offsite Ads enrollment becomes permanent at a discounted 12% rate (capped at $100 per order).'
      },
      {
        q: 'How much do I save switching repeat buyers from Etsy to Shopify?',
        a: 'An organic US Etsy sale loses ~9.5% + $0.45 in combined platform and payment fees (or 21.5%+ with Offsite Ads), whereas Shopify Basic charges 0% marketplace commission and just 2.9% + $0.30 card processing.'
      }
    ]
  },

  {
    slug: 'shopify-vs-etsy-calculator',
    category: 'shopify-dtc',
    shortName: 'Shopify vs Etsy',
    badge: 'Platform Fee Showdown',
    title: 'Shopify vs. Etsy Fee Comparison Calculator (2026 Break-Even Tool)',
    metaDescription:
      'Compare monthly Etsy fees vs. Shopify Basic ($39/mo + 2.9% + $0.30) at your exact order volume and average order value to find your exact savings switch point.',
    h1: 'Shopify vs. Etsy Monthly Profit & Fee Calculator',
    intro:
      'Find the exact monthly sales volume where Etsy’s 6.5% transaction fee costs you more than owning your own $39/month Shopify storefront.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'monthlyOrders', label: 'Monthly Orders', type: 'number', value: 65, step: 5, min: 1 },
      { id: 'avgOrderValue', label: 'Average Order Value incl. Shipping ($)', type: 'number', value: 42.0, step: 1, min: 1 },
      { id: 'offsiteSharePct', label: '% of Etsy Orders Triggering 15% Offsite Ads', type: 'number', value: 15, step: 5, min: 0 },
      { id: 'shopifyPlanCost', label: 'Shopify Monthly Subscription ($39 Monthly / $29 Annual)', type: 'number', value: 39, step: 1, min: 0 }
    ],
    computeFnBody: `
      const monthlyRev = v.monthlyOrders * v.avgOrderValue;
      const etsyBaseFees = v.monthlyOrders * (0.20 + 0.25) + monthlyRev * (0.065 + 0.03);
      const offsiteOrders = v.monthlyOrders * (Math.min(100, Math.max(0, v.offsiteSharePct)) / 100);
      const etsyOffsiteFees = offsiteOrders * Math.min(100, v.avgOrderValue * 0.15);
      const totalEtsy = etsyBaseFees + etsyOffsiteFees;

      const shopifyProcessing = v.monthlyOrders * 0.30 + monthlyRev * 0.029;
      const totalShopify = v.shopifyPlanCost + shopifyProcessing;

      const monthlySavings = totalEtsy - totalShopify;
      const annualSavings = monthlySavings * 12;
      const breakEvenOrders = Math.ceil(v.shopifyPlanCost / Math.max(0.5, v.avgOrderValue * 0.066 + 0.15));

      return {
        primaryLabel: monthlySavings >= 0 ? 'Projected Annual Savings on Shopify' : 'Extra Cost vs. Etsy Alone',
        primaryValue: (monthlySavings >= 0 ? '+' : '-') + fmtUsd(Math.abs(annualSavings)) + '/yr',
        primaryTone: monthlySavings >= 0 ? 'positive' : 'neutral',
        kpis: [
          { label: 'Etsy Monthly Fees', value: fmtUsd(totalEtsy) + '/mo' },
          { label: 'Shopify Total Fees', value: fmtUsd(totalShopify) + '/mo' },
          { label: 'Switch Break-Even Point', value: breakEvenOrders + ' orders/mo' }
        ],
        rows: [
          ['Monthly Gross Merchandise Revenue', fmtUsd(monthlyRev), v.monthlyOrders + ' orders'],
          ['Etsy Total Monthly Fees (Base + Offsite Share)', '-' + fmtUsd(totalEtsy), pct(totalEtsy, monthlyRev)],
          ['Shopify Total Monthly Cost (Plan + 2.9% + $0.30)', '-' + fmtUsd(totalShopify), pct(totalShopify, monthlyRev)],
          ['Monthly Net Fee Difference', (monthlySavings >= 0 ? '+' : '-') + fmtUsd(Math.abs(monthlySavings)), 'Per Month'],
          ['12-Month Cumulative Fee Difference', (monthlySavings >= 0 ? '+' : '-') + fmtUsd(Math.abs(annualSavings)), 'Per Year']
        ],
        dynamicAdvice: monthlySavings > 0
          ? 'At ' + v.monthlyOrders + ' orders/mo, Etsy fees exceed a full Shopify Basic subscription by ' + fmtUsd(monthlySavings) + '/month (' + fmtUsd(annualSavings) + '/year)!'
          : 'You are just ' + Math.max(1, breakEvenOrders - v.monthlyOrders) + ' orders/mo away from the break-even point where Shopify becomes cheaper than Etsy.'
      };
    `,
    faqs: [
      {
        q: 'At how many monthly orders does Shopify become cheaper than Etsy?',
        a: 'For an average $40 order, Shopify Basic ($39/month) breaks even against organic Etsy fees at roughly 14 orders per month (~$560/month in sales). Every order beyond that saves ~6.6% in platform fees.'
      },
      {
        q: 'Should I close my Etsy shop when launching Shopify?',
        a: 'No! Smart sellers keep Etsy as a discovery funnel for new customers while directing repeat buyers (via package inserts and email lists) to their Shopify store where margins are 7%–20% higher.'
      }
    ]
  },

  {
    slug: 'tiktok-shop-fee-calculator',
    category: 'marketplaces',
    shortName: 'TikTok Shop Fees',
    badge: 'Includes Creator % Cut',
    title: '2026 TikTok Shop US Seller Fee & Creator Commission Calculator',
    metaDescription:
      'Calculate true TikTok Shop US margins after the 6% referral fee (or 3% new seller promo), 10%–25% creator affiliate cuts, FBT shipping, and GMV Max ads.',
    h1: 'TikTok Shop US Seller Profit & Affiliate Cut Calculator',
    intro:
      'TikTok Shop’s 6% base referral fee looks cheap—until you stack 15%–20% creator affiliate commissions and free-shipping subsidies. Run the real numbers before setting creator rates.',
    primaryAffiliate: 'printify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'salePrice', label: 'TikTok Shop Selling Price ($)', type: 'number', value: 29.99, step: 0.5, min: 0 },
      { id: 'shippingPaid', label: 'Shipping Paid by Buyer ($)', type: 'number', value: 0, step: 0.5, min: 0 },
      {
        id: 'referralRate',
        label: 'TikTok US Referral Tier',
        type: 'select',
        value: '0.06',
        options: [
          { value: '0.06', label: '6.0% Standard US Referral Fee (Includes Payment Processing)' },
          { value: '0.03', label: '3.0% New Seller First-30-Days Promo' },
          { value: '0.05', label: '5.0% Select Jewelry / Collectibles Category' }
        ]
      },
      { id: 'creatorCutPct', label: 'Creator Affiliate Commission (%)', type: 'number', value: 15, step: 1, min: 0 },
      { id: 'cogs', label: 'Unit Product Cost / COGS ($)', type: 'number', value: 7.25, step: 0.25, min: 0 },
      { id: 'fulfillmentCost', label: 'Shipping / FBT Pick & Pack Cost ($)', type: 'number', value: 4.25, step: 0.25, min: 0 }
    ],
    computeFnBody: `
      const buyerTotal = v.salePrice + v.shippingPaid;
      const referralFee = buyerTotal * v.referralRate;
      const creatorFee = v.salePrice * (v.creatorCutPct / 100);
      const totalPlatformAndCreator = referralFee + creatorFee;
      const directCosts = v.cogs + v.fulfillmentCost;
      const netProfit = buyerTotal - totalPlatformAndCreator - directCosts;
      const marginPct = buyerTotal > 0 ? (netProfit / buyerTotal) * 100 : 0;
      const maxSafeCreatorPct = v.salePrice > 0 ? Math.max(0, ((buyerTotal - referralFee - directCosts) / v.salePrice) * 100) : 0;

      return {
        primaryLabel: 'Net Profit After Creator Cut',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 0 ? 'positive' : 'negative',
        kpis: [
          { label: 'Net Profit Margin', value: marginPct.toFixed(1) + '%' },
          { label: 'TikTok + Creator Take', value: fmtUsd(totalPlatformAndCreator) },
          { label: 'Max Break-Even Creator %', value: maxSafeCreatorPct.toFixed(1) + '%' }
        ],
        rows: [
          ['Buyer Order Total', fmtUsd(buyerTotal), '100.0%'],
          ['TikTok Shop US Referral Fee', '-' + fmtUsd(referralFee), pct(referralFee, buyerTotal)],
          ['Creator Affiliate Commission (' + v.creatorCutPct + '%)', '-' + fmtUsd(creatorFee), pct(creatorFee, buyerTotal)],
          ['Unit COGS + Fulfillment / FBT Shipping', '-' + fmtUsd(directCosts), pct(directCosts, buyerTotal)],
          ['Net Profit Per Unit Sold', fmtUsd(netProfit), marginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: marginPct < 15
          ? 'Tight margin warning (' + marginPct.toFixed(1) + '%): Consider bundling 2 units to raise AOV above $40 so fulfillment cost takes a smaller bite.'
          : 'Strong creator-ready margin! You can offer up to ' + Math.max(0, (maxSafeCreatorPct - 10)).toFixed(0) + '% affiliate commission and still retain a 10%+ net margin.'
      };
    `,
    faqs: [
      {
        q: 'Does TikTok Shop US charge an extra credit card processing fee on top of 6%?',
        a: 'No. Standard payment processing is bundled into TikTok Shop US’s 6% referral fee, though creator affiliate commissions (typically 10%–25%) and FBT fulfillment fees stack separately.'
      },
      {
        q: 'What happens to TikTok referral fees when a customer requests a refund?',
        a: 'TikTok credits back the referral fee minus a 20% refund administration retention (capped at $5.00 per SKU).'
      }
    ]
  },

  {
    slug: 'print-on-demand-profit-calculator',
    category: 'etsy-pod',
    shortName: 'POD Profit Calc',
    badge: 'Printify & Etsy/Shopify',
    title: 'Print-on-Demand (POD) Pricing & Profit Margin Calculator (2026)',
    metaDescription:
      'Calculate real Print-on-Demand profit margins on Printify & Printful across Etsy or Shopify—including Printify Premium 20% blank discounts and sale pricing.',
    h1: 'Print-on-Demand (POD) Pricing & Margin Calculator',
    intro:
      'Test t-shirt, hoodie, mug, and canvas pricing before you publish. Compare standard POD blank costs against Printify Premium (~20% lower base cost) across Etsy and Shopify.',
    primaryAffiliate: 'printify',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'podMatrix',
    inputs: [
      { id: 'retailPrice', label: 'Retail Listing Price ($)', type: 'number', value: 28.99, step: 0.5, min: 0 },
      { id: 'discountPct', label: 'Shop Sale / Coupon Discount (%)', type: 'number', value: 10, step: 5, min: 0 },
      { id: 'shippingCharged', label: 'Shipping Charged to Customer ($)', type: 'number', value: 4.99, step: 0.5, min: 0 },
      { id: 'podBaseCost', label: 'POD Blank + Print Cost ($)', type: 'number', value: 11.4, step: 0.2, min: 0 },
      { id: 'podShippingCost', label: 'POD Supplier Shipping Cost ($)', type: 'number', value: 4.75, step: 0.2, min: 0 },
      {
        id: 'salesChannel',
        label: 'Sales Channel Fee Structure',
        type: 'select',
        value: 'etsy',
        options: [
          { value: 'etsy', label: 'Etsy US (6.5% + 3% + $0.45)' },
          { value: 'shopify', label: 'Shopify Payments (2.9% + $0.30)' },
          { value: 'tiktok', label: 'TikTok Shop US (6.0% Referral)' }
        ]
      }
    ],
    computeFnBody: `
      const discountedItem = v.retailPrice * (1 - Math.min(95, Math.max(0, v.discountPct)) / 100);
      const grossPaid = discountedItem + v.shippingCharged;
      let channelFee = 0;
      if (v.salesChannel === 'etsy') channelFee = 0.45 + grossPaid * 0.095;
      else if (v.salesChannel === 'shopify') channelFee = 0.30 + grossPaid * 0.029;
      else channelFee = grossPaid * 0.06;

      const standardSupplierTotal = v.podBaseCost + v.podShippingCost;
      const netStandard = grossPaid - channelFee - standardSupplierTotal;
      const marginStandard = grossPaid > 0 ? (netStandard / grossPaid) * 100 : 0;

      const premiumBlankCost = v.podBaseCost * 0.80;
      const netWithPremium = grossPaid - channelFee - (premiumBlankCost + v.podShippingCost);
      const ordersToPayOffPremium = Math.ceil(29 / Math.max(0.25, v.podBaseCost * 0.20));

      return {
        primaryLabel: 'Net Profit Per POD Order',
        primaryValue: fmtUsd(netStandard),
        primaryTone: netStandard >= 5 ? 'positive' : netStandard >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Standard POD Margin', value: marginStandard.toFixed(1) + '%' },
          { label: 'Profit w/ 20% POD Discount', value: fmtUsd(netWithPremium) + '/order' },
          { label: 'Printify Premium Break-Even', value: ordersToPayOffPremium + ' units/mo' }
        ],
        rows: [
          ['Customer Paid After ' + v.discountPct + '% Sale + Shipping', fmtUsd(grossPaid), '100.0%'],
          ['Sales Channel & Payment Fees', '-' + fmtUsd(channelFee), pct(channelFee, grossPaid)],
          ['POD Blank + Print Production Cost', '-' + fmtUsd(v.podBaseCost), pct(v.podBaseCost, grossPaid)],
          ['POD Fulfillment Shipping Cost', '-' + fmtUsd(v.podShippingCost), pct(v.podShippingCost, grossPaid)],
          ['Net Profit (Standard Blank Tier)', fmtUsd(netStandard), marginStandard.toFixed(1) + '%'],
          ['Net Profit w/ Printify Premium (~20% Off Blank)', fmtUsd(netWithPremium), pct(netWithPremium, grossPaid)]
        ],
        dynamicAdvice: 'Unlocking ~20% lower blank pricing boosts your profit per shirt/mug from ' + fmtUsd(netStandard) + ' to ' + fmtUsd(netWithPremium) + '—paying for itself once you pass ' + ordersToPayOffPremium + ' orders/month!'
      };
    `,
    faqs: [
      {
        q: 'What is a healthy profit margin for Print-on-Demand in 2026?',
        a: 'Aim for at least $7–$12 net profit per apparel item (25%–35% net margin before paid ads) so seasonal 15% sales or Etsy Offsite Ads never push an order underwater.'
      },
      {
        q: 'When does upgrading to Printify Premium make financial sense?',
        a: 'Because Printify Premium ($29/mo) discounts blank costs by up to 20% (~$2.00–$3.50 saved per shirt/hoodie), sellers typically break even at just 11 to 14 orders per month.'
      }
    ]
  },

  {
    slug: 'roas-break-even-calculator',
    category: 'ads-tax',
    shortName: 'Break-Even ROAS',
    badge: 'Meta & TikTok Ads',
    title: 'Break-Even ROAS & Target CPA Calculator for E-Commerce Ads',
    metaDescription:
      'Calculate your exact Break-Even Return on Ad Spend (ROAS), maximum allowable CPA, and net profit at 2x, 3x, and 4x ROAS for Meta, Google, and TikTok Ads.',
    h1: 'Break-Even ROAS & Maximum CPA Calculator',
    intro:
      'Never scale an unprofitable ad campaign by mistake. Know your exact Break-Even ROAS and Target Cost Per Acquisition (CPA) down to the cent.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'aov', label: 'Average Order Value — AOV ($)', type: 'number', value: 64.0, step: 1, min: 1 },
      { id: 'cogs', label: 'Landed Product Cost / COGS ($)', type: 'number', value: 16.5, step: 0.5, min: 0 },
      { id: 'shippingFulfillment', label: 'Net Shipping & Pick/Pack Cost ($)', type: 'number', value: 5.5, step: 0.5, min: 0 },
      { id: 'processingPct', label: 'Payment / Platform Fee (%)', type: 'number', value: 2.9, step: 0.1, min: 0 },
      { id: 'monthlyAdSpend', label: 'Monthly Ad Spend Budget ($)', type: 'number', value: 3000, step: 250, min: 100 },
      { id: 'actualRoas', label: 'Current / Target Campaign ROAS (e.g. 2.8)', type: 'number', value: 2.8, step: 0.1, min: 0.1 }
    ],
    computeFnBody: `
      const gatewayFee = v.aov * (v.processingPct / 100) + 0.30;
      const contributionBeforeAds = v.aov - v.cogs - v.shippingFulfillment - gatewayFee;
      const grossMarginPct = v.aov > 0 ? (contributionBeforeAds / v.aov) * 100 : 0;
      const breakEvenRoas = contributionBeforeAds > 0 ? v.aov / contributionBeforeAds : 99.9;
      const maxAllowableCpa = Math.max(0, contributionBeforeAds);

      const estRevenue = v.monthlyAdSpend * v.actualRoas;
      const estOrders = v.aov > 0 ? estRevenue / v.aov : 0;
      const netMonthlyProfit = estOrders * contributionBeforeAds - v.monthlyAdSpend;

      return {
        primaryLabel: 'Break-Even ROAS Threshold',
        primaryValue: breakEvenRoas.toFixed(2) + 'x ROAS',
        primaryTone: v.actualRoas >= breakEvenRoas ? 'positive' : 'negative',
        kpis: [
          { label: 'Max Break-Even CPA', value: fmtUsd(maxAllowableCpa) },
          { label: 'Pre-Ad Contribution Margin', value: fmtUsd(contributionBeforeAds) + ' (' + grossMarginPct.toFixed(1) + '%)' },
          { label: 'Est. Monthly Net Profit', value: fmtUsd(netMonthlyProfit) }
        ],
        rows: [
          ['Average Order Value (AOV)', fmtUsd(v.aov), '100.0%'],
          ['Landed COGS + Fulfillment + Gateway Fees', '-' + fmtUsd(v.cogs + v.shippingFulfillment + gatewayFee), pct(v.cogs + v.shippingFulfillment + gatewayFee, v.aov)],
          ['Contribution Margin (Max Allowable CPA)', fmtUsd(contributionBeforeAds), grossMarginPct.toFixed(1) + '%'],
          ['Simulated Ad Revenue at ' + v.actualRoas.toFixed(1) + 'x ROAS', fmtUsd(estRevenue), Math.round(estOrders) + ' orders'],
          ['Monthly Net Profit After ' + fmtUsd(v.monthlyAdSpend) + ' Ad Spend', fmtUsd(netMonthlyProfit), pct(netMonthlyProfit, estRevenue)]
        ],
        dynamicAdvice: v.actualRoas >= breakEvenRoas
          ? 'Profitable campaign! Your ' + v.actualRoas.toFixed(2) + 'x ROAS beats your ' + breakEvenRoas.toFixed(2) + 'x break-even threshold, generating ' + fmtUsd(netMonthlyProfit) + ' net profit.'
          : 'Warning: At ' + v.actualRoas.toFixed(2) + 'x ROAS you lose money on first-order acquisition (need ' + breakEvenRoas.toFixed(2) + 'x+ or post-purchase upsells to raise AOV).'
      };
    `,
    faqs: [
      {
        q: 'How do you calculate Break-Even ROAS?',
        a: 'Divide your Average Order Value (AOV) by your Pre-Ad Contribution Margin (AOV minus Landed COGS, shipping/fulfillment, and payment processing fees). For example, a 50% contribution margin requires a 2.00x Break-Even ROAS.'
      },
      {
        q: 'What is the fastest way to lower Break-Even ROAS?',
        a: 'Increase Average Order Value (AOV) with 2-pack bundles or post-purchase 1-click upsells on Shopify, which spreads fixed shipping and gateway costs across higher revenue.'
      }
    ]
  },

  {
    slug: 'wholesale-retail-markup-calculator',
    category: 'shopify-dtc',
    shortName: 'Wholesale & Markup',
    badge: 'DTC & B2B Pricing',
    title: 'Landed COGS, Wholesale & Retail Markup Margin Calculator',
    metaDescription:
      'Calculate landed unit cost (manufacturing + freight + import tariffs + packaging) and set profitable wholesale (50% keystone) and DTC retail prices.',
    h1: 'Landed COGS, Wholesale & Retail Margin Calculator',
    intro:
      'Price physical products so you still make healthy profit whether selling Direct-to-Consumer (DTC) or at a 50% wholesale discount to retail boutiques.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'unitFactoryCost', label: 'Factory / Manufacturing Unit Cost ($)', type: 'number', value: 4.8, step: 0.1, min: 0 },
      { id: 'freightPerUnit', label: 'Inbound Freight & Shipping Per Unit ($)', type: 'number', value: 1.15, step: 0.05, min: 0 },
      { id: 'tariffDutyPct', label: 'Import Duty / Tariff Rate (%)', type: 'number', value: 10, step: 1, min: 0 },
      { id: 'packagingCost', label: 'Custom Packaging & Inserts ($)', type: 'number', value: 0.85, step: 0.05, min: 0 },
      { id: 'targetWholesaleMarginPct', label: 'Target Wholesale Gross Margin (%)', type: 'number', value: 52, step: 1, min: 5 },
      { id: 'retailKeystoneMultiplier', label: 'Wholesale-to-Retail Multiplier (2.0 = Keystone)', type: 'number', value: 2.2, step: 0.1, min: 1.2 }
    ],
    computeFnBody: `
      const tariffCost = v.unitFactoryCost * (v.tariffDutyPct / 100);
      const landedCogs = v.unitFactoryCost + v.freightPerUnit + tariffCost + v.packagingCost;
      const safeMargin = Math.min(90, Math.max(5, v.targetWholesaleMarginPct)) / 100;
      const recommendedWholesale = landedCogs / (1 - safeMargin);
      const recommendedMsrp = recommendedWholesale * v.retailKeystoneMultiplier;
      const dtcGrossProfit = recommendedMsrp - landedCogs;
      const dtcGrossMarginPct = recommendedMsrp > 0 ? (dtcGrossProfit / recommendedMsrp) * 100 : 0;

      return {
        primaryLabel: 'Recommended DTC Retail Price (MSRP)',
        primaryValue: fmtUsd(recommendedMsrp),
        primaryTone: 'positive',
        kpis: [
          { label: 'True Landed Unit COGS', value: fmtUsd(landedCogs) },
          { label: 'B2B Wholesale Price', value: fmtUsd(recommendedWholesale) },
          { label: 'DTC Gross Margin', value: dtcGrossMarginPct.toFixed(1) + '%' }
        ],
        rows: [
          ['Factory Unit Cost + Import Duty (' + v.tariffDutyPct + '%)', fmtUsd(v.unitFactoryCost + tariffCost), 'Base'],
          ['Inbound Freight + Custom Packaging', fmtUsd(v.freightPerUnit + v.packagingCost), 'Logistics'],
          ['True Landed COGS Per Unit', fmtUsd(landedCogs), '100% Cost Basis'],
          ['Recommended B2B Wholesale Price', fmtUsd(recommendedWholesale), v.targetWholesaleMarginPct + '% Wholesale Margin'],
          ['Recommended DTC Retail MSRP (' + v.retailKeystoneMultiplier + 'x)', fmtUsd(recommendedMsrp), dtcGrossMarginPct.toFixed(1) + '% DTC Margin']
        ],
        dynamicAdvice: 'At ' + fmtUsd(recommendedMsrp) + ' DTC retail (' + dtcGrossMarginPct.toFixed(1) + '% gross margin), you have plenty of room for both paid ads and 50% wholesale retail partnerships!'
      };
    `,
    faqs: [
      {
        q: 'What is the difference between Markup % and Profit Margin %?',
        a: 'Markup is profit divided by Landed Cost (e.g., $10 cost sold for $25 = 150% markup), while Gross Margin is profit divided by Selling Price ($15 / $25 = 60% gross margin).'
      },
      {
        q: 'Why must DTC brands calculate wholesale margin from Day 1?',
        a: 'If you price a $10 landed item at $22 DTC, you cannot later offer retailers a standard 50% wholesale price ($11) without wiping out your profit. Aiming for 4x–4.5x landed COGS keeps both DTC and wholesale doors open.'
      }
    ]
  },

  // =========================================================================
  // NEW HIGH-INTENT 2026 CALCULATORS (#7 – #12)
  // =========================================================================

  {
    slug: 'amazon-fba-fee-calculator',
    category: 'marketplaces',
    shortName: 'Amazon FBA Calc',
    badge: '2026 Amazon US FBA',
    title: '2026 Amazon FBA Fee, PPC ACoS & Net Profit Margin Calculator',
    metaDescription:
      'Calculate exact 2026 Amazon US FBA profit margins including referral fees (8%–17%), FBA pick-and-pack fees, monthly storage, PPC ACoS, and ROI %.',
    h1: '2026 Amazon FBA Fee & Net Profit Calculator',
    intro:
      'Model Amazon US FBA unit economics before sending inventory to fulfillment centers—factoring in category referral fees, FBA fulfillment, inbound freight, storage, and Amazon PPC ACoS.',
    primaryAffiliate: 'linkMyBooks',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'salePrice', label: 'Amazon Listing Price ($)', type: 'number', value: 34.99, step: 0.5, min: 1 },
      {
        id: 'referralPct',
        label: 'Amazon Category Referral Fee (%)',
        type: 'select',
        value: '0.15',
        options: [
          { value: '0.15', label: '15% Standard (Home, Kitchen, Sports, Toys, Beauty $10+)' },
          { value: '0.17', label: '17% Clothing & Apparel ($20+)' },
          { value: '0.08', label: '8% Consumer Electronics / Computers' },
          { value: '0.12', label: '12% Industrial & Scientific' }
        ]
      },
      { id: 'fbaFulfillmentFee', label: 'FBA Pick & Pack Fulfillment Fee ($)', type: 'number', value: 4.75, step: 0.25, min: 0 },
      { id: 'storageInbound', label: 'Monthly Storage + Inbound Placement ($/unit)', type: 'number', value: 0.85, step: 0.05, min: 0 },
      { id: 'landedCogs', label: 'Landed Product COGS ($)', type: 'number', value: 8.2, step: 0.25, min: 0 },
      { id: 'ppcAcosPct', label: 'Blended PPC Ad Spend / TACoS (% of Price)', type: 'number', value: 12, step: 1, min: 0 }
    ],
    computeFnBody: `
      const referralFee = Math.max(0.30, v.salePrice * v.referralPct);
      const totalAmazonFees = referralFee + v.fbaFulfillmentFee + v.storageInbound;
      const adSpendUnit = v.salePrice * (v.ppcAcosPct / 100);
      const totalCost = totalAmazonFees + v.landedCogs + adSpendUnit;
      const netProfit = v.salePrice - totalCost;
      const netMarginPct = v.salePrice > 0 ? (netProfit / v.salePrice) * 100 : 0;
      const roiPct = v.landedCogs > 0 ? (netProfit / v.landedCogs) * 100 : 0;
      const breakEvenAcos = v.salePrice > 0 ? Math.max(0, ((v.salePrice - totalAmazonFees - v.landedCogs) / v.salePrice) * 100) : 0;

      return {
        primaryLabel: 'Net FBA Profit Per Unit',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 5 ? 'positive' : netProfit >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Net Profit Margin', value: netMarginPct.toFixed(1) + '%' },
          { label: 'Cash-on-Cash ROI', value: roiPct.toFixed(0) + '%' },
          { label: 'Break-Even PPC ACoS', value: breakEvenAcos.toFixed(1) + '%' }
        ],
        rows: [
          ['Amazon US Listing Price', fmtUsd(v.salePrice), '100.0%'],
          ['Amazon Referral Fee (' + (v.referralPct * 100).toFixed(0) + '%)', '-' + fmtUsd(referralFee), pct(referralFee, v.salePrice)],
          ['FBA Fulfillment + Storage / Inbound', '-' + fmtUsd(v.fbaFulfillmentFee + v.storageInbound), pct(v.fbaFulfillmentFee + v.storageInbound, v.salePrice)],
          ['Landed Product Cost (COGS)', '-' + fmtUsd(v.landedCogs), pct(v.landedCogs, v.salePrice)],
          ['Amazon PPC Ad Cost (' + v.ppcAcosPct + '% TACoS)', '-' + fmtUsd(adSpendUnit), pct(adSpendUnit, v.salePrice)],
          ['Net Seller Profit Per Unit', fmtUsd(netProfit), netMarginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: netMarginPct >= 20
          ? 'Strong FBA unit economics (' + netMarginPct.toFixed(1) + '% net margin, ' + roiPct.toFixed(0) + '% ROI). Keep PPC ACoS under ' + breakEvenAcos.toFixed(1) + '% to stay profitable on every sale.'
          : 'Margin alert (' + netMarginPct.toFixed(1) + '%): Amazon fees + PPC consume ' + pct(totalAmazonFees + adSpendUnit, v.salePrice) + '. Consider raising price by $3–$5 or cutting package weight tier.'
      };
    `,
    faqs: [
      {
        q: 'What is a good net profit margin for Amazon FBA in 2026?',
        a: 'Experienced US FBA sellers target at least 20%–30% net margin after referral fees, FBA fulfillment, storage, and blended PPC (TACoS), alongside 80%–100%+ ROI on landed inventory cost.'
      },
      {
        q: 'How do I reconcile Amazon bi-weekly FBA settlements cleanly for taxes?',
        a: 'Amazon bundles gross sales, refunds, FBA fees, storage, and PPC charges into one lump-sum deposit. Bookkeeping sync tools like Link My Books split every settlement into exact QuickBooks/Xero lines automatically.'
      }
    ]
  },

  {
    slug: 'ebay-fee-calculator',
    category: 'marketplaces',
    shortName: 'eBay Fee Calc',
    badge: '2026 eBay US Rates',
    title: '2026 eBay US Seller Fee & Profit Margin Calculator (With Promoted Listings)',
    metaDescription:
      'Calculate exact 2026 eBay US final value fees (13.6% + $0.40 per order), eBay Store discounts, Promoted Listings ad fees, and true net profit.',
    h1: '2026 eBay US Seller Fee & Net Profit Calculator',
    intro:
      'Stop getting surprised by eBay final value fees on shipping and sales tax. Enter your sale price, shipping, COGS, and Promoted Listings % to see exact take-home profit.',
    primaryAffiliate: 'linkMyBooks',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'itemPrice', label: 'Item Sale Price ($)', type: 'number', value: 48.0, step: 1, min: 0 },
      { id: 'shippingCharged', label: 'Shipping Charged to Buyer ($)', type: 'number', value: 6.95, step: 0.5, min: 0 },
      { id: 'estSalesTaxPct', label: 'Est. Buyer State Sales Tax (% — eBay fees apply to total)', type: 'number', value: 7.0, step: 0.5, min: 0 },
      {
        id: 'fvfRate',
        label: 'eBay Final Value Fee Category Tier',
        type: 'select',
        value: '0.136',
        options: [
          { value: '0.136', label: '13.6% + $0.40 Standard Most Categories (No Store)' },
          { value: '0.1235', label: '12.35% + $0.40 Basic+ eBay Store Subscriber' },
          { value: '0.15', label: '15.0% + $0.40 Books, Movies & Music' },
          { value: '0.0935', label: '9.35% + $0.40 Computers / Electronics (Store)' }
        ]
      },
      { id: 'promotedPct', label: 'Promoted Listings Standard Ad Rate (%)', type: 'number', value: 5, step: 1, min: 0 },
      { id: 'itemCost', label: 'Product Cost / COGS ($)', type: 'number', value: 14.0, step: 0.5, min: 0 },
      { id: 'actualShipping', label: 'Actual Shipping Label Cost ($)', type: 'number', value: 6.2, step: 0.25, min: 0 }
    ],
    computeFnBody: `
      const buyerSubTotal = v.itemPrice + v.shippingCharged;
      const buyerTax = buyerSubTotal * (v.estSalesTaxPct / 100);
      const feeBasis = buyerSubTotal + buyerTax;
      const perOrderFee = buyerSubTotal > 10 ? 0.40 : 0.30;
      const finalValueFee = feeBasis * v.fvfRate + perOrderFee;
      const promotedFee = feeBasis * (v.promotedPct / 100);
      const totalEbayFees = finalValueFee + promotedFee;
      const netProfit = buyerSubTotal - totalEbayFees - v.itemCost - v.actualShipping;
      const marginPct = buyerSubTotal > 0 ? (netProfit / buyerSubTotal) * 100 : 0;
      const effectiveFeePct = buyerSubTotal > 0 ? (totalEbayFees / buyerSubTotal) * 100 : 0;

      return {
        primaryLabel: 'Net eBay Seller Profit',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 0 ? 'positive' : 'negative',
        kpis: [
          { label: 'Net Profit Margin', value: marginPct.toFixed(1) + '%' },
          { label: 'Total eBay Fees', value: fmtUsd(totalEbayFees) + ' (' + effectiveFeePct.toFixed(1) + '%)' },
          { label: 'Payout Before COGS', value: fmtUsd(buyerSubTotal - totalEbayFees - v.actualShipping) }
        ],
        rows: [
          ['Buyer Subtotal (Item + Shipping)', fmtUsd(buyerSubTotal), '100.0%'],
          ['Fee Basis incl. Est. ' + v.estSalesTaxPct + '% Sales Tax', fmtUsd(feeBasis), 'eBay Fee Basis'],
          ['eBay Final Value Fee + Per-Order Fee', '-' + fmtUsd(finalValueFee), pct(finalValueFee, buyerSubTotal)],
          ['Promoted Listings Ad Fee (' + v.promotedPct + '%)', '-' + fmtUsd(promotedFee), pct(promotedFee, buyerSubTotal)],
          ['Item COGS + Actual Shipping Label', '-' + fmtUsd(v.itemCost + v.actualShipping), pct(v.itemCost + v.actualShipping, buyerSubTotal)],
          ['Net Seller Take-Home Profit', fmtUsd(netProfit), marginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: effectiveFeePct > 18
          ? 'Warning: eBay Final Value + Promoted Listings fees are taking ' + effectiveFeePct.toFixed(1) + '% of your revenue! Cross-list repeat SKUs on a 0%-commission Shopify store.'
          : 'Solid margin (' + marginPct.toFixed(1) + '%). Remember eBay calculates Final Value Fees on item + shipping + buyer sales tax—always price with a 15%+ fee buffer.'
      };
    `,
    faqs: [
      {
        q: 'Does eBay charge final value fees on sales tax and shipping in 2026?',
        a: 'Yes. eBay calculates its Final Value Fee percentage (commonly 13.6% for non-store accounts) on the total amount of the sale—including item price, shipping charged, and buyer sales tax—plus $0.40 per order over $10.'
      },
      {
        q: 'When does an eBay Basic Store subscription pay for itself?',
        a: 'A Basic Store (~$21.95/mo billed annually) lowers most category fees by ~1.25%, paying for itself once your shop sells roughly $1,800+ per month.'
      }
    ]
  },

  {
    slug: 'shopify-fee-calculator',
    category: 'shopify-dtc',
    shortName: 'Shopify Fee Calc',
    badge: 'Basic vs Grow vs Advanced',
    title: '2026 Shopify Plan & Payment Fee Calculator (Basic vs. Grow vs. Advanced)',
    metaDescription:
      'Calculate exact 2026 Shopify Payments fees and compare Basic ($39/mo), Grow ($105/mo), and Advanced ($399/mo) to find the cheapest plan for your monthly revenue.',
    h1: '2026 Shopify Plan & Credit Card Fee Calculator',
    intro:
      'Find out which Shopify plan saves you the most money at your monthly sales volume—and see how much third-party payment gateways cost if you do not use Shopify Payments.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'monthlyRevenue', label: 'Monthly Gross Store Revenue ($)', type: 'number', value: 18000, step: 1000, min: 100 },
      { id: 'monthlyOrders', label: 'Monthly Order Count', type: 'number', value: 300, step: 10, min: 1 },
      {
        id: 'billingCycle',
        label: 'Shopify Billing Cycle',
        type: 'select',
        value: 'monthly',
        options: [
          { value: 'monthly', label: 'Monthly Billing ($39 / $105 / $399)' },
          { value: 'annual', label: 'Annual Billing (~25% Off: $29 / $79 / $299)' }
        ]
      },
      {
        id: 'gatewayType',
        label: 'Payment Gateway Used',
        type: 'select',
        value: 'shopify_payments',
        options: [
          { value: 'shopify_payments', label: 'Shopify Payments (0% Extra Transaction Fee)' },
          { value: 'third_party', label: '3rd-Party Gateway (Adds 2.0% / 1.0% / 0.6% Penalty)' }
        ]
      }
    ],
    computeFnBody: `
      const isAnnual = v.billingCycle === 'annual';
      const isThirdParty = v.gatewayType === 'third_party';

      const basicSub = isAnnual ? 29 : 39;
      const growSub = isAnnual ? 79 : 105;
      const advSub = isAnnual ? 299 : 399;

      const basicCard = v.monthlyRevenue * 0.029 + v.monthlyOrders * 0.30 + (isThirdParty ? v.monthlyRevenue * 0.02 : 0);
      const growCard = v.monthlyRevenue * 0.027 + v.monthlyOrders * 0.30 + (isThirdParty ? v.monthlyRevenue * 0.01 : 0);
      const advCard = v.monthlyRevenue * 0.025 + v.monthlyOrders * 0.30 + (isThirdParty ? v.monthlyRevenue * 0.006 : 0);

      const basicTotal = basicSub + basicCard;
      const growTotal = growSub + growCard;
      const advTotal = advSub + advCard;

      const plans = [
        { name: 'Shopify Basic', total: basicTotal },
        { name: 'Shopify Grow', total: growTotal },
        { name: 'Shopify Advanced', total: advTotal }
      ].sort((a, b) => a.total - b.total);

      const best = plans[0];
      const worst = plans[2];
      const annualDiff = (worst.total - best.total) * 12;

      return {
        primaryLabel: 'Lowest-Cost Shopify Plan For You',
        primaryValue: best.name + ' (' + fmtUsd(best.total) + '/mo)',
        primaryTone: 'positive',
        kpis: [
          { label: 'Effective Fee Rate', value: pct(best.total, v.monthlyRevenue) },
          { label: 'Basic Total / Mo', value: fmtUsd(basicTotal) },
          { label: 'Grow Total / Mo', value: fmtUsd(growTotal) }
        ],
        rows: [
          ['Monthly Gross Store Sales', fmtUsd(v.monthlyRevenue), v.monthlyOrders + ' orders'],
          ['Shopify Basic Total (Plan + Processing)', '-' + fmtUsd(basicTotal), pct(basicTotal, v.monthlyRevenue)],
          ['Shopify Grow Total (Plan + Processing)', '-' + fmtUsd(growTotal), pct(growTotal, v.monthlyRevenue)],
          ['Shopify Advanced Total (Plan + Processing)', '-' + fmtUsd(advTotal), pct(advTotal, v.monthlyRevenue)],
          ['Annual Savings vs. Highest-Cost Tier', '+' + fmtUsd(annualDiff) + '/yr', 'Optimized Plan']
        ],
        dynamicAdvice: isThirdParty
          ? 'Using a third-party gateway adds ' + fmtUsd(v.monthlyRevenue * 0.02) + '/mo in avoidable surcharges on Basic! Switching to Shopify Payments eliminates the extra 0.6%–2.0% fee.'
          : best.name + ' is your mathematical sweet spot at ' + fmtUsd(v.monthlyRevenue) + '/mo revenue (effective all-in platform + card cost: ' + pct(best.total, v.monthlyRevenue) + ').'
      };
    `,
    faqs: [
      {
        q: 'At what monthly revenue should I upgrade from Shopify Basic to Shopify Grow?',
        a: 'On Shopify Payments, the card rate drops by 0.2% (2.9% to 2.7%) while the monthly plan rises by $50–$66/mo—meaning Grow breaks even on processing fees around $25,000–$33,000/month in revenue.'
      },
      {
        q: 'Does Shopify charge a marketplace commission like Etsy or Amazon?',
        a: 'No. When using Shopify Payments, Shopify charges 0% marketplace referral commission—you only pay the flat monthly subscription and standard credit card processing.'
      }
    ]
  },

  {
    slug: 'etsy-offsite-ads-calculator',
    category: 'etsy-pod',
    shortName: 'Etsy Offsite Ads',
    badge: '12% & 15% Survival Tool',
    title: '2026 Etsy Offsite Ads Calculator — Exact Price Buffer Formula',
    metaDescription:
      'Protect your Etsy shop from 12% mandatory or 15% Offsite Ads fees. Calculate your exact worst-case profit, blended margin, and safe price adjustment.',
    h1: 'Etsy Offsite Ads Survival & Price Adjustment Calculator',
    intro:
      'Once your shop passes $10,000/year, Etsy permanently enrolls you in 12% Offsite Ads. Calculate your exact price increase needed so an attributed ad click never wipes out your profit.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'currentPrice', label: 'Current Item + Shipping Total ($)', type: 'number', value: 40.0, step: 1, min: 1 },
      { id: 'unitDirectCost', label: 'Product COGS + Actual Postage ($)', type: 'number', value: 16.5, step: 0.5, min: 0 },
      {
        id: 'offsiteTier',
        label: 'Your Etsy Offsite Ads Fee Rate',
        type: 'select',
        value: '0.12',
        options: [
          { value: '0.12', label: '12% Mandatory Tier (Shop Over $10k/yr)' },
          { value: '0.15', label: '15% Standard Tier (Shop Under $10k/yr)' }
        ]
      },
      { id: 'offsiteOrderSharePct', label: '% of Your Total Orders Coming From Offsite Ads', type: 'number', value: 18, step: 2, min: 0 },
      { id: 'targetNetProfit', label: 'Minimum Net Profit Wanted on Worst-Case Ad Order ($)', type: 'number', value: 8.0, step: 0.5, min: 0 }
    ],
    computeFnBody: `
      const baseFeeRate = 0.095;
      const organicFees = 0.45 + v.currentPrice * baseFeeRate;
      const organicProfit = v.currentPrice - v.unitDirectCost - organicFees;

      const offsiteFee = Math.min(100, v.currentPrice * v.offsiteTier);
      const worstCaseProfit = organicProfit - offsiteFee;

      const share = Math.min(100, Math.max(0, v.offsiteOrderSharePct)) / 100;
      const blendedProfit = organicProfit * (1 - share) + worstCaseProfit * share;
      const blendedBufferPrice = v.currentPrice + offsiteFee * share / Math.max(0.1, 1 - baseFeeRate - v.offsiteTier * share);
      const safeWorstCasePrice = (v.unitDirectCost + 0.45 + v.targetNetProfit) / Math.max(0.1, 1 - baseFeeRate - v.offsiteTier);

      return {
        primaryLabel: 'Worst-Case Profit (When Offsite Ad Triggers)',
        primaryValue: fmtUsd(worstCaseProfit),
        primaryTone: worstCaseProfit >= v.targetNetProfit ? 'positive' : worstCaseProfit >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Organic Order Profit', value: fmtUsd(organicProfit) },
          { label: 'Blended Avg Profit', value: fmtUsd(blendedProfit) },
          { label: 'Price to Keep $' + v.targetNetProfit.toFixed(0) + ' Profit', value: fmtUsd(safeWorstCasePrice) }
        ],
        rows: [
          ['Current Buyer Order Total', fmtUsd(v.currentPrice), '100.0%'],
          ['Base Etsy Fees (6.5% + 3% + $0.45)', '-' + fmtUsd(organicFees), pct(organicFees, v.currentPrice)],
          ['Offsite Ads Surcharge (' + (v.offsiteTier * 100).toFixed(0) + '%, max $100)', '-' + fmtUsd(offsiteFee), pct(offsiteFee, v.currentPrice)],
          ['Direct Cost (COGS + Postage)', '-' + fmtUsd(v.unitDirectCost), pct(v.unitDirectCost, v.currentPrice)],
          ['Net Profit on Offsite-Attributed Order', fmtUsd(worstCaseProfit), pct(worstCaseProfit, v.currentPrice)],
          ['Recommended Blended Buffer Price (+' + v.offsiteOrderSharePct + '% share)', fmtUsd(blendedBufferPrice), 'Protects Avg Margin']
        ],
        dynamicAdvice: worstCaseProfit < 0
          ? 'DANGER: You LOSE ' + fmtUsd(Math.abs(worstCaseProfit)) + ' every time an Offsite Ad converts! Raise your price to at least ' + fmtUsd(blendedBufferPrice) + ' (or ' + fmtUsd(safeWorstCasePrice) + ' for full protection).'
          : 'To keep your average margin intact across ' + v.offsiteOrderSharePct + '% attributed orders, raise your listing price by just ' + fmtUsd(Math.max(0, blendedBufferPrice - v.currentPrice)) + ' (to ' + fmtUsd(blendedBufferPrice) + ').'
      };
    `,
    faqs: [
      {
        q: 'Should I raise my Etsy prices by the full 12% to cover Offsite Ads?',
        a: 'Usually no—if only 15%–20% of your orders come from Offsite Ads, raising every listing by just 2.5%–3.5% mathematically absorbs the blended cost without hurting your organic conversion rate.'
      },
      {
        q: 'Can a repeat customer trigger Etsy Offsite Ads again?',
        a: 'Yes! Any click on an Etsy Offsite Ad within 30 days attaches the 12%/15% fee to ALL orders that buyer places from your shop in that window—which is why moving repeat customers to Shopify protects your margins.'
      }
    ]
  },

  {
    slug: 'printful-vs-printify-calculator',
    category: 'etsy-pod',
    shortName: 'Printify vs Printful',
    badge: 'POD Supplier Showdown',
    title: '2026 Printify vs. Printful Profit Margin & Monthly Savings Calculator',
    metaDescription:
      'Compare exact per-shirt and annual profit between Printify Standard, Printify Premium ($29/mo), and Printful across your monthly Print-on-Demand order volume.',
    h1: 'Printify vs. Printful Monthly Profit Comparison Calculator',
    intro:
      'Choosing the right Print-on-Demand supplier can add $3–$5 pure profit to every hoodie or t-shirt. Compare Printify Standard, Printify Premium (20% blank discount), and Printful side-by-side.',
    primaryAffiliate: 'printify',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'podMatrix',
    inputs: [
      { id: 'monthlyOrders', label: 'Monthly POD Units Sold', type: 'number', value: 80, step: 10, min: 1 },
      { id: 'customerPaid', label: 'Customer Total Paid (Price + Shipping $)', type: 'number', value: 33.99, step: 0.5, min: 1 },
      { id: 'printifyStdCost', label: 'Printify Standard Blank + Print + Ship ($)', type: 'number', value: 15.25, step: 0.25, min: 1 },
      { id: 'printifyPremCost', label: 'Printify Premium Blank + Print + Ship ($)', type: 'number', value: 12.95, step: 0.25, min: 1 },
      { id: 'printfulCost', label: 'Printful Equivalent Blank + Print + Ship ($)', type: 'number', value: 18.65, step: 0.25, min: 1 },
      {
        id: 'channelFeeRate',
        label: 'Storefront Channel Fee',
        type: 'select',
        value: '0.095',
        options: [
          { value: '0.095', label: 'Etsy US (~9.5% + $0.45)' },
          { value: '0.029', label: 'Shopify Payments (~2.9% + $0.30)' },
          { value: '0.06', label: 'TikTok Shop US (6.0%)' }
        ]
      }
    ],
    computeFnBody: `
      const fixedFee = v.channelFeeRate === 0.095 ? 0.45 : v.channelFeeRate === 0.029 ? 0.30 : 0;
      const channelFeePerOrder = v.customerPaid * v.channelFeeRate + fixedFee;
      const netRevPerOrder = v.customerPaid - channelFeePerOrder;

      const profitPrintifyStd = (netRevPerOrder - v.printifyStdCost) * v.monthlyOrders;
      const profitPrintifyPrem = (netRevPerOrder - v.printifyPremCost) * v.monthlyOrders - 29;
      const profitPrintful = (netRevPerOrder - v.printfulCost) * v.monthlyOrders;

      const bestMonthly = Math.max(profitPrintifyStd, profitPrintifyPrem, profitPrintful);
      const bestLabel = bestMonthly === profitPrintifyPrem ? 'Printify Premium' : bestMonthly === profitPrintifyStd ? 'Printify Standard' : 'Printful';
      const annualAdvantage = (profitPrintifyPrem - profitPrintful) * 12;

      return {
        primaryLabel: 'Annual Profit Gain (Printify Premium vs. Printful)',
        primaryValue: (annualAdvantage >= 0 ? '+' : '-') + fmtUsd(Math.abs(annualAdvantage)) + '/yr',
        primaryTone: annualAdvantage >= 0 ? 'positive' : 'neutral',
        kpis: [
          { label: 'Best Profit Winner', value: bestLabel },
          { label: 'Printify Premium / Mo', value: fmtUsd(profitPrintifyPrem) },
          { label: 'Printful / Mo', value: fmtUsd(profitPrintful) }
        ],
        rows: [
          ['Monthly Net Sales After Store Fees', fmtUsd(netRevPerOrder * v.monthlyOrders), v.monthlyOrders + ' units'],
          ['Printify Standard Monthly Net Profit', fmtUsd(profitPrintifyStd), fmtUsd(netRevPerOrder - v.printifyStdCost) + '/unit'],
          ['Printify Premium Net Profit (incl. $29/mo)', fmtUsd(profitPrintifyPrem), fmtUsd((profitPrintifyPrem / Math.max(1, v.monthlyOrders))) + '/unit'],
          ['Printful Monthly Net Profit', fmtUsd(profitPrintful), fmtUsd(netRevPerOrder - v.printfulCost) + '/unit'],
          ['12-Month Profit Difference (Premium vs Printful)', (annualAdvantage >= 0 ? '+' : '-') + fmtUsd(Math.abs(annualAdvantage)), 'Per Year']
        ],
        dynamicAdvice: bestLabel + ' generates the highest take-home profit at ' + v.monthlyOrders + ' orders/month (' + fmtUsd(bestMonthly) + '/mo net)—saving ' + fmtUsd(Math.abs(profitPrintifyPrem - profitPrintful)) + '/month compared to Printful!'
      };
    `,
    faqs: [
      {
        q: 'Why is Printify typically cheaper per garment than Printful?',
        a: 'Printify connects you to 90+ competing print providers (such as Monster Digital and SwiftPOD) instead of owning single in-house factories, allowing Printify Premium members to save $2.50–$5.50 per apparel order.'
      },
      {
        q: 'How many monthly orders justify Printify Premium ($29/month)?',
        a: 'With an average $2.30 savings per tee or $4.00 per hoodie, Printify Premium pays for itself at roughly 8 to 13 orders per month.'
      }
    ]
  },

  {
    slug: 'ecommerce-tax-calculator',
    category: 'ads-tax',
    shortName: 'Seller Tax Calc',
    badge: '2026 IRS Schedule-C',
    title: '2026 US E-Commerce Self-Employment & Quarterly Tax Estimator',
    metaDescription:
      'Estimate 2026 US Schedule-C net profit, 15.3% self-employment tax, federal income tax, and quarterly IRS 1040-ES payments for Etsy, Shopify, and Amazon sellers.',
    h1: '2026 US E-Commerce Seller Tax & Quarterly 1040-ES Estimator',
    intro:
      'Never get blindsided in April. Estimate your IRS Schedule-C taxable profit, 15.3% self-employment tax, quarterly set-aside percentage, and how much every $1,000 in tracked deductions saves you.',
    primaryAffiliate: 'linkMyBooks',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'annualGrossSales', label: 'Projected Annual Gross Sales ($)', type: 'number', value: 60000, step: 2500, min: 0 },
      { id: 'cogsAndShipping', label: 'Annual COGS, Materials & Postage ($)', type: 'number', value: 21000, step: 1000, min: 0 },
      { id: 'platformAndAdFees', label: 'Annual Marketplace Fees & Ad Spend ($)', type: 'number', value: 11500, step: 500, min: 0 },
      { id: 'writeOffs', label: 'Schedule-C Write-Offs (Home Office, Software, Supplies $)', type: 'number', value: 4500, step: 250, min: 0 },
      {
        id: 'fedTaxBracket',
        label: 'Estimated Federal Marginal Income Tax Rate',
        type: 'select',
        value: '0.12',
        options: [
          { value: '0.10', label: '10% Federal Bracket' },
          { value: '0.12', label: '12% Federal Bracket (Most Solo Sellers)' },
          { value: '0.22', label: '22% Federal Bracket' },
          { value: '0.24', label: '24% Federal Bracket' }
        ]
      },
      { id: 'stateTaxPct', label: 'State Income Tax Rate (0% for TX/FL/WA/NV)', type: 'number', value: 5.0, step: 0.5, min: 0 }
    ],
    computeFnBody: `
      const totalDeductions = v.cogsAndShipping + v.platformAndAdFees + v.writeOffs;
      const netScheduleC = Math.max(0, v.annualGrossSales - totalDeductions);
      const seTaxable = netScheduleC * 0.9235;
      const seTax = seTaxable * 0.153;
      const halfSeDeduction = seTax * 0.5;
      const qbiEligible = Math.max(0, netScheduleC - halfSeDeduction);
      const qbiDeduction = qbiEligible * 0.20;
      const fedTaxable = Math.max(0, qbiEligible - qbiDeduction);
      const estFedTax = fedTaxable * v.fedTaxBracket;
      const estStateTax = netScheduleC * (v.stateTaxPct / 100);
      const totalEstTax = seTax + estFedTax + estStateTax;
      const quarterlyPayment = totalEstTax / 4;
      const savePctOfProfit = netScheduleC > 0 ? (totalEstTax / netScheduleC) * 100 : 0;
      const deductionTaxSavings = v.writeOffs * (0.1413 + v.fedTaxBracket * 0.8 + v.stateTaxPct / 100);

      return {
        primaryLabel: 'Estimated Quarterly IRS + State Tax Set-Aside',
        primaryValue: fmtUsd(quarterlyPayment) + '/qtr',
        primaryTone: 'neutral',
        kpis: [
          { label: 'Net Schedule-C Profit', value: fmtUsd(netScheduleC) },
          { label: 'Est. Annual Total Tax', value: fmtUsd(totalEstTax) },
          { label: 'Set Aside % of Profit', value: savePctOfProfit.toFixed(1) + '%' }
        ],
        rows: [
          ['Annual Gross Marketplace & Store Sales', fmtUsd(v.annualGrossSales), '100.0%'],
          ['Deductible COGS + Fees + Ads + Write-Offs', '-' + fmtUsd(totalDeductions), pct(totalDeductions, v.annualGrossSales)],
          ['Net Schedule-C Business Profit', fmtUsd(netScheduleC), pct(netScheduleC, v.annualGrossSales)],
          ['Self-Employment Tax (15.3% on 92.35% net)', '-' + fmtUsd(seTax), pct(seTax, netScheduleC)],
          ['Est. Federal + State Income Tax (after 20% QBI)', '-' + fmtUsd(estFedTax + estStateTax), pct(estFedTax + estStateTax, netScheduleC)],
          ['Estimated Tax Saved by Logging $' + v.writeOffs.toLocaleString() + ' Write-Offs', '+' + fmtUsd(deductionTaxSavings), 'Cash Kept']
        ],
        dynamicAdvice: 'Set aside ' + savePctOfProfit.toFixed(0) + '% of net profit (' + fmtUsd(quarterlyPayment) + ' every quarter) into a separate tax savings account. Logging your ' + fmtUsd(v.writeOffs) + ' in Schedule-C deductions saves roughly ' + fmtUsd(deductionTaxSavings) + ' in taxes!'
      };
    `,
    faqs: [
      {
        q: 'How much should an Etsy or Shopify seller set aside for US taxes?',
        a: 'Most US sole proprietors set aside 25%–30% of their net business profit (after COGS, platform fees, shipping, and expenses) to cover the 15.3% self-employment tax plus federal and state income tax.'
      },
      {
        q: 'Do marketplace fees and shipping labels count as Schedule-C deductions?',
        a: 'Yes! Every 1099-K reports gross unadjusted sales—so you must deduct your Etsy/Shopify/Amazon fees, shipping labels, packaging, product COGS, ad spend, software, and home office expenses on Schedule C so you never overpay tax.'
      }
    ]
  },

  // =========================================================================
  // SHOPMARGINLAB V3 CALCULATORS (#13 – #18): SHOPIFY MARGIN, DIGITAL ETSY,
  // POSHMARK, MERCARI, WHATNOT LIVE SELLING & BUNDLE DISCOUNT OPTIMIZER
  // =========================================================================

  {
    slug: 'shopify-profit-margin-calculator',
    category: 'shopify-dtc',
    shortName: 'Shopify Profit Calc',
    badge: '2026 Shopify DTC',
    title: '2026 Shopify Net Profit Margin & Order Economics Calculator',
    metaDescription:
      'Calculate true Shopify per-order net profit after landed COGS, shipping & packaging, Shopify Payments fees (2.9% + $0.30), Meta/TikTok CPA, and return rate.',
    h1: '2026 Shopify Order Net Profit Margin Calculator',
    intro:
      'See what you actually keep per Shopify order after landed COGS, postage, Shopify Payments card fees, paid customer acquisition cost (CPA), and realistic return allowances.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'orderPrice', label: 'Customer Order Value — AOV ($)', type: 'number', value: 68.0, step: 1, min: 1 },
      { id: 'shippingCharged', label: 'Shipping Paid by Customer ($)', type: 'number', value: 0, step: 0.5, min: 0 },
      { id: 'landedCogs', label: 'Landed Product COGS ($)', type: 'number', value: 15.5, step: 0.5, min: 0 },
      { id: 'shippingPack', label: 'Actual Postage + Box/Mailer ($)', type: 'number', value: 6.25, step: 0.25, min: 0 },
      {
        id: 'planRate',
        label: 'Shopify Payments Card Rate',
        type: 'select',
        value: '0.029',
        options: [
          { value: '0.029', label: '2.9% + $0.30 (Shopify Basic)' },
          { value: '0.027', label: '2.7% + $0.30 (Shopify Grow)' },
          { value: '0.025', label: '2.5% + $0.30 (Shopify Advanced)' }
        ]
      },
      { id: 'adCpa', label: 'Paid Ad Cost Per Order / CPA ($)', type: 'number', value: 18.0, step: 1, min: 0 },
      { id: 'returnRatePct', label: 'Expected Refund / Return Reserve (%)', type: 'number', value: 3.0, step: 0.5, min: 0 }
    ],
    computeFnBody: `
      const gross = v.orderPrice + v.shippingCharged;
      const cardFee = gross > 0 ? gross * v.planRate + 0.30 : 0;
      const returnReserve = gross * (Math.min(50, Math.max(0, v.returnRatePct)) / 100);
      const totalCosts = v.landedCogs + v.shippingPack + cardFee + v.adCpa + returnReserve;
      const netProfit = gross - totalCosts;
      const netMarginPct = gross > 0 ? (netProfit / gross) * 100 : 0;
      const contributionBeforeAds = gross - v.landedCogs - v.shippingPack - cardFee - returnReserve;
      const breakEvenRoas = contributionBeforeAds > 0 ? gross / contributionBeforeAds : 99.9;

      return {
        primaryLabel: 'True Net Profit Per Shopify Order',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 10 ? 'positive' : netProfit >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Net Profit Margin', value: netMarginPct.toFixed(1) + '%' },
          { label: 'Pre-Ad Margin (Max CPA)', value: fmtUsd(contributionBeforeAds) },
          { label: 'Break-Even ROAS', value: breakEvenRoas.toFixed(2) + 'x' }
        ],
        rows: [
          ['Gross Checkout Revenue (Order + Shipping)', fmtUsd(gross), '100.0%'],
          ['Shopify Payments Processing Fee', '-' + fmtUsd(cardFee), pct(cardFee, gross)],
          ['Landed COGS + Fulfillment Postage', '-' + fmtUsd(v.landedCogs + v.shippingPack), pct(v.landedCogs + v.shippingPack, gross)],
          ['Paid Acquisition Cost (Meta / TikTok CPA)', '-' + fmtUsd(v.adCpa), pct(v.adCpa, gross)],
          ['Refund / Return Allowance (' + v.returnRatePct + '%)', '-' + fmtUsd(returnReserve), pct(returnReserve, gross)],
          ['Net Take-Home Profit Per Order', fmtUsd(netProfit), netMarginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: netMarginPct >= 20
          ? 'Healthy DTC unit economics (' + netMarginPct.toFixed(1) + '% net margin after ads)! Automate daily Shopify payout reconciliation into QuickBooks/Xero with Link My Books.'
          : 'Margin check (' + netMarginPct.toFixed(1) + '%): Raising AOV via 2-pack bundles or post-purchase upsells lifts contribution margin without raising your shipping or ad CPA.'
      };
    `,
    faqs: [
      {
        q: 'What is a healthy net profit margin for a Shopify DTC store in 2026?',
        a: 'Healthy Shopify brands target 60%–75% gross margin before ads and 15%–25% net profit margin after shipping, payment processing, returns, and paid customer acquisition (Meta/TikTok/Google Ads).'
      },
      {
        q: 'Why should Shopify sellers model a 2%–5% return reserve?',
        a: 'Even low-return niches experience damaged packages, chargebacks, or size exchanges. Building a 3% return reserve into per-order pricing prevents silent profit leaks at scale.'
      }
    ]
  },

  {
    slug: 'etsy-digital-product-profit-calculator',
    category: 'etsy-pod',
    shortName: 'Etsy Digital Calc',
    badge: 'Digital Downloads 2026',
    title: '2026 Etsy Digital Product Profit & Fee Calculator (PDF, Canva, SVG)',
    metaDescription:
      'Calculate exact 2026 Etsy fees and net profit for digital downloads (printables, Canva templates, SVGs, spreadsheets) — $0 shipping, $0 COGS, 6.5% + 3% + $0.45.',
    h1: '2026 Etsy Digital Product Profit & Monthly Income Calculator',
    intro:
      'Digital downloads have $0 postage and $0 unit manufacturing cost—but Etsy’s fixed $0.45 per-order fees bite hard on $2–$5 files. Find your sweet-spot price and monthly income goal.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'listingPrice', label: 'Digital Product Price ($ USD)', type: 'number', value: 9.0, step: 0.5, min: 0.5 },
      { id: 'discountPct', label: 'Shop Sale / Coupon Discount (%)', type: 'number', value: 20, step: 5, min: 0 },
      { id: 'monthlySales', label: 'Estimated Monthly Units Sold', type: 'number', value: 120, step: 10, min: 1 },
      {
        id: 'offsiteAdsRate',
        label: 'Etsy Offsite Ads Attribution',
        type: 'select',
        value: '0',
        options: [
          { value: '0', label: 'Organic Search / Pinterest — 0% Offsite Ads' },
          { value: '0.15', label: '15% Offsite Ads (Shop under $10k/yr)' },
          { value: '0.12', label: '12% Mandatory Offsite Ads (Shop $10k+/yr)' }
        ]
      },
      { id: 'monthlyAdsSpend', label: 'Optional Monthly Etsy Ads Budget ($)', type: 'number', value: 45, step: 5, min: 0 }
    ],
    computeFnBody: `
      const netSalePrice = v.listingPrice * (1 - Math.min(90, Math.max(0, v.discountPct)) / 100);
      const listingRenewFee = 0.20;
      const transactionFee = netSalePrice * 0.065;
      const paymentFee = netSalePrice * 0.03 + 0.25;
      const offsiteFee = Math.min(100, netSalePrice * v.offsiteAdsRate);
      const feePerOrder = listingRenewFee + transactionFee + paymentFee + offsiteFee;
      const netPerOrder = netSalePrice - feePerOrder;
      const unitMarginPct = netSalePrice > 0 ? (netPerOrder / netSalePrice) * 100 : 0;

      const monthlyGross = netSalePrice * v.monthlySales;
      const monthlyFees = feePerOrder * v.monthlySales;
      const monthlyNet = monthlyGross - monthlyFees - v.monthlyAdsSpend;
      const salesFor2k = netPerOrder > 0 ? Math.ceil((2000 + v.monthlyAdsSpend) / netPerOrder) : 0;

      return {
        primaryLabel: 'Monthly Net Digital Product Income',
        primaryValue: fmtUsd(monthlyNet) + '/mo',
        primaryTone: monthlyNet >= 0 ? 'positive' : 'negative',
        kpis: [
          { label: 'Net Profit / Download', value: fmtUsd(netPerOrder) + ' (' + unitMarginPct.toFixed(1) + '%)' },
          { label: 'Etsy Fee / Sale', value: fmtUsd(feePerOrder) + ' (' + pct(feePerOrder, netSalePrice) + ')' },
          { label: 'Sales Needed For $2k/mo', value: salesFor2k + ' sales/mo' }
        ],
        rows: [
          ['Net Checkout Price After ' + v.discountPct + '% Sale', fmtUsd(netSalePrice), 'Per Download'],
          ['Etsy Fixed Fees ($0.20 Auto-Renew + $0.25 Payment)', '-' + fmtUsd(0.45), pct(0.45, netSalePrice)],
          ['Etsy Percentage Fees (6.5% + 3% + Offsite)', '-' + fmtUsd(transactionFee + netSalePrice * 0.03 + offsiteFee), pct(transactionFee + netSalePrice * 0.03 + offsiteFee, netSalePrice)],
          ['Net Profit Per Single Digital Download', fmtUsd(netPerOrder), unitMarginPct.toFixed(1) + '%'],
          ['Projected Monthly Gross (' + v.monthlySales + ' sales)', fmtUsd(monthlyGross), '100.0%'],
          ['Projected Monthly Net After Etsy Fees & Ads', fmtUsd(monthlyNet), pct(monthlyNet, monthlyGross)]
        ],
        dynamicAdvice: netSalePrice < 5
          ? 'Fee-drag warning: At ' + fmtUsd(netSalePrice) + ', Etsy’s fixed $0.45 alone eats ' + pct(0.45, netSalePrice) + '! Bundle 5–10 templates into a $15–$24 Mega Pack to keep 86%+ net margin.'
          : 'High-margin digital unit economics (' + unitMarginPct.toFixed(1) + '% kept per order)! You need ' + salesFor2k + ' downloads/month at this price to hit $2,000/month net.'
      };
    `,
    faqs: [
      {
        q: 'Why do cheap $2–$3 Etsy digital downloads have terrible fee percentages?',
        a: 'Because Etsy charges $0.20 auto-renewal + $0.25 fixed payment processing ($0.45 flat) on top of 9.5% — meaning a $2.50 printable loses 27.5% to Etsy fees before ads! Bundling templates at $12–$24 slashes the effective fee rate down to ~11.5%.'
      },
      {
        q: 'Do digital product sellers still pay the $0.20 Etsy listing fee on every sale?',
        a: 'Yes. Even though digital files have unlimited inventory, Etsy charges a $0.20 automatic renewal fee every single time a buyer purchases a copy.'
      }
    ]
  },

  {
    slug: 'poshmark-fee-calculator',
    category: 'marketplaces',
    shortName: 'Poshmark Fees',
    badge: '2026 Poshmark US',
    title: '2026 Poshmark US Fee & Reseller Profit Calculator ($2.95 / 20%)',
    metaDescription:
      'Calculate exact 2026 Poshmark US seller fees ($2.95 flat under $15, 20% over $15), shipping discounts on Offer to Likers, sourcing COGS, and reseller ROI.',
    h1: '2026 Poshmark US Fee & Reseller Profit Calculator',
    intro:
      'Instantly see your exact Poshmark payout after the $2.95 flat fee (under $15) or 20% commission ($15+), Offer-to-Likers shipping discounts, and thrift/liquidation sourcing cost.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'linkMyBooks',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'salePrice', label: 'Poshmark Sold Price ($)', type: 'number', value: 42.0, step: 1, min: 3 },
      { id: 'itemCogs', label: 'Sourcing / Thrift / Wholesale Cost ($)', type: 'number', value: 11.0, step: 0.5, min: 0 },
      {
        id: 'shippingDiscount',
        label: 'Seller Shipping Discount Offered (OTL / Closet Clear Out)',
        type: 'select',
        value: '0',
        options: [
          { value: '0', label: '$0.00 — Buyer Pays Full Poshmark Shipping' },
          { value: '2.02', label: '$2.02 — Discounted $5.95 Shipping Offer' },
          { value: '3.02', label: '$3.02 — Discounted $4.95 Shipping Offer' },
          { value: '7.97', label: '$7.97 — Free Shipping Paid By Seller' }
        ]
      },
      { id: 'suppliesCost', label: 'Poly Mailer / Tape / Thank-You Card ($)', type: 'number', value: 0.5, step: 0.1, min: 0 }
    ],
    computeFnBody: `
      const poshFee = v.salePrice < 15 ? 2.95 : v.salePrice * 0.20;
      const payout = v.salePrice - poshFee - v.shippingDiscount;
      const netProfit = payout - v.itemCogs - v.suppliesCost;
      const marginPct = v.salePrice > 0 ? (netProfit / v.salePrice) * 100 : 0;
      const roiPct = v.itemCogs > 0 ? (netProfit / v.itemCogs) * 100 : 0;
      const effectiveTakePct = v.salePrice > 0 ? ((poshFee + v.shippingDiscount) / v.salePrice) * 100 : 0;

      return {
        primaryLabel: 'Net Poshmark Reseller Profit',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 10 ? 'positive' : netProfit >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Poshmark Payout', value: fmtUsd(payout) },
          { label: 'Profit Margin', value: marginPct.toFixed(1) + '%' },
          { label: 'Sourcing ROI', value: roiPct.toFixed(0) + '%' }
        ],
        rows: [
          ['Poshmark Sold Price', fmtUsd(v.salePrice), '100.0%'],
          ['Poshmark Commission (' + (v.salePrice < 15 ? 'Flat $2.95' : '20.0%') + ')', '-' + fmtUsd(poshFee), pct(poshFee, v.salePrice)],
          ['Seller-Paid Shipping Discount', '-' + fmtUsd(v.shippingDiscount), pct(v.shippingDiscount, v.salePrice)],
          ['Poshmark Net Payout to Balance', fmtUsd(payout), pct(payout, v.salePrice)],
          ['Sourcing COGS + Packing Supplies', '-' + fmtUsd(v.itemCogs + v.suppliesCost), pct(v.itemCogs + v.suppliesCost, v.salePrice)],
          ['True Take-Home Reseller Profit', fmtUsd(netProfit), marginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: effectiveTakePct >= 25
          ? 'Heads up: Poshmark’s 20% fee + shipping discount took ' + effectiveTakePct.toFixed(1) + '%! Cross-listing higher-ticket items on eBay (13.6%) or your own Shopify boutique (2.9%) saves $4–$15 per sale.'
          : 'Clean flip (' + roiPct.toFixed(0) + '% ROI on your ' + fmtUsd(v.itemCogs) + ' sourcing cost)! Log every thrift receipt in your Schedule-C tracker so you never pay tax on COGS.'
      };
    `,
    faqs: [
      {
        q: 'What are Poshmark US seller fees in 2026?',
        a: 'Poshmark charges a flat $2.95 commission on all sales under $15 USD, and a flat 20% commission on all sales of $15 or more. Standard payment processing is included in that 20% fee.'
      },
      {
        q: 'How do Offer to Likers (OTL) shipping discounts affect my Poshmark payout?',
        a: 'Whenever you send a private Offer to Likers with discounted shipping, Poshmark deducts the shipping subsidy ($2.02–$7.97) directly from your seller earnings on top of the 20% commission.'
      }
    ]
  },

  {
    slug: 'mercari-fee-calculator',
    category: 'marketplaces',
    shortName: 'Mercari Fees',
    badge: '2026 Mercari US',
    title: '2026 Mercari US Seller Fee & Net Profit Calculator (10% Flat Fee)',
    metaDescription:
      'Calculate exact 2026 Mercari US seller fees (10% flat selling fee on item + buyer shipping), prepaid shipping labels, sourcing COGS, and net reseller profit.',
    h1: '2026 Mercari US Seller Fee & Net Profit Calculator',
    intro:
      'Compare your true take-home profit on Mercari’s simplified 10% flat seller fee structure against Poshmark (20%) and eBay (13.6%) before listing.',
    primaryAffiliate: 'linkMyBooks',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'salePrice', label: 'Mercari Listing Sale Price ($)', type: 'number', value: 38.0, step: 1, min: 1 },
      { id: 'buyerShipping', label: 'Buyer-Paid Shipping ($ — 0 if Free Ship)', type: 'number', value: 5.99, step: 0.5, min: 0 },
      { id: 'sellerShippingCost', label: 'Seller-Paid Shipping Cost ($ — if Free Ship)', type: 'number', value: 0, step: 0.5, min: 0 },
      { id: 'itemCogs', label: 'Item Sourcing Cost / COGS ($)', type: 'number', value: 10.0, step: 0.5, min: 0 },
      { id: 'packagingCost', label: 'Mailer / Bubble Wrap / Label ($)', type: 'number', value: 0.65, step: 0.1, min: 0 }
    ],
    computeFnBody: `
      const feeBasis = v.salePrice + v.buyerShipping;
      const mercariFee = feeBasis * 0.10;
      const payout = v.salePrice - mercariFee - v.sellerShippingCost;
      const netProfit = payout - v.itemCogs - v.packagingCost;
      const marginPct = v.salePrice > 0 ? (netProfit / v.salePrice) * 100 : 0;
      const poshmarkSavings = (v.salePrice < 15 ? 2.95 : v.salePrice * 0.20) - mercariFee;

      return {
        primaryLabel: 'Net Mercari Seller Profit',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 8 ? 'positive' : netProfit >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Mercari 10% Fee', value: fmtUsd(mercariFee) },
          { label: 'Net Margin', value: marginPct.toFixed(1) + '%' },
          { label: 'Savings vs Poshmark', value: (poshmarkSavings >= 0 ? '+' : '-') + fmtUsd(Math.abs(poshmarkSavings)) }
        ],
        rows: [
          ['Mercari Item Sale Price', fmtUsd(v.salePrice), '100.0%'],
          ['Mercari 10% Seller Fee (on Item + Buyer Ship)', '-' + fmtUsd(mercariFee), pct(mercariFee, v.salePrice)],
          ['Seller-Paid Shipping (if offering Free Ship)', '-' + fmtUsd(v.sellerShippingCost), pct(v.sellerShippingCost, v.salePrice)],
          ['Mercari Net Payout', fmtUsd(payout), pct(payout, v.salePrice)],
          ['Sourcing COGS + Packaging Supplies', '-' + fmtUsd(v.itemCogs + v.packagingCost), pct(v.itemCogs + v.packagingCost, v.salePrice)],
          ['True Take-Home Reseller Profit', fmtUsd(netProfit), marginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: poshmarkSavings > 0
          ? 'Selling this item on Mercari instead of Poshmark saves you ' + fmtUsd(poshmarkSavings) + ' in marketplace commission on this single flip!'
          : 'Always verify whether offering Free Shipping pushes Mercari’s fee base lower than buyer-paid shipping labels.'
      };
    `,
    faqs: [
      {
        q: 'What is Mercari’s US seller fee in 2026?',
        a: 'Mercari US charges a simplified 10% flat selling fee calculated on the item price plus buyer-paid shipping (with $0 direct-deposit ACH payout fees for standard bank transfers).'
      },
      {
        q: 'Is Mercari cheaper than Poshmark and eBay for resellers?',
        a: 'Yes! On a $40 item, Mercari’s 10% fee (~$4.00–$4.60) saves roughly $3.40+ compared to Poshmark’s 20% ($8.00) and ~$1.80+ compared to eBay’s 13.6% + $0.40.'
      }
    ]
  },

  {
    slug: 'whatnot-fee-calculator',
    category: 'marketplaces',
    shortName: 'Whatnot Fees',
    badge: '2026 Live Selling',
    title: '2026 Whatnot Seller Fee & Live Auction Profit Calculator',
    metaDescription:
      'Calculate exact 2026 Whatnot US live-selling fees (8% commission + 2.9% + $0.30 processing on item, shipping & sales tax), giveaway costs, and net auction profit.',
    h1: '2026 Whatnot Seller Fee & Live Auction Profit Calculator',
    intro:
      'Live auctions move fast—know your exact Whatnot break-even start bid before running $1 starts! Includes 8% commission, 2.9% + $0.30 processing on total order + tax, and amortized giveaway costs.',
    primaryAffiliate: 'linkMyBooks',
    secondaryAffiliate: 'shopify',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'winningBid', label: 'Winning Auction / Buy-It-Now Price ($)', type: 'number', value: 25.0, step: 1, min: 1 },
      {
        id: 'commissionRate',
        label: 'Whatnot Category Commission Rate',
        type: 'select',
        value: '0.08',
        options: [
          { value: '0.08', label: '8.0% Standard (Apparel, Cards, Sneakers, Vintage, Toys)' },
          { value: '0.04', label: '4.0% Coins & Money Category' },
          { value: '0.05', label: '5.0% Electronics Category' }
        ]
      },
      { id: 'buyerShipping', label: 'Buyer-Paid Shipping ($ — affects 2.9% fee)', type: 'number', value: 4.5, step: 0.25, min: 0 },
      { id: 'salesTaxPct', label: 'Est. Buyer Sales Tax (% — affects 2.9% fee)', type: 'number', value: 7.0, step: 0.5, min: 0 },
      { id: 'itemCogs', label: 'Item Cost / COGS ($)', type: 'number', value: 9.0, step: 0.5, min: 0 },
      { id: 'giveawayAmortized', label: 'Amortized Giveaway & Packing Cost / Order ($)', type: 'number', value: 0.85, step: 0.1, min: 0 }
    ],
    computeFnBody: `
      const commissionFee = v.winningBid * v.commissionRate;
      const buyerTax = (v.winningBid + v.buyerShipping) * (v.salesTaxPct / 100);
      const processingBasis = v.winningBid + v.buyerShipping + buyerTax;
      const processingFee = processingBasis * 0.029 + 0.30;
      const totalWhatnotFees = commissionFee + processingFee;
      const netProfit = v.winningBid - totalWhatnotFees - v.itemCogs - v.giveawayAmortized;
      const marginPct = v.winningBid > 0 ? (netProfit / v.winningBid) * 100 : 0;
      const minStartBid = (v.itemCogs + v.giveawayAmortized + 0.30 + v.buyerShipping * 0.029 * (1 + v.salesTaxPct / 100)) / Math.max(0.1, 1 - v.commissionRate - 0.029 * (1 + v.salesTaxPct / 100));

      return {
        primaryLabel: 'Net Profit Per Whatnot Auction Sale',
        primaryValue: fmtUsd(netProfit),
        primaryTone: netProfit >= 5 ? 'positive' : netProfit >= 0 ? 'neutral' : 'negative',
        kpis: [
          { label: 'Total Whatnot Fees', value: fmtUsd(totalWhatnotFees) + ' (' + pct(totalWhatnotFees, v.winningBid) + ')' },
          { label: 'Net Margin', value: marginPct.toFixed(1) + '%' },
          { label: 'Break-Even Start Bid', value: fmtUsd(minStartBid) }
        ],
        rows: [
          ['Winning Auction Hammer Price', fmtUsd(v.winningBid), '100.0%'],
          ['Whatnot Commission (' + (v.commissionRate * 100).toFixed(0) + '%)', '-' + fmtUsd(commissionFee), pct(commissionFee, v.winningBid)],
          ['Payment Processing (2.9% + $0.30 incl. Ship & Tax)', '-' + fmtUsd(processingFee), pct(processingFee, v.winningBid)],
          ['Item COGS + Giveaway/Packing Allocation', '-' + fmtUsd(v.itemCogs + v.giveawayAmortized), pct(v.itemCogs + v.giveawayAmortized, v.winningBid)],
          ['True Net Take-Home Profit', fmtUsd(netProfit), marginPct.toFixed(1) + '%']
        ],
        dynamicAdvice: netProfit < 3
          ? 'Low-margin alert! Never start this item below ' + fmtUsd(minStartBid) + ' unless you have 40+ active bidders in your live room.'
          : 'Profitable live-show lot (' + marginPct.toFixed(1) + '% net)! Your exact break-even start bid is ' + fmtUsd(minStartBid) + '.'
      };
    `,
    faqs: [
      {
        q: 'How are Whatnot US seller fees calculated in 2026?',
        a: 'Whatnot charges an 8% commission on the item sale price (4% for Coins & Money, 5% for Electronics) PLUS a 2.9% + $0.30 payment processing fee calculated on the buyer’s entire checkout total (item + shipping + sales tax).'
      },
      {
        q: 'Should Whatnot sellers include giveaway shipping inside per-order math?',
        a: 'Yes! Because sellers pay the shipping label on every viewer giveaway (~$4.50 each), dividing total show giveaway costs by expected paid orders prevents surprise margin wipeouts.'
      }
    ]
  },

  {
    slug: 'bundle-discount-profit-calculator',
    category: 'shopify-dtc',
    shortName: 'Bundle & BOGO Calc',
    badge: 'AOV & Margin Optimizer',
    title: '2026 Bundle, Buy-2-Save-15% & BOGO Profit Margin Calculator',
    metaDescription:
      'Test whether a Buy 2 Save 15%, Buy 3 Save 20%, or BOGO 50% off bundle actually increases your net dollar profit per order by amortizing fixed shipping and ad CPA.',
    h1: 'Bundle Discount & BOGO Net Profit Optimizer',
    intro:
      'Discounting scares sellers—until you see how spreading one shipping label and one ad click across 2–3 units dramatically increases net profit dollars per customer.',
    primaryAffiliate: 'shopify',
    secondaryAffiliate: 'printify',
    recommendedProduct: 'flagshipOs',
    inputs: [
      { id: 'singlePrice', label: 'Single Unit Retail Price ($)', type: 'number', value: 32.0, step: 1, min: 1 },
      { id: 'unitCogs', label: 'Single Unit Landed COGS ($)', type: 'number', value: 8.5, step: 0.25, min: 0 },
      { id: 'unitsInBundle', label: 'Units in Bundle (e.g. 2 or 3)', type: 'number', value: 2, step: 1, min: 2 },
      { id: 'bundleDiscountPct', label: 'Bundle Discount Offered (% — e.g. 15% or 25% for BOGO 50%)', type: 'number', value: 15, step: 1, min: 0 },
      { id: 'singleShipCost', label: '1-Unit Postage + Box Cost ($)', type: 'number', value: 5.25, step: 0.25, min: 0 },
      { id: 'bundleShipCost', label: 'Bundle Postage + Box Cost ($)', type: 'number', value: 6.25, step: 0.25, min: 0 },
      { id: 'orderAdCpa', label: 'Paid Ad Cost Per Checkout / CPA ($)', type: 'number', value: 10.0, step: 0.5, min: 0 }
    ],
    computeFnBody: `
      const feeRate = 0.029;
      const singleFee = v.singlePrice * feeRate + 0.30;
      const singleProfit = v.singlePrice - v.unitCogs - v.singleShipCost - singleFee - v.orderAdCpa;

      const bundleFullPrice = v.singlePrice * v.unitsInBundle;
      const bundleSalePrice = bundleFullPrice * (1 - Math.min(80, Math.max(0, v.bundleDiscountPct)) / 100);
      const bundleFee = bundleSalePrice * feeRate + 0.30;
      const bundleCogs = v.unitCogs * v.unitsInBundle;
      const bundleProfit = bundleSalePrice - bundleCogs - v.bundleShipCost - bundleFee - v.orderAdCpa;

      const profitLift = bundleProfit - singleProfit;
      const bundleMarginPct = bundleSalePrice > 0 ? (bundleProfit / bundleSalePrice) * 100 : 0;

      return {
        primaryLabel: profitLift >= 0 ? 'Extra Net Profit Dollars Per Bundled Order' : 'Profit Lost vs. Single-Unit Order',
        primaryValue: (profitLift >= 0 ? '+' : '-') + fmtUsd(Math.abs(profitLift)) + '/order',
        primaryTone: profitLift >= 0 ? 'positive' : 'negative',
        kpis: [
          { label: '1-Unit Net Profit', value: fmtUsd(singleProfit) },
          { label: v.unitsInBundle + '-Pack Bundle Profit', value: fmtUsd(bundleProfit) },
          { label: 'Bundle Net Margin', value: bundleMarginPct.toFixed(1) + '%' }
        ],
        rows: [
          ['Single-Unit Order Net Profit (after CPA & Ship)', fmtUsd(singleProfit), pct(singleProfit, v.singlePrice)],
          ['Bundle Customer Price (' + v.unitsInBundle + ' units @ -' + v.bundleDiscountPct + '%)', fmtUsd(bundleSalePrice), '100.0%'],
          ['Bundle Total COGS (' + v.unitsInBundle + ' × ' + fmtUsd(v.unitCogs) + ')', '-' + fmtUsd(bundleCogs), pct(bundleCogs, bundleSalePrice)],
          ['Bundle Shipping + Card Fee + Same Ad CPA', '-' + fmtUsd(v.bundleShipCost + bundleFee + v.orderAdCpa), pct(v.bundleShipCost + bundleFee + v.orderAdCpa, bundleSalePrice)],
          ['Bundle Net Profit Per Order', fmtUsd(bundleProfit), bundleMarginPct.toFixed(1) + '%'],
          ['Net Profit Dollar Gain vs. Selling 1 Unit', (profitLift >= 0 ? '+' : '-') + fmtUsd(Math.abs(profitLift)), 'Per Customer']
        ],
        dynamicAdvice: profitLift > 0
          ? 'Smart bundle! Even with ' + v.bundleDiscountPct + '% off, amortizing shipping & ad CPA across ' + v.unitsInBundle + ' units adds ' + fmtUsd(profitLift) + ' pure profit to every order!'
          : 'Over-discounted! Lowering the bundle discount by 5%–10% keeps customer value high without shrinking your per-order dollar profit.'
      };
    `,
    faqs: [
      {
        q: 'Why can a 15% bundle discount make MORE profit than selling at full price?',
        a: 'Because you only pay your customer acquisition cost (CPA) and base shipping label ONCE per checkout. Selling 2 units at 15% off often doubles or triples net dollar profit per customer.'
      },
      {
        q: 'What discount percentage equals a BOGO 50% Off offer?',
        a: 'Buy One Get One 50% Off on 2 identical items equals a 25% blended discount across both units—enter 2 units and 25% discount above to verify your exact BOGO profit.'
      }
    ]
  }
];
