/**
 * 6 High-Intent 2026 E-Commerce SEO Calculators
 * Verified against 2026 US Marketplace Fee Schedules (Etsy, Shopify, TikTok Shop US, POD, ROAS, Markup).
 */

export const CALCULATORS = [
  {
    slug: 'etsy-fee-calculator',
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
  }
];
