Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'products\dist'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$dot = [char]0x2022
$chk = [char]0x2713

$covers = @(
  @{
    file = 'cover-flagship-os.png'
    accent = '#f59e0b'
    badgeBg = '#3b321d'
    glowA = 56; glowR = 245; glowG = 158; glowB = 11
    badge = "BEST SELLER $dot 5-TAB EXCEL OS"
    title1 = '2026 Multi-Channel Seller'
    title2 = 'Profit, Inventory & Tax OS'
    subtitle = 'SKU Pricing Matrix + 12-Month Dashboard + Reorder & Tax Tracker.'
    b1 = "$chk  2026 US Marketplace Fee Formulas (Etsy, Shopify, TikTok Shop)"
    b2 = "$chk  Unlocked Live Formulas $dot Zero Monthly Subscriptions"
    price = 'ONLY $24'
  },
  @{
    file = 'cover-free-cheatsheet.png'
    accent = '#2dd4bf'
    badgeBg = '#13383b'
    glowA = 52; glowR = 45; glowG = 212; glowB = 191
    badge = 'FREE 2026 SELLER GUIDE'
    title1 = '2026 US Seller Fee &'
    title2 = 'Schedule-C Tax Cheat Sheet'
    subtitle = 'Compare Etsy, Shopify & TikTok Shop fees + top tax write-offs.'
    b1 = "$chk  2026 US Marketplace Fee Formulas (Etsy, Shopify, TikTok Shop)"
    b2 = "$chk  Unlocked Live Formulas $dot Zero Monthly Subscriptions"
    price = 'FREE ($0)'
  },
  @{
    file = 'cover-pod-matrix.png'
    accent = '#38bdf8'
    badgeBg = '#123149'
    glowA = 52; glowR = 56; glowG = 189; glowB = 248
    badge = 'PRINT-ON-DEMAND EDITION'
    title1 = '2026 POD & Etsy Bulk'
    title2 = 'Pricing & Offsite Ads Matrix'
    subtitle = 'Printify Standard vs. Premium + 12%/15% Offsite Ads Protection.'
    b1 = "$chk  Compare Printify, Printful & Etsy Fees Side-by-Side"
    b2 = "$chk  Unlocked Live Formulas $dot Zero Monthly Subscriptions"
    price = 'ONLY $17'
  }
)

foreach ($c in $covers) {
  $bmp = New-Object System.Drawing.Bitmap(1200, 900)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#0b1324'))
  $g.FillRectangle($bgBrush, 0, 0, 1200, 900)

  $accentColor = [System.Drawing.ColorTranslator]::FromHtml($c.accent)
  $accentBrush = New-Object System.Drawing.SolidBrush($accentColor)
  $g.FillRectangle($accentBrush, 0, 0, 1200, 18)

  $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($c.glowA, $c.glowR, $c.glowG, $c.glowB))
  $g.FillEllipse($glowBrush, 760, -140, 560, 560)

  $badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($c.badgeBg))
  $g.FillRectangle($badgeBrush, 80, 90, 440, 54)
  $fBadge = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold)
  $g.DrawString($c.badge, $fBadge, $accentBrush, 102, 104)

  $fTitle = New-Object System.Drawing.Font('Segoe UI', 44, [System.Drawing.FontStyle]::Bold)
  $g.DrawString($c.title1, $fTitle, [System.Drawing.Brushes]::White, 80, 200)
  $g.DrawString($c.title2, $fTitle, [System.Drawing.Brushes]::White, 80, 278)

  $fSub = New-Object System.Drawing.Font('Segoe UI', 21, [System.Drawing.FontStyle]::Regular)
  $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#cbd5e1'))
  $g.DrawString($c.subtitle, $fSub, $subBrush, 82, 385)

  $boxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#131f35'))
  $boxPen = New-Object System.Drawing.Pen($accentColor, 3)
  $g.FillRectangle($boxBrush, 80, 485, 1040, 260)
  $g.DrawRectangle($boxPen, 80, 485, 1040, 260)

  $fBoxHead = New-Object System.Drawing.Font('Segoe UI', 21, [System.Drawing.FontStyle]::Bold)
  $g.DrawString("INSTANT .XLSX DOWNLOAD  $dot  EXCEL & GOOGLE SHEETS READY", $fBoxHead, $accentBrush, 118, 530)

  $fBullet = New-Object System.Drawing.Font('Segoe UI', 20, [System.Drawing.FontStyle]::Regular)
  $lightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#f1f5f9'))
  $g.DrawString($c.b1, $fBullet, $lightBrush, 118, 595)
  $g.DrawString($c.b2, $fBullet, $lightBrush, 118, 650)

  $fBrand = New-Object System.Drawing.Font('Segoe UI', 24, [System.Drawing.FontStyle]::Bold)
  $g.DrawString('ShopMarginLab', $fBrand, $subBrush, 82, 798)

  $fPrice = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Bold)
  $sfRight = New-Object System.Drawing.StringFormat
  $sfRight.Alignment = [System.Drawing.StringAlignment]::Far
  $priceRect = New-Object System.Drawing.RectangleF(640, 786, 480, 70)
  $g.DrawString($c.price, $fPrice, $accentBrush, $priceRect, $sfRight)

  $outPath = Join-Path $outDir $c.file
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

Write-Output "Rendered 3 product cover PNGs into $outDir"
