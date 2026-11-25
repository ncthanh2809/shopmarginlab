/**
 * Pure-Node OpenXML (.xlsx) Digital Workbook Generator
 * Creates genuine multi-sheet Microsoft Excel / Google Sheets .xlsx files with:
 *   - Styled title banners & dark-teal column headers
 *   - Currency ($#,##0.00) and Percentage (0.0%) number formats
 *   - Live recalculated Excel formulas (=SUM, =IF, fee equations)
 * Zero external npm dependencies required (uses built-in node:zlib).
 */

import { deflateRawSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'products', 'dist');
mkdirSync(OUT_DIR, { recursive: true });

// Standard CRC-32 implementation for ZIP archives
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipBuffer(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const rawBuf = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, 'utf8');
    const compressed = deflateRawSync(rawBuf);
    const checksum = crc32(rawBuf);

    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4); // Version needed
    localHeader.writeUInt16LE(0, 6); // Flags
    localHeader.writeUInt16LE(8, 8); // Compression: Deflate
    localHeader.writeUInt16LE(0, 10); // Mod time
    localHeader.writeUInt16LE(0x5979, 12); // Mod date
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(rawBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    localParts.push(localHeader, compressed);

    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0x5979, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(rawBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + compressed.length;
  }

  const centralSize = centralParts.reduce((s, b) => s + b.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...centralParts, eocd]);
}

function xmlEsc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function colLetter(colIdxZero) {
  let n = colIdxZero + 1;
  let str = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    str = String.fromCharCode(65 + rem) + str;
    n = Math.floor((n - 1) / 26);
  }
  return str;
}

/**
 * Style indices in styles.xml:
 * 0 = Default normal
 * 1 = Title banner (Bold 14pt white on dark slate #0F172A)
 * 2 = Table header (Bold 11pt white on teal #0D9488)
 * 3 = Currency ($#,##0.00)
 * 4 = Percentage (0.0%)
 * 5 = Bold Total Currency ($#,##0.00 on soft teal #CCFBF1)
 * 6 = Bold Text Label (on soft teal #CCFBF1)
 */
const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="2">
    <numFmt numFmtId="164" formatCode="$#,##0.00;($#,##0.00);&quot;-&quot;"/>
    <numFmt numFmtId="165" formatCode="0.0%"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="11"/><color rgb="FF0F172A"/><name val="Calibri"/></font>
    <font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FF0F172A"/><name val="Calibri"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F172A"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0D9488"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFCCFBF1"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="7">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="164" fontId="3" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
  </cellXfs>
</styleSheet>`;

/**
 * Cell spec helper:
 *   - string -> plain text (style 0)
 *   - number -> numeric (style 0)
 *   - { v, f, s } -> v = value, f = Excel formula (without leading '='), s = style index
 */
function buildSheetXml(rows, colWidths = []) {
  const colsXml =
    colWidths.length > 0
      ? `<cols>${colWidths
          .map((w, idx) => `<col min="${idx + 1}" max="${idx + 1}" width="${w}" customWidth="1"/>`)
          .join('')}</cols>`
      : '';

  const rowsXml = rows
    .map((cells, rIdx) => {
      const rowNum = rIdx + 1;
      const heightAttr = rIdx === 0 ? ' ht="28" customHeight="1"' : rIdx === 2 ? ' ht="22" customHeight="1"' : '';
      const cellsXml = cells
        .map((cell, cIdx) => {
          if (cell === null || cell === undefined || cell === '') return '';
          const ref = `${colLetter(cIdx)}${rowNum}`;
          const obj = typeof cell === 'object' ? cell : { v: cell, s: 0 };
          const styleAttr = obj.s ? ` s="${obj.s}"` : '';

          if (obj.f) {
            const cached = typeof obj.v === 'number' ? `<v>${obj.v}</v>` : '';
            return `<c r="${ref}"${styleAttr}><f>${xmlEsc(obj.f)}</f>${cached}</c>`;
          }
          if (typeof obj.v === 'number') {
            return `<c r="${ref}"${styleAttr}><v>${obj.v}</v></c>`;
          }
          return `<c r="${ref}" t="inlineStr"${styleAttr}><is><t>${xmlEsc(obj.v)}</t></is></c>`;
        })
        .join('');
      return `<row r="${rowNum}"${heightAttr}>${cellsXml}</row>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${colsXml}
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
}

function buildXlsxWorkbook(sheets) {
  const entries = [];

  const overrides = sheets
    .map(
      (_, i) =>
        `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join('');

  entries.push({
    name: '[Content_Types].xml',
    data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${overrides}
</Types>`
  });

  entries.push({
    name: '_rels/.rels',
    data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  });

  entries.push({
    name: 'xl/workbook.xml',
    data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <workbookPr/>
  <sheets>
    ${sheets.map((s, i) => `<sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}
  </sheets>
  <calcPr fullCalcOnLoad="1"/>
</workbook>`
  });

  entries.push({
    name: 'xl/_rels/workbook.xml.rels',
    data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheets
    .map(
      (_, i) =>
        `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
    )
    .join('')}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  });

  entries.push({ name: 'xl/styles.xml', data: STYLES_XML });

  sheets.forEach((s, i) => {
    entries.push({
      name: `xl/worksheets/sheet${i + 1}.xml`,
      data: buildSheetXml(s.rows, s.widths || [])
    });
  });

  return createZipBuffer(entries);
}

const hdr = (t) => ({ v: t, s: 2 });
const cur = (v) => ({ v, s: 3 });
const curF = (f) => ({ f, s: 3 });
const pctF = (f) => ({ f, s: 4 });
const totLbl = (t) => ({ v: t, s: 6 });
const totCur = (f) => ({ f, s: 5 });

// =========================================================================
// PRODUCT 1: Flagship $24 Seller Profit, Inventory & Schedule-C Tax OS
// =========================================================================
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const sampleSales = [3200, 3450, 4100, 3950, 4600, 4850, 5100, 5400, 5900, 6800, 9200, 10500];

const tab1Rows = [
  [{ v: 'SHOPMARGINLAB — 2026 EXECUTIVE SELLER PROFIT & MARGIN DASHBOARD', s: 1 }, '', '', '', '', '', ''],
  ['Instructions: Enter monthly totals in Columns B–E (or link from Monthly_Order_Log). Net Profit & Margin % calculate automatically!'],
  [
    hdr('Month (2026)'),
    hdr('Gross Sales ($)'),
    hdr('Platform & Processing Fees ($)'),
    hdr('Product COGS & Postage ($)'),
    hdr('Ad Spend ($)'),
    hdr('Net Profit ($)'),
    hdr('Net Margin (%)')
  ],
  ...months.map((m, idx) => {
    const r = idx + 4;
    const rev = sampleSales[idx];
    return [
      m,
      cur(rev),
      cur(Number((rev * 0.105).toFixed(2))),
      cur(Number((rev * 0.34).toFixed(2))),
      cur(Number((rev * 0.12).toFixed(2))),
      curF(`B${r}-C${r}-D${r}-E${r}`),
      pctF(`IF(B${r}>0,F${r}/B${r},0)`)
    ];
  }),
  [
    totLbl('2026 ANNUAL TOTAL'),
    totCur('SUM(B4:B15)'),
    totCur('SUM(C4:C15)'),
    totCur('SUM(D4:D15)'),
    totCur('SUM(E4:E15)'),
    totCur('SUM(F4:F15)'),
    pctF('IF(B16>0,F16/B16,0)')
  ]
];

const sampleSkus = [
  ['SKU-101', 'Custom Engraved Cutting Board', 44.0, 6.0, 11.5, 5.25],
  ['SKU-102', 'Soy Candle Gift Box Set', 32.0, 4.99, 7.8, 4.6],
  ['SKU-103', 'Embroidered Heavyweight Tote', 29.5, 4.5, 8.2, 4.2],
  ['SKU-104', 'Personalized Leather Keychain', 18.99, 3.99, 3.1, 3.85],
  ['SKU-105', 'Botanical Ceramic Planter', 38.0, 6.5, 9.4, 5.9]
];

const tab2Rows = [
  [{ v: 'MULTI-CHANNEL SKU PRICING MATRIX (ETSY 2026 vs. SHOPIFY vs. TIKTOK SHOP US)', s: 1 }],
  ['Compare exact per-order net profit across all 3 channels automatically before launching a product or discount.'],
  [
    hdr('SKU Code'),
    hdr('Product Name'),
    hdr('Item Price ($)'),
    hdr('Shipping Charged ($)'),
    hdr('Landed COGS ($)'),
    hdr('Actual Postage ($)'),
    hdr('Etsy Net Profit ($)'),
    hdr('Shopify Net Profit ($)'),
    hdr('TikTok US Net Profit (w/ 15% Creator)')
  ],
  ...sampleSkus.map((s, idx) => {
    const r = idx + 4;
    return [
      s[0],
      s[1],
      cur(s[2]),
      cur(s[3]),
      cur(s[4]),
      cur(s[5]),
      curF(`(C${r}+D${r})-(0.20+0.25+(C${r}+D${r})*0.095)-E${r}-F${r}`),
      curF(`(C${r}+D${r})-(0.30+(C${r}+D${r})*0.029)-E${r}-F${r}`),
      curF(`(C${r}+D${r})-((C${r}+D${r})*0.06)-(C${r}*0.15)-E${r}-F${r}`)
    ];
  })
];

const tab3Rows = [
  [{ v: 'MONTHLY PAYOUT & RECONCILIATION LOG', s: 1 }],
  ['Log your monthly marketplace payouts (Etsy, Shopify, TikTok Shop, Amazon) for clean bookkeeping.'],
  [hdr('Payout Date'), hdr('Sales Channel'), hdr('Orders Count'), hdr('Gross Buyer Sales ($)'), hdr('Total Fees Deducted ($)'), hdr('Refunds ($)'), hdr('Net Bank Deposit ($)')],
  ['2026-01-31', 'Etsy Payments', 84, cur(3190), cur(334.95), cur(42.0), curF('D4-E4-F4')],
  ['2026-01-31', 'Shopify Payments', 46, cur(2280), cur(79.92), cur(0), curF('D5-E5-F5')],
  ['2026-01-31', 'TikTok Shop US', 62, cur(1980), cur(396.0), cur(29.99), curF('D6-E6-F6')],
  [totLbl('TOTAL'), '', { v: 192, f: 'SUM(C4:C6)', s: 6 }, totCur('SUM(D4:D6)'), totCur('SUM(E4:E6)'), totCur('SUM(F4:F6)'), totCur('SUM(G4:G6)')]
];

const tab4Rows = [
  [{ v: 'INVENTORY & SAFETY STOCK REORDER TRACKER', s: 1 }],
  ['Automatic REORDER NOW alert triggers whenever On-Hand Units drop at or below Reorder Threshold.'],
  [hdr('SKU Code'), hdr('Item Description'), hdr('Units On Hand'), hdr('Reorder Point'), hdr('Unit Landed Cost ($)'), hdr('Stock Asset Value ($)'), hdr('Reorder Status')],
  ['SKU-101', 'Walnut Board Blanks', 42, 25, cur(11.5), curF('C4*E4'), { f: 'IF(C4<=D4,"REORDER NOW","IN STOCK")', s: 6 }],
  ['SKU-102', 'Amber Glass Candle Jars', 18, 30, cur(2.4), curF('C5*E5'), { f: 'IF(C5<=D5,"REORDER NOW","IN STOCK")', s: 6 }],
  ['SKU-103', 'Organic Cotton Canvas Totes', 95, 40, cur(4.1), curF('C6*E6'), { f: 'IF(C6<=D6,"REORDER NOW","IN STOCK")', s: 6 }],
  ['SKU-104', 'Kraft Mailer Boxes (6x6x4)', 22, 50, cur(0.68), curF('C7*E7'), { f: 'IF(C7<=D7,"REORDER NOW","IN STOCK")', s: 6 }],
  [totLbl('TOTAL INVENTORY VALUE'), '', '', '', '', totCur('SUM(F4:F7)'), '']
];

const tab5Rows = [
  [{ v: 'US IRS SCHEDULE-C TAX DEDUCTION & EXPENSE LOG (2026)', s: 1 }],
  ['Track deductible small-business expenses throughout the year so you never overpay self-employment tax.'],
  [hdr('Expense Date'), hdr('Vendor / Payee'), hdr('Schedule-C Category'), hdr('Business Purpose / Notes'), hdr('Deductible Amount ($)')],
  ['2026-01-05', 'Pirate Ship / USPS', 'Postage & Shipping', 'Order shipping labels batch', cur(214.8)],
  ['2026-01-10', 'Uline Packaging', 'Supplies (Line 22)', 'Bubble mailers & tissue paper', cur(168.4)],
  ['2026-01-15', 'Shopify Inc.', 'Office / Software Subscriptions', 'Monthly e-commerce storefront plan', cur(39.0)],
  ['2026-01-22', 'Meta Platforms', 'Advertising (Line 8)', 'Instagram retargeting campaign', cur(320.0)],
  ['2026-01-28', 'Link My Books', 'Accounting & Legal Fees (Line 17)', 'Automated QBO payout sync', cur(29.0)],
  [totLbl('TOTAL LOGGED DEDUCTIONS'), '', '', '', totCur('SUM(E4:E8)')]
];

const flagshipBuffer = buildXlsxWorkbook([
  { name: 'Executive_Dashboard', rows: tab1Rows, widths: [16, 18, 28, 26, 16, 18, 16] },
  { name: 'SKU_Pricing_Matrix', rows: tab2Rows, widths: [14, 30, 15, 19, 16, 18, 19, 20, 28] },
  { name: 'Monthly_Order_Log', rows: tab3Rows, widths: [15, 20, 15, 22, 24, 15, 22] },
  { name: 'Inventory_Reorder', rows: tab4Rows, widths: [14, 28, 16, 16, 20, 22, 18] },
  { name: 'Schedule_C_Tax_Log', rows: tab5Rows, widths: [15, 22, 30, 32, 22] }
]);

const flagshipPath = join(OUT_DIR, 'Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx');
writeFileSync(flagshipPath, flagshipBuffer);

// =========================================================================
// PRODUCT 2: $17 Print-on-Demand & Etsy Bulk Pricing Matrix (.xlsx)
// =========================================================================
const podProducts = [
  ['Bella+Canvas 3001 Tee', 27.99, 0.1, 4.99, 10.64, 4.75],
  ['Gildan 18500 Heavy Hoodie', 46.99, 0.1, 7.99, 20.85, 8.49],
  ['Comfort Colors 1717 Tee', 31.99, 0.15, 4.99, 13.45, 4.75],
  ['15oz Ceramic Coffee Mug', 19.99, 0.0, 5.49, 6.25, 5.99],
  ['Gildan 18000 Crewneck Sweatshirt', 39.99, 0.1, 6.99, 16.4, 7.29]
];

const podTab1 = [
  [{ v: '2026 PRINT-ON-DEMAND (PRINTIFY / ETSY) BULK PRICING & PROFIT MATRIX', s: 1 }],
  ['Compare Standard POD Blank Profit vs. Printify Premium (~20% Blank Discount) automatically!'],
  [
    hdr('POD Product Type'),
    hdr('Listing Price ($)'),
    hdr('Sale Discount (%)'),
    hdr('Shipping Charged ($)'),
    hdr('POD Base Blank ($)'),
    hdr('POD Shipping ($)'),
    hdr('Etsy Net Profit (Standard)'),
    hdr('Etsy Net Profit (Printify Premium 20% Off)'),
    hdr('Net Margin % (Premium)')
  ],
  ...podProducts.map((p, idx) => {
    const r = idx + 4;
    return [
      p[0],
      cur(p[1]),
      { v: p[2], s: 4 },
      cur(p[3]),
      cur(p[4]),
      cur(p[5]),
      curF(`(B${r}*(1-C${r})+D${r})-(0.45+(B${r}*(1-C${r})+D${r})*0.095)-E${r}-F${r}`),
      curF(`(B${r}*(1-C${r})+D${r})-(0.45+(B${r}*(1-C${r})+D${r})*0.095)-(E${r}*0.80)-F${r}`),
      pctF(`H${r}/(B${r}*(1-C${r})+D${r})`)
    ];
  })
];

const podTab2 = [
  [{ v: 'ETSY OFFSITE ADS (12% & 15%) PROFIT STRESS TEST', s: 1 }],
  ['Make sure every POD item stays profitable even when Etsy charges a 12% or 15% Offsite Ad fee!'],
  [hdr('POD Product Type'), hdr('Gross Buyer Paid ($)'), hdr('Total POD Cost ($)'), hdr('Profit (0% Organic)'), hdr('Profit (12% Offsite Ad)'), hdr('Profit (15% Offsite Ad)')],
  ...podProducts.map((p, idx) => {
    const r = idx + 4;
    const gross = Number((p[1] * (1 - p[2]) + p[3]).toFixed(2));
    const podCost = Number((p[4] + p[5]).toFixed(2));
    return [
      p[0],
      cur(gross),
      cur(podCost),
      curF(`B${r}-(0.45+B${r}*0.095)-C${r}`),
      curF(`B${r}-(0.45+B${r}*(0.095+0.12))-C${r}`),
      curF(`B${r}-(0.45+B${r}*(0.095+0.15))-C${r}`)
    ];
  })
];

const podTab3 = [
  [{ v: 'ETSY & TIKTOK SHOP 13-TAG SEO LISTING PLANNER', s: 1 }],
  ['Plan high-intent long-tail buyer keywords (under 20 characters per Etsy tag rule) before publishing.'],
  [hdr('Design Niche'), hdr('Primary Title Hook (First 40 Chars)'), hdr('Target Buyer Persona'), hdr('Core Tags (Comma Separated)'), hdr('Listing Status')],
  ['Pediatric Nurse Gift', 'Custom Pediatric Nurse Sweatshirt, RN', 'Hospital nurses & nursing grads', 'pediatric nurse, rn gift shirt, nicu nurse crew, night shift rn', 'Published'],
  ['Dog Mom Retro Tote', 'Custom Dog Breed Canvas Tote Bag', 'Pet owners & holiday gifters', 'dog mom tote, custom pet bag, golden retriever, dog walker gift', 'Drafting']
];

const podBuffer = buildXlsxWorkbook([
  { name: 'POD_Profit_Matrix', rows: podTab1, widths: [28, 16, 16, 18, 18, 16, 24, 34, 20] },
  { name: 'Offsite_Ads_Stress_Test', rows: podTab2, widths: [28, 20, 18, 20, 22, 22] },
  { name: 'SEO_Listing_Planner', rows: podTab3, widths: [22, 36, 28, 42, 16] }
]);

const podPath = join(OUT_DIR, 'POD-Etsy-Launch-Pricing-Matrix-2026.xlsx');
writeFileSync(podPath, podBuffer);

// =========================================================================
// 3D Product Cover Graphics & Copy-Paste Payhip/Gumroad Listing Sheet
// =========================================================================
writeFileSync(
  join(OUT_DIR, 'cover-flagship-os.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#0f172a"/>
  <rect x="60" y="60" width="1160" height="600" rx="28" fill="#1e293b" stroke="#0d9488" stroke-width="4"/>
  <rect x="110" y="115" width="280" height="44" rx="22" fill="#0d9488"/>
  <text x="140" y="145" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#ffffff">EXCEL &amp; GOOGLE SHEETS</text>
  <text x="110" y="245" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#ffffff">2026 Multi-Channel Seller</text>
  <text x="110" y="318" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="#5eead4">Profit, Inventory &amp; Tax OS</text>
  <text x="110" y="395" font-family="system-ui, sans-serif" font-size="26" fill="#cbd5e1">✓ 12-Month Profit Dashboard   ✓ Etsy vs. Shopify vs. TikTok Matrix</text>
  <text x="110" y="440" font-family="system-ui, sans-serif" font-size="26" fill="#cbd5e1">✓ Low-Stock Reorder Alerts     ✓ US IRS Schedule-C Tax Tracker</text>
  <rect x="110" y="505" width="380" height="74" rx="14" fill="#f59e0b"/>
  <text x="145" y="552" font-family="system-ui, sans-serif" font-size="30" font-weight="800" fill="#0f172a">Instant Download • $24</text>
</svg>`,
  'utf8'
);

writeFileSync(
  join(OUT_DIR, 'payhip-gumroad-product-listings.md'),
  `# Ready-to-Paste Product Listings for Payhip / Gumroad

Upload the generated \`.xlsx\` files in this folder (\`products/dist/\`) to your free **Payhip.com** or **Gumroad.com** account using the exact titles, prices, and descriptions below:

---

## Product 1: Flagship Bundle ($24 USD)
- **File to Upload:** \`Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx\`
- **Cover Image:** \`cover-flagship-os.svg\`
- **Price:** \`$24.00\` (Compare-at price: \`$49.00\`)
- **Product Title:** \`2026 Multi-Channel Seller Profit, Inventory & Schedule-C Tax Excel OS\`
- **Description (Copy-Paste):**
Stop guessing what Etsy, Shopify, and TikTok Shop fees are quietly eating out of your bank account.

This **5-Tab Microsoft Excel & Google Sheets Operating System** gives handmade, DTC, and e-commerce sellers instant clarity from SKU pricing to tax season—with **zero monthly software fees**:
1. **2026 Executive Profit Dashboard:** Automatic 12-month revenue, marketplace fee bleed, ad spend, and net margin rollup.
2. **Multi-Channel SKU Pricing Matrix:** Compare exact net profit per SKU across Etsy (2026 rates), Shopify Basic, and TikTok Shop US (incl. creator cuts).
3. **Monthly Payout Reconciliation Log:** Track gross sales, fees, refunds, and net bank deposits cleanly.
4. **Inventory & Safety-Stock Reorder Tracker:** Instant "REORDER NOW" alerts before best-sellers stock out.
5. **US IRS Schedule-C Tax Deduction Tracker:** Log postage, packaging, software, and ad write-offs in minutes.

---

## Product 2: Print-on-Demand Edition ($17 USD)
- **File to Upload:** \`POD-Etsy-Launch-Pricing-Matrix-2026.xlsx\`
- **Price:** \`$17.00\` (Compare-at price: \`$35.00\`)
- **Product Title:** \`2026 Print-on-Demand (Printify & Etsy) Bulk Pricing & Offsite Ads Matrix (.xlsx)\`
- **Description (Copy-Paste):**
Never accidentally sell a t-shirt, hoodie, or mug at a loss during a 15% sale or mandatory Etsy Offsite Ad! Includes side-by-side Printify Standard vs. Printify Premium (20% off blank cost) profit formulas, Offsite Ads stress-testing (12% & 15%), and a 13-Tag Etsy SEO Listing Planner.
`,
  'utf8'
);

console.log(`✅ Built 2 live-formula .xlsx digital products + cover & Payhip/Gumroad copy in ${OUT_DIR}`);
