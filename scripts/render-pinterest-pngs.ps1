Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root "products\dist\pins\pins-manifest.json"
$outDir = Join-Path $root "products\dist\pins-png"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$pinsJson = [System.IO.File]::ReadAllText($manifestPath, [System.Text.Encoding]::UTF8)
$pins = $pinsJson | ConvertFrom-Json
$bulletSep = [char]0x2022

foreach ($p in $pins) {
  $bmp = New-Object System.Drawing.Bitmap(1000, 1500)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#0f172a"))
  $g.FillRectangle($bgBrush, 0, 0, 1000, 1500)

  $tealGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(72, 13, 148, 136))
  $g.FillEllipse($tealGlow, 560, -140, 640, 640)

  $goldGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 245, 158, 11))
  $g.FillEllipse($goldGlow, -140, 1100, 520, 520)

  # Top badge pill
  $tealBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#0d9488"))
  $g.FillRectangle($tealBrush, 80, 95, 520, 64)
  $fPill = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
  $g.DrawString($p.topPill, $fPill, [System.Drawing.Brushes]::White, 105, 111)

  # 3 Headline lines
  $fHead = New-Object System.Drawing.Font("Segoe UI", 52, [System.Drawing.FontStyle]::Bold)
  $mintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#5eead4"))
  $g.DrawString($p.line1, $fHead, [System.Drawing.Brushes]::White, 76, 225)
  $g.DrawString($p.line2, $fHead, $mintBrush, 76, 325)
  $g.DrawString($p.line3, $fHead, [System.Drawing.Brushes]::White, 76, 425)

  # Bullets card
  $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#1e293b"))
  $borderPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#334155"), 3)
  $g.FillRectangle($cardBrush, 80, 565, 840, 470)
  $g.DrawRectangle($borderPen, 80, 565, 840, 470)

  $fBullet = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular)
  $lightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f8fafc"))
  $g.DrawString($p.bullets[0], $fBullet, $lightBrush, 118, 645)
  $g.DrawString($p.bullets[1], $fBullet, $lightBrush, 118, 775)
  $g.DrawString($p.bullets[2], $fBullet, $lightBrush, 118, 905)

  # Gold CTA button
  $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f59e0b"))
  $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#0f172a"))
  $g.FillRectangle($goldBrush, 80, 1125, 840, 118)
  $fCta = New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Bold)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $ctaRect = New-Object System.Drawing.RectangleF(80, 1125, 840, 118)
  $g.DrawString($p.cta, $fCta, $darkBrush, $ctaRect, $sf)

  # Footer brand
  $fFoot = New-Object System.Drawing.Font("Segoe UI", 23, [System.Drawing.FontStyle]::Bold)
  $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#94a3b8"))
  $footRect = New-Object System.Drawing.RectangleF(80, 1340, 840, 60)
  $g.DrawString("$($p.brandName)  $bulletSep  100% Free 2026 Interactive Tool", $fFoot, $mutedBrush, $footRect, $sf)

  $outPath = Join-Path $outDir $p.pngName
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

Write-Output "Rendered $($pins.Count) Pinterest 1000x1500 PNG pins into $outDir"
