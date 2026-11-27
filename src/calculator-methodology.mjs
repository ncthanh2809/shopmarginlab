/**
 * Verified 2026 Fee Formulas, Worked Numerical Examples, Scope Distinctions,
 * Additional Practical FAQs, and Official Primary Source Citations for all 20 Calculators.
 */

export const VERIFIED_DATE = '2026-11-27';

export const CALCULATOR_DETAILS = {
  'etsy-fee-calculator': {
    whenToUse:
      'Use this calculator for single physical Etsy US orders (handmade, vintage, craft supplies, or POD). If you sell $0-shipping printables/Canva files, use our Etsy Digital Product Calculator; if you want a catalog-wide price buffer for mandatory 12% Offsite Ads, use our Etsy Offsite Ads Survival Calculator.',
    formulaSummary:
      'Gross Buyer Total = Item Price + Buyer Shipping. Etsy Fees = $0.20 Listing + (6.5% × Gross) + (3.0% × Gross + $0.25 US Payments) + min($100, Offsite Ads % × Gross). Net Profit = Gross − Etsy Fees − Product COGS − Actual Postage − On-Site Etsy Ads.',
    workedExample: {
      title: 'Worked 2026 Example: $34 Handmade Candle + $5 Shipping ($39 Gross)',
      bullets: [
        'Organic order fees: $0.20 listing + $2.54 transaction (6.5% on item+shipping) + $1.42 payment processing = $4.16 (10.7% take rate). After $9.50 COGS and $4.60 USPS label, net take-home profit is $20.75 (53.2% margin).',
        'If attributed to 12% Mandatory Offsite Ads: add $4.68 fee, dropping net profit to $16.07 (41.2% margin). Note that Etsy Payments also applies 3% to state sales tax collected by Etsy at checkout, adding ~$0.08 on a 7% tax state.'
      ]
    },
    extraFaqs: [
      {
        q: 'Does Etsy refund my seller fees if a buyer cancels or gets a full refund?',
        a: 'Etsy credits back the 6.5% transaction fee, payment processing fee, and Offsite Ads fee on a full refund, but the original $0.20 listing fee is non-refundable.'
      },
      {
        q: 'Does Etsy Payments charge 3% on state sales tax collected from US buyers?',
        a: 'Yes. Etsy Payments calculates its 3.0% + $0.25 US processing fee on the full buyer checkout total—including state sales tax that Etsy collects and remits as a marketplace facilitator.'
      }
    ],
    sources: [
      { label: 'Etsy Help Center — Fees & Payments Policy (US)', url: 'https://help.etsy.com/hc/en-us/articles/360035902374-Beginner-s-Guide-to-Etsy-Fees' },
      { label: 'Etsy Help Center — Offsite Ads Fee Rules', url: 'https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work' }
    ]
  },

  'shopify-vs-etsy-calculator': {
    whenToUse:
      'Use this tool when deciding whether your current Etsy monthly order volume justifies launching a companion Shopify Basic ($39/mo) storefront—or projecting 12-month savings from shifting repeat Etsy buyers to direct checkout.',
    formulaSummary:
      'Monthly Etsy Cost = (Orders × $0.45) + (Monthly Revenue × 9.5%) + (Offsite Orders × min($100, AOV × 15%)). Monthly Shopify Cost = Plan Subscription ($39 monthly / $29 annual) + (Orders × $0.30) + (Monthly Revenue × 2.9%). Break-Even Orders = ceil(Plan Cost ÷ (AOV × 6.6% + $0.15)).',
    workedExample: {
      title: 'Worked 2026 Example: 65 Orders/Month @ $42 AOV ($2,730 Gross)',
      bullets: [
        'With 15% of Etsy orders triggering 15% Offsite Ads, Etsy takes $350.03/month ($4,200/yr). Shopify Basic ($39/mo + 2.9% + $0.30) costs $137.67/month ($1,652/yr)—a $2,548/year fee advantage.',
        'Important caveat: Etsy provides built-in marketplace search traffic while Shopify requires your own marketing (email list, Pinterest, TikTok, QR package inserts). That is why most growing sellers keep Etsy open for new buyers and use Shopify for repeat orders.'
      ]
    },
    extraFaqs: [
      {
        q: 'Does this comparison include Shopify apps or custom domain costs?',
        a: 'This model isolates platform subscription and transaction fees; you can raise the "Shopify Monthly Subscription" input from $39 to $65 if you want to budget $25/mo for a custom domain and optional email/review apps.'
      },
      {
        q: 'Is it against Etsy policy to include a Shopify card in my shipped packages?',
        a: 'You may never divert an open Etsy transaction off-platform inside Etsy Messages (fee avoidance), but including standard branded packaging with your website URL or social handles for future orders is standard e-commerce practice.'
      }
    ],
    sources: [
      { label: 'Shopify Official US Plans & Card Rates', url: 'https://www.shopify.com/pricing' },
      { label: 'Etsy US Seller Fee Schedule', url: 'https://help.etsy.com/hc/en-us/articles/360035902374-Beginner-s-Guide-to-Etsy-Fees' }
    ]
  },

  'tiktok-shop-fee-calculator': {
    whenToUse:
      'Use this calculator before opening an Open or Targeted Affiliate Collaboration on TikTok Shop US so you know the exact maximum creator commission % you can offer without losing money per unit.',
    formulaSummary:
      'Buyer Total = Sale Price + Buyer Shipping. TikTok Referral Fee = Buyer Total × Referral Tier (6.0% standard, 3.0% first-30-days promo). Creator Commission = Sale Price × Creator %. Max Break-Even Creator % = (Buyer Total − Referral Fee − COGS − Fulfillment) ÷ Sale Price.',
    workedExample: {
      title: 'Worked 2026 Example: $29.99 Product With 15% Creator Commission',
      bullets: [
        'At 6% referral ($1.80) + 15% creator commission ($4.50) + $7.25 COGS + $4.25 FBT/USPS postage, net profit is $12.19 (40.6% margin) and your hard break-even creator ceiling is 55.6%.',
        'Refund caveat: if a buyer returns a delivered item, TikTok retains a 20% Refund Administration Fee on the referral fee (capped at $5/SKU), and outbound postage is non-recoverable.'
      ]
    },
    extraFaqs: [
      {
        q: 'Is TikTok creator affiliate commission calculated on shipping too?',
        a: 'Creator commission is calculated on the actual product sale price (after seller discounts/coupons), not on buyer-paid shipping or sales tax.'
      },
      {
        q: 'Should I factor free creator samples into my TikTok Shop margins?',
        a: 'Yes. If you ship 20 free samples ($12 cost each = $240) to drive 200 affiliate sales, add ~$1.20 to your unit COGS input above to see true campaign profitability.'
      }
    ],
    sources: [
      { label: 'TikTok Shop US Seller Academy — Referral & Refund Admin Fees', url: 'https://seller-us.tiktok.com/university/essay?knowledge_id=6837887923128065' }
    ]
  },

  'print-on-demand-profit-calculator': {
    whenToUse:
      'Use this tool to price an individual Print-on-Demand product (tee, hoodie, mug, poster) on Etsy, Shopify, or TikTok Shop—including the impact of shop coupons and Printify Premium’s ~20% blank discount. For comparing Printify vs. Printful monthly totals side-by-side, use our Printify vs. Printful Calculator.',
    formulaSummary:
      'Discounted Gross = Retail Price × (1 − Coupon %) + Buyer Shipping. Channel Fee = 9.5% + $0.45 (Etsy), 2.9% + $0.30 (Shopify), or 6.0% (TikTok). Standard Net = Gross − Channel Fee − Blank Cost − Supplier Ship. Premium Break-Even = ceil($29 ÷ (Blank Cost × 20%)).',
    workedExample: {
      title: 'Worked 2026 Example: $28.99 Graphic Tee at 10% Off + $4.99 Shipping on Etsy',
      bullets: [
        'Customer pays $31.08 total. Etsy deducts $3.40 (10.9%), standard POD blank ($11.40) + supplier shipping ($4.75) leaves $11.53 net profit (37.1% margin).',
        'Switching to Printify Premium trims blank cost ~20% ($2.28 saved per shirt), lifting profit to $13.81/order and paying off the $29/mo subscription at just 13 shirts/month.'
      ]
    },
    extraFaqs: [
      {
        q: 'Should I offer free shipping on POD listings or charge $4.99 separately?',
        a: 'On Etsy, charging $24.99 + $4.99 shipping protects your margin during 20% shop sales because coupons discount only the $24.99 item price rather than the $4.99 postage.'
      },
      {
        q: 'Does POD supplier cost include sales tax if I do not have a resale certificate?',
        a: 'Yes—until you submit a state resale certificate to Printify or Printful, suppliers may charge US sales tax on the blank garment based on the buyer’s shipping state, adding ~$0.80–$1.20 per order.'
      }
    ],
    sources: [
      { label: 'Printify Official Pricing & Premium Plan', url: 'https://printify.com/pricing/' },
      { label: 'Etsy Help Center — Fees Policy', url: 'https://help.etsy.com/hc/en-us/articles/360035902374-Beginner-s-Guide-to-Etsy-Fees' }
    ]
  },

  'roas-break-even-calculator': {
    whenToUse:
      'Use this calculator before launching or scaling Meta Ads, Google Shopping, or TikTok Ads campaigns so you never scale an ad set whose reported ROAS looks impressive on paper (e.g., 2.2x) while losing money after COGS and shipping.',
    formulaSummary:
      'Gateway Fee = AOV × Processing % + $0.30. Contribution Margin (Max CPA) = AOV − Landed COGS − Fulfillment − Gateway Fee. Break-Even ROAS = AOV ÷ Contribution Margin. Monthly Net Profit = (Monthly Spend × Actual ROAS ÷ AOV) × Contribution Margin − Monthly Spend.',
    workedExample: {
      title: 'Worked 2026 Example: $64 AOV DTC Brand Spending $3,000/mo at 2.8x ROAS',
      bullets: [
        'After $16.50 landed COGS, $5.50 shipping/pack, and $2.16 card fee, pre-ad contribution margin is $39.84 (62.3%), making exact Break-Even ROAS 1.61x and Max Allowable CPA $39.84.',
        'At 2.8x ROAS ($8,400 revenue / ~131 orders), monthly contribution is $5,229 minus $3,000 ad spend = $2,229 true net profit before fixed software overhead.'
      ]
    },
    extraFaqs: [
      {
        q: 'What is the difference between platform ROAS and Blended MER?',
        a: 'Platform ROAS (Meta/TikTok Ads Manager) only tracks ad-attributed clicks and often over-counts view-through conversions. Blended MER (Total Store Revenue ÷ Total Ad Spend) reflects actual cash hitting your bank account.'
      },
      {
        q: 'Can I profitably run ads below Break-Even ROAS on the first order?',
        a: 'Only if you have verified high repeat-purchase LTV (such as consumables or subscriptions) AND enough working capital to wait 60–90 days for payback.'
      }
    ],
    sources: [
      { label: 'Shopify Guide — Understanding ROAS & Contribution Margin', url: 'https://www.shopify.com/blog/roas' }
    ]
  },

  'wholesale-retail-markup-calculator': {
    whenToUse:
      'Use this tool when sourcing physical inventory from factories/suppliers (Alibaba, domestic manufacturers, private label) to calculate true Landed Unit COGS and ensure your MSRP leaves room for both DTC ads and 50% B2B wholesale accounts.',
    formulaSummary:
      'Import Tariff = Factory Unit Cost × Duty %. Landed COGS = Factory Cost + Inbound Freight + Tariff + Packaging. B2B Wholesale Price = Landed COGS ÷ (1 − Target Wholesale Margin %). DTC MSRP = Wholesale Price × Keystone Multiplier (2.0x–2.2x).',
    workedExample: {
      title: 'Worked 2026 Example: $4.80 Factory Unit With 10% Tariff + Freight & Packaging',
      bullets: [
        'Adding $0.48 duty + $1.15 inbound freight + $0.85 custom packaging brings true Landed COGS to $7.28—52% higher than the raw factory quote!',
        'Targeting a 52% wholesale margin sets B2B price at $15.17, and a 2.2x retail multiplier yields a $33.37 DTC MSRP (78.2% DTC gross margin), leaving healthy room for shipping and paid acquisition.'
      ]
    },
    extraFaqs: [
      {
        q: 'What is Keystone Pricing in retail?',
        a: 'Keystone pricing means multiplying your wholesale price by 2.0x to set MSRP—giving boutique retailers a standard 50% gross margin while preserving your wholesale margin.'
      },
      {
        q: 'Should inbound customs brokerage and port drayage be inside Landed COGS?',
        a: 'Yes. Divide your total invoice for freight, customs broker fees, tariffs, and warehouse receiving by total sellable units received to avoid understating Landed COGS.'
      }
    ],
    sources: [
      { label: 'US International Trade Commission — Harmonized Tariff Schedule (HTS)', url: 'https://hts.usitc.gov/' },
      { label: 'SBA — Pricing Your Products & Wholesale Margins', url: 'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs' }
    ]
  },

  'amazon-fba-fee-calculator': {
    whenToUse:
      'Use this tool before ordering private-label or wholesale inventory for Amazon US FBA so you verify net profit, cash-on-cash ROI, and exact Break-Even PPC ACoS across referral categories.',
    formulaSummary:
      'Referral Fee = max($0.30, Sale Price × Category %). Total Amazon Fees = Referral Fee + FBA Pick & Pack + Monthly Storage/Inbound. Pre-Ad Margin = Sale Price − Amazon Fees − Landed COGS. Break-Even ACoS = (Pre-Ad Margin ÷ Sale Price) × 100. ROI = (Net Profit ÷ Landed COGS) × 100.',
    workedExample: {
      title: 'Worked 2026 Example: $34.99 Home/Kitchen FBA SKU at 12% Blended TACoS',
      bullets: [
        'Costs stack to $5.25 referral (15%) + $4.75 FBA fulfillment + $0.85 storage/inbound + $8.20 landed COGS + $4.20 PPC = $23.25 total cost.',
        'Net profit is $11.74/unit (33.6% net margin, 143% ROI) with a hard Break-Even PPC ACoS ceiling of 45.6%. Exceeding 45.6% ACoS on any keyword means paying Amazon to lose cash.'
      ]
    },
    extraFaqs: [
      {
        q: 'How does dimensional weight change my FBA fulfillment fee?',
        a: 'Amazon bills standard-size FBA fees using the greater of actual weight or dimensional weight (L × W × H ÷ 139). Shaving 0.5 inches off packaging thickness frequently saves $1.00–$2.00 per unit.'
      },
      {
        q: 'What is the difference between ACoS and TACoS on Amazon?',
        a: 'ACoS divides ad spend by ad-attributed sales only (for keyword bidding), while TACoS divides ad spend by TOTAL store sales (organic + ads) to show true impact on net profit margin.'
      }
    ],
    sources: [
      { label: 'Amazon Seller Central — US Referral & FBA Pricing', url: 'https://sell.amazon.com/pricing' },
      { label: 'Amazon Seller Central — Fulfillment by Amazon Overview', url: 'https://sell.amazon.com/fulfillment-by-amazon' }
    ]
  },

  'ebay-fee-calculator': {
    whenToUse:
      'Use this calculator before listing on eBay US to see true take-home profit after eBay’s tax-inclusive Final Value Fee (item + shipping + state sales tax), per-order fee ($0.30/$0.40), Store discount, and Promoted Listings Standard percentage.',
    formulaSummary:
      'Fee Basis = Item Price + Buyer Shipping + Estimated Sales Tax. Final Value Fee = (Fee Basis × Category Rate) + ($0.40 if subtotal > $10 else $0.30). Promoted Fee = Fee Basis × Promoted %. Net Profit = (Item + Buyer Shipping) − Final Value Fee − Promoted Fee − COGS − Actual Label.',
    workedExample: {
      title: 'Worked 2026 Example: $48 Item + $6.95 Shipping + 5% Promoted Listings (No Store)',
      bullets: [
        'With 7% buyer sales tax ($3.85), eBay’s fee basis jumps to $58.80. At 13.6% + $0.40 plus 5% Promoted Listings, total eBay fees reach $11.34—equal to 20.6% of your $54.95 subtotal!',
        'After $14.00 COGS and $6.20 actual USPS Ground Advantage postage, take-home profit is $23.41 (42.6% margin).'
      ]
    },
    extraFaqs: [
      {
        q: 'When does eBay charge $0.30 vs. $0.40 per order?',
        a: 'eBay US charges a $0.30 fixed per-order fee on orders totaling $10.00 or less, and $0.40 per order on orders exceeding $10.00.'
      },
      {
        q: 'Does eBay charge a separate fee for international buyers?',
        a: 'Yes. If a US seller ships directly to an international buyer outside eBay International Shipping (eIS), eBay assesses an additional 1.65% international fee on the total sale amount.'
      }
    ],
    sources: [
      { label: 'eBay US Help Center — Selling Fees & Categories', url: 'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822' },
      { label: 'eBay US — Store Subscription Tiers', url: 'https://www.ebay.com/help/selling/ebay-stores/store-subscriptions?id=4086' }
    ]
  },

  'shopify-fee-calculator': {
    whenToUse:
      'Use this tool strictly to choose the cheapest Shopify subscription tier (Basic vs. Grow vs. Advanced, monthly vs. annual) and measure third-party gateway penalties at your monthly revenue. To calculate single-order net profit after COGS, postage, ads, and returns, use our Shopify Net Profit Margin Calculator.',
    formulaSummary:
      'Plan Total = Monthly Subscription + (Monthly Revenue × Tier Card Rate) + (Monthly Orders × $0.30) + Optional 3rd-Party Surcharge (2.0% Basic / 1.0% Grow / 0.6% Advanced). Compares Basic (2.9%), Grow (2.7%), and Advanced (2.5%) side-by-side.',
    workedExample: {
      title: 'Worked 2026 Example: $18,000/Month Store (300 Orders) on Monthly Billing',
      bullets: [
        'Using Shopify Payments: Basic costs $651/mo (3.6%), Grow costs $681/mo (3.8%), and Advanced costs $939/mo (5.2%)—proving Basic remains cheapest until ~$33,000/month on monthly billing (~$25,000/mo annual).',
        'Switching to a third-party gateway on Basic adds an avoidable $360/month ($4,320/year) in Shopify transaction surcharges.'
      ]
    },
    extraFaqs: [
      {
        q: 'Does annual Shopify billing change the upgrade break-even point?',
        a: 'Yes. Annual billing (~25% off: $29 Basic vs. $79 Grow) shrinks the subscription jump from $66/mo to $50/mo, lowering the Grow upgrade break-even from ~$33,000/mo down to ~$25,000/mo.'
      },
      {
        q: 'Do PayPal Express checkouts on Shopify trigger the third-party surcharge?',
        a: 'No—when Shopify Payments is active as your primary gateway, Shopify waives its 0.6%–2.0% third-party transaction surcharge on PayPal Express orders (you only pay PayPal’s own processing fee).'
      }
    ],
    sources: [
      { label: 'Shopify Official Pricing & Plan Comparison', url: 'https://www.shopify.com/pricing' },
      { label: 'Shopify Help Center — Shopify Payments Rates & Third-Party Fees', url: 'https://help.shopify.com/en/manual/payments/shopify-payments' }
    ]
  },

  'etsy-offsite-ads-calculator': {
    whenToUse:
      'Use this specialist calculator if your Etsy shop is approaching or past $10,000/year in sales (triggering mandatory 12% Offsite Ads) and you need the exact blended price adjustment so ad-attributed sales stay profitable without overpricing organic listings.',
    formulaSummary:
      'Organic Profit = Total − COGS/Postage − ($0.45 + 9.5% × Total). Worst-Case Profit = Organic Profit − min($100, Offsite % × Total). Blended Buffer Price solves for the minimal catalog-wide price lift that keeps average profit unchanged across your Offsite Ads order share %.',
    workedExample: {
      title: 'Worked 2026 Example: $40 Order With $16.50 Direct Cost & 18% Offsite Share (12% Tier)',
      bullets: [
        'Organic sales net $19.25, while Offsite-attributed sales drop to $14.45 (an extra $4.80 fee). Across an 18% Offsite share, blended average profit is $18.39.',
        'Instead of panicking and hiking prices by 12% ($4.80), raising listing prices by just $0.98 (to $40.98) fully absorbs the 18% blended Offsite Ads load.'
      ]
    },
    extraFaqs: [
      {
        q: 'Is there a maximum cap on Etsy Offsite Ads fees for high-ticket furniture or jewelry?',
        a: 'Yes. Etsy caps the Offsite Ads fee at $100 USD per individual order—so a $1,200 handmade table pays $100 (8.3%) instead of 12% ($144).'
      },
      {
        q: 'Can I ever opt out of Offsite Ads if my sales dip below $10,000 next year?',
        a: 'No. Under Etsy policy, once a shop crosses $10,000 USD in any rolling 365-day window, 12% Offsite Ads enrollment is permanent for the lifetime of that shop.'
      }
    ],
    sources: [
      { label: 'Etsy Help Center — Offsite Ads Mandatory $10k Threshold & $100 Cap', url: 'https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work' }
    ]
  },

  'printful-vs-printify-calculator': {
    whenToUse:
      'Use this side-by-side supplier comparison tool to quantify monthly and annual profit differences across Printify Standard ($0/mo), Printify Premium ($29/mo), and Printful at your actual monthly order volume.',
    formulaSummary:
      'Net Revenue/Unit = Customer Paid − Channel Fee. Printify Standard Monthly = (Net Rev − Std Cost) × Units. Printify Premium Monthly = (Net Rev − Prem Cost) × Units − $29. Printful Monthly = (Net Rev − Printful Cost) × Units.',
    workedExample: {
      title: 'Worked 2026 Example: 80 Graphic Tees/Month on Etsy US ($33.99 Delivered)',
      bullets: [
        'After $3.68 Etsy organic fees ($30.31 net rev/unit), Printify Premium ($12.95 blank+ship minus $29/mo sub) clears $1,359.80/month vs. $1,204.80 on Printify Standard and $932.80 on Printful.',
        'That $427/month gap equals $5,124/year in extra net profit—without changing your designs, SEO tags, or ad spend.'
      ]
    },
    extraFaqs: [
      {
        q: 'Why would any seller still choose Printful over Printify in 2026?',
        a: 'Printful can make sense for complex embroidery, inside neck-label branding, custom pack-ins, and all-over-print (AOP) garments where single-factory consistency outweighs $3–$5/unit margin savings.'
      },
      {
        q: 'How do I keep print quality consistent when using Printify providers?',
        a: 'Order physical samples first, pick providers rated 4.7+ (e.g., Monster Digital or SwiftPOD for US DTG), and enable automatic Order Routing in Printify settings to prevent holiday delays.'
      }
    ],
    sources: [
      { label: 'Printify Official Pricing & Catalog', url: 'https://printify.com/pricing/' },
      { label: 'Printful Pricing & Fulfillment Rates', url: 'https://www.printful.com/pricing' }
    ]
  },

  'ecommerce-tax-calculator': {
    whenToUse:
      'Use this planning estimator to calculate how much cash US sole proprietors and single-member LLC sellers should set aside quarterly (IRS Form 1040-ES) for 15.3% self-employment tax, federal income tax (with 20% QBI deduction), and state income tax. Educational planning tool only—confirm final returns with a licensed CPA.',
    formulaSummary:
      'Net Schedule C Profit = Gross Sales − COGS − Marketplace Fees − Ads − Overhead Write-Offs. Self-Employment Tax = Net Profit × 92.35% × 15.3%. Taxable Income Basis ≈ max(0, Net Profit − 50% SE Tax − 20% QBI Deduction). Quarterly Set-Aside = (SE Tax + Est. Federal + Est. State) ÷ 4.',
    workedExample: {
      title: 'Worked 2026 Example: $85,000 Gross Marketplace Sales With $32,500 Net Profit',
      bullets: [
        'After subtracting $44,000 COGS/fees/ads and $8,500 overhead write-offs, Schedule C Net Profit is $32,500. Estimated SE tax is $4,592 plus ~$4,335 combined federal/state tax = ~$2,232/quarter set-aside (~27.5% of net profit).',
        'Properly documenting that $8,500 in legitimate overhead write-offs (home office, software, shipping supplies, mileage) saves roughly $2,500–$3,100 in cash taxes.'
      ]
    },
    extraFaqs: [
      {
        q: 'What are the IRS quarterly Form 1040-ES estimated tax due dates?',
        a: 'Quarterly US estimated payments are generally due April 15 (Q1), June 15 (Q2), September 15 (Q3), and January 15 of the following year (Q4), shifting to the next business day on weekends/holidays.'
      },
      {
        q: 'Does this calculator replace an accountant or handle S-Corp payroll splits?',
        a: 'No. This estimator models sole proprietor / single-member LLC Schedule C math for cash-flow planning. Once net profit consistently exceeds $70,000–$80,000/year, ask a licensed CPA whether an S-Corp election saves self-employment tax.'
      }
    ],
    sources: [
      { label: 'IRS — Schedule C (Form 1040) Instructions', url: 'https://www.irs.gov/forms-pubs/about-schedule-c-form-1040' },
      { label: 'IRS — Self-Employment Tax (15.3% on 92.35%)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
      { label: 'IRS — Form 1099-K Reporting Guidance', url: 'https://www.irs.gov/businesses/understanding-your-form-1099-k' }
    ]
  },

  'shopify-profit-margin-calculator': {
    whenToUse:
      'Use this calculator to analyze single-order DTC unit economics on your Shopify store—including landed COGS, box/postage, Shopify Payments fees, Meta/TikTok ad CPA, and a realistic return reserve. To compare Basic vs. Grow vs. Advanced subscription costs, use our Shopify Plan & Fee Calculator.',
    formulaSummary:
      'Gross = Order AOV + Buyer Shipping. Card Fee = Gross × Plan Rate + $0.30. Return Reserve = Gross × Return Rate %. Pre-Ad Contribution = Gross − COGS − Postage − Card Fee − Return Reserve. Net Profit = Pre-Ad Contribution − Paid Ad CPA. Break-Even ROAS = Gross ÷ Pre-Ad Contribution.',
    workedExample: {
      title: 'Worked 2026 Example: $68 AOV Free-Shipping Order With $18 Meta CPA & 3% Return Reserve',
      bullets: [
        'Shopify Payments Basic takes $2.27 (3.3%), COGS + postage take $21.75, return allowance reserves $2.04, and ad CPA takes $18.00—leaving $23.94 true net profit (35.2% net margin).',
        'Your pre-ad contribution margin is $41.94 (exact Max Allowable CPA), giving a comfortable 1.62x Break-Even ROAS.'
      ]
    },
    extraFaqs: [
      {
        q: 'Why include paid ad CPA inside a per-order Shopify profit calculator?',
        a: 'Unlike marketplaces with built-in search traffic, most Shopify stores rely on Meta, Google, or TikTok ads for new orders. Excluding CPA overstates true DTC margin by 20%–35%.'
      },
      {
        q: 'Should I exclude fixed monthly overhead like Shopify Basic ($39/mo) here?',
        a: 'Yes—this tool measures per-order variable contribution after ads so you know whether each additional order adds cash. Compare monthly total contribution against your fixed SaaS overhead in our Excel OS.'
      }
    ],
    sources: [
      { label: 'Shopify Official Pricing & Processing Rates', url: 'https://www.shopify.com/pricing' }
    ]
  },

  'etsy-digital-product-profit-calculator': {
    whenToUse:
      'Use this calculator specifically for $0-shipping, $0-COGS digital downloads on Etsy (printables, Canva templates, SVGs, Notion/Excel sheets) to expose fixed $0.45 fee drag on low-ticket files and map exact monthly sales targets.',
    formulaSummary:
      'Net Sale Price = Listing Price × (1 − Coupon %). Per-Order Etsy Fee = $0.20 Auto-Renew + (6.5% × Price) + (3.0% × Price + $0.25) + Offsite Ads. Monthly Net = (Net Sale Price − Fee) × Monthly Sales − Monthly Etsy Ads Budget.',
    workedExample: {
      title: 'Worked 2026 Example: $9 Printable at 20% Off ($7.20 Checkout) vs. $18 Bundle',
      bullets: [
        'At $7.20 checkout, Etsy’s $0.45 fixed + 9.5% variable fees take $1.13 (15.8%), leaving $6.07/download. At 120 sales/month minus $45 Etsy Ads, net monthly income is $682.92.',
        'Bundling 3–5 related templates at $18.00 drops Etsy’s effective organic take from 15.8% down to 12.0%, cutting the sales needed for $2,000/month by more than half.'
      ]
    },
    extraFaqs: [
      {
        q: 'Are digital downloads on Etsy subject to state sales tax or EU VAT?',
        a: 'Yes, Etsy automatically collects and remits applicable US state digital sales tax and EU/UK VAT on digital downloads—you do not collect it manually, though Etsy Payments applies 3% to the tax-inclusive checkout total.'
      },
      {
        q: 'Should I sell digital products on Etsy, Gumroad, or Shopify?',
        a: 'Etsy offers built-in buyer search demand at ~12%–16% total fees, while direct traffic from Pinterest/TikTok converts with 0% Etsy Offsite Ads risk on Gumroad or Shopify.'
      }
    ],
    sources: [
      { label: 'Etsy Help Center — Listing & Auto-Renewal Fees for Digital Items', url: 'https://help.etsy.com/hc/en-us/articles/360035902374-Beginner-s-Guide-to-Etsy-Fees' }
    ]
  },

  'poshmark-fee-calculator': {
    whenToUse:
      'Use this calculator before sourcing thrift/liquidation apparel or sending Offer-to-Likers (OTL) shipping discounts on Poshmark US so you verify exact net payout and sourcing ROI.',
    formulaSummary:
      'Poshmark Commission = $2.95 flat if Sale Price < $15, else Sale Price × 20.0% (payment processing included). Payout = Sale Price − Commission − Seller Shipping Discount. Net Profit = Payout − Sourcing COGS − Supplies.',
    workedExample: {
      title: 'Worked 2026 Example: $42 Thrift Jacket ($11 Sourcing) With vs. Without OTL Discount',
      bullets: [
        'Full-price sale: $8.40 commission (20%) leaves $33.60 payout and $22.10 net profit (201% ROI on $11 sourcing).',
        'Sending a private Offer to Likers with $4.95 discounted shipping deducts an extra $3.02 from your payout—turning effective Poshmark cost to 27.2% ($11.42) and shrinking net profit to $19.08.'
      ]
    },
    extraFaqs: [
      {
        q: 'Does Poshmark charge fees on buyer-paid shipping or sales tax?',
        a: 'No! Unlike eBay and Etsy, Poshmark’s 20% commission ($2.95 under $15) applies strictly to the item sale price—and buyers receive Priority Mail shipping up to 5 lbs on one flat label.'
      },
      {
        q: 'What happens if my Poshmark package weighs over 5 pounds?',
        a: 'Sellers must purchase an upgraded overweight USPS label directly inside Poshmark (starting around $4.50+ for 6 lbs up to 10 lbs max), which deducts straight from your order earnings.'
      }
    ],
    sources: [
      { label: 'Poshmark Support — Commission & Seller Fees (US)', url: 'https://support.poshmark.com/s/article/810758272' }
    ]
  },

  'mercari-fee-calculator': {
    whenToUse:
      'Use this tool when pricing resale items on Mercari US under its 10% flat seller fee policy—and compare instant fee savings directly against Poshmark’s 20% commission.',
    formulaSummary:
      'Fee Basis = Item Sale Price + Buyer-Paid Shipping. Mercari Seller Fee = Fee Basis × 10.0%. Payout = Item Sale Price − Mercari Fee − Seller-Paid Shipping (if Free Ship). Net Profit = Payout − Sourcing COGS − Packaging.',
    workedExample: {
      title: 'Worked 2026 Example: $38 Item + $5.99 Buyer-Paid Shipping ($10 Sourcing)',
      bullets: [
        'Mercari’s 10% fee applies to $43.99 ($4.40 fee), leaving $33.60 payout and $22.95 net profit (60.4% margin).',
        'Selling that exact $38 item on Poshmark would cost $7.60 (20%)—meaning Mercari puts an extra $3.20 pure profit in your pocket on a single flip.'
      ]
    },
    extraFaqs: [
      {
        q: 'Does Mercari charge a fee to transfer earnings to my US bank account?',
        a: 'Standard ACH direct deposits to a US bank account carry $0 fee under Mercari’s updated 2026 fee schedule; Instant Pay to a debit card still carries a small convenience fee.'
      },
      {
        q: 'Is it better to offer Free Shipping or Buyer-Paid Shipping on Mercari?',
        a: 'Compare both above: with buyer-paid shipping, Mercari charges 10% on the shipping label too, whereas baking exact Pirate Ship postage into a Free Shipping price sometimes saves $1–$2 on lightweight items.'
      }
    ],
    sources: [
      { label: 'Mercari US Help Center — Selling Fees & Payouts', url: 'https://www.mercari.com/us/help_center/article/169/' }
    ]
  },

  'whatnot-fee-calculator': {
    whenToUse:
      'Use this tool BEFORE going live on Whatnot so you know your exact mathematical Break-Even Start Bid across Standard (8%), Electronics (5%), and Coins & Money (4%) categories—including amortized viewer giveaway labels.',
    formulaSummary:
      'Commission = Hammer Price × Category Rate (8%/5%/4%). Processing Basis = Hammer Price + Buyer Ship + Est. Buyer Tax. Processing = Basis × 2.9% + $0.30. Net Profit = Hammer Price − Commission − Processing − COGS − Amortized Giveaway/Packing.',
    workedExample: {
      title: 'Worked 2026 Example: $25 Winning Bid (8% Apparel/Cards, $4.50 Ship, $9 COGS)',
      bullets: [
        'Commission takes $2.00 + processing (on $31.57 tax-inclusive basis) takes $1.22 = $3.22 total Whatnot fees (12.9%). Subtracting $9.00 COGS and $0.85 giveaway allocation leaves $11.93 net profit.',
        'Exact break-even start bid is $11.58—so running risky "$1 starts" in a small room under 25 bidders can easily lose money.'
      ]
    },
    extraFaqs: [
      {
        q: 'Why does Whatnot’s 2.9% processing fee look higher than 2.9% of my winning bid?',
        a: 'Because payment processors charge 2.9% + $0.30 on the ENTIRE checkout charge (item + buyer shipping + state sales tax), which pushes effective processing on a $15–$25 auction to ~4.5%–5.5% of the hammer price.'
      },
      {
        q: 'How should I calculate giveaway cost per paid order?',
        a: 'If you run 5 viewer giveaways per show costing $4.50 postage + $2.00 item ($32.50 total) and expect 40 paid orders, enter $0.81 in the Giveaway Allocation field.'
      }
    ],
    sources: [
      { label: 'Whatnot Help Center — Official US Seller Fee Schedule', url: 'https://help.whatnot.com/hc/en-us/articles/4407962164621-Whatnot-Seller-Fees' }
    ]
  },

  'bundle-discount-profit-calculator': {
    whenToUse:
      'Use this AOV optimizer when designing "Buy 2 Save 15%", "Buy 3 Save 20%", or "BOGO 50% Off" promotions on Shopify, TikTok Shop, or Etsy so you prove the discount increases total net profit DOLLARS per customer.',
    formulaSummary:
      'Single Profit = Price − COGS − 1-Unit Ship − Card Fee − Ad CPA. Bundle Sale = (Price × Units) × (1 − Discount %). Bundle Profit = Bundle Sale − (COGS × Units) − Bundle Ship − Bundle Card Fee − Same Single Ad CPA. Profit Lift = Bundle Profit − Single Profit.',
    workedExample: {
      title: 'Worked 2026 Example: $32 Product ($8.50 COGS, $10 CPA) — Single vs. 2-Pack @ 15% Off',
      bullets: [
        'A single-unit checkout nets just $7.02 profit after $5.25 postage, $1.23 fee, and $10.00 ad CPA.',
        'A 2-pack at 15% off ($54.40) pays the $10.00 ad CPA ONCE and adds only $1.00 to postage ($6.25 total)—jumping net profit to $19.27/order (+$12.25 more cash per customer!).'
      ]
    },
    extraFaqs: [
      {
        q: 'What if a bundle discount drops my percentage margin even though profit dollars rise?',
        a: 'You pay rent and buy inventory with profit DOLLARS, not percentages. Going from $7.02 (21.9%) to $19.27 (35.4%) on the exact same ad click nearly triples your return on ad spend.'
      },
      {
        q: 'Does a heavy 3-pack push USPS shipping from Ground Advantage into a higher weight tier?',
        a: 'Always weigh 2-packs and 3-packs on a postal scale first and enter the true higher parcel cost in the "Bundle Postage + Box Cost" field above.'
      }
    ],
    sources: [
      { label: 'Shopify Guide — Product Bundling & Average Order Value Math', url: 'https://www.shopify.com/blog/product-bundling' }
    ]
  },

  'depop-fee-calculator': {
    whenToUse:
      'Use this calculator for US Depop vintage, streetwear, and resale flips to check exact 3.3% + $0.45 Depop Payments deductions (on item + shipping + sales tax), model optional 12% Boosted Listings, and quantify instant savings vs. Poshmark.',
    formulaSummary:
      'Selling Commission = $0.00 (US eligible listings). Processing Basis = Sale Price + Buyer Ship + Est. Sales Tax. Depop Payments = Basis × 3.3% + $0.45. Optional Boosted Fee = (Sale Price + Buyer Ship) × 12%. Net Profit = Sale Price − Total Depop Fees − Seller Ship − COGS.',
    workedExample: {
      title: 'Worked 2026 Example: $38 Vintage Tee + $5.99 Buyer Ship ($11 COGS, 7% Tax)',
      bullets: [
        'Organic Depop sale: $0 commission + $2.00 processing (5.3% effective) = $25.00 net profit—keeping $5.60 MORE than Poshmark’s 20% fee ($7.60).',
        'Enabling 12% Boosted Listings adds $5.28 (pushing total fees to $7.28 / 19.2%), shrinking net profit to $19.72.'
      ]
    },
    extraFaqs: [
      {
        q: 'If I turn off Boosted Listings right before a buyer checks out, do I still pay 12%?',
        a: 'Yes, if that buyer clicked your listing while it was boosted within the prior 28 days, Depop’s attribution window still applies the 12% Boosted Listing fee.'
      },
      {
        q: 'Are there any US listings that still pay Depop’s old 10% selling fee?',
        a: 'Only legacy listings created before Depop’s US fee removal that were never updated/relisted—newly created or refreshed US listings qualify for 0% selling commission.'
      }
    ],
    sources: [
      { label: 'Depop Help Center — US Selling & Payment Fees', url: 'https://depophelp.zendesk.com/hc/en-us/articles/360001791127-Selling-fees' },
      { label: 'Depop Help Center — Boosted Listings Terms', url: 'https://depophelp.zendesk.com/hc/en-us/articles/7201725548945-Boosted-Listings' }
    ]
  },

  'etsy-vs-tiktok-shop-calculator': {
    whenToUse:
      'Use this monthly multi-order comparison when deciding whether to allocate catalog and creative budget toward Etsy US (higher organic base fee + Offsite Ads) or TikTok Shop US (6% base referral + variable creator affiliate cuts).',
    formulaSummary:
      'Etsy Monthly Fees = (Orders × $0.45) + (Rev × 9.5%) + (Offsite Orders × min($100, Order × 15%)). TikTok Monthly Fees = Rev × (Referral % + Blended Creator Affiliate %). Compares net monthly and annual cash retained side-by-side.',
    workedExample: {
      title: 'Worked 2026 Example: 60 Orders/Mo @ $38 ($14.50 COGS+Ship, 15% Etsy Offsite vs. 12% TikTok Creator)',
      bullets: [
        'At 12% blended TikTok creator commission (18% total fee = $410.40/mo), Etsy US ($294.90 fees) nets $115.50/month (+$1,386/yr) MORE than TikTok Shop.',
        'Lower TikTok blended creator % below ~6.9% (by posting shop-owned videos) and TikTok flips into the lead—saving up to $158/month ($1,897/yr) at 0% creator cut.'
      ]
    },
    extraFaqs: [
      {
        q: 'How do shipping lead-time rules differ between Etsy and TikTok Shop US?',
        a: 'Etsy allows custom made-to-order processing times up to several weeks, whereas TikTok Shop US strictly enforces fast 2–3 business day dispatch and Valid Tracking Rate SLAs.'
      },
      {
        q: 'Can I sync inventory automatically across Etsy and TikTok Shop?',
        a: 'Yes—Printify syncs POD products directly to both Etsy and TikTok Shop US, and Shopify sellers can use marketplace sync apps to share one inventory pool.'
      }
    ],
    sources: [
      { label: 'Etsy US Fees & Offsite Ads Documentation', url: 'https://help.etsy.com/hc/en-us/articles/360035902374-Beginner-s-Guide-to-Etsy-Fees' },
      { label: 'TikTok Shop US Seller Academy — Referral Fees', url: 'https://seller-us.tiktok.com/university/essay?knowledge_id=6837887923128065' }
    ]
  }
};
