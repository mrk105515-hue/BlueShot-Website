# ================================================================
# DXZ Odoo 19 Full Deployment Script (PowerShell)
# Connects to Odoo, uploads all assets, updates the homepage view
# ================================================================

param(
    [string]$Password = "",
    [string]$ApiKey   = ""
)

$URL   = "https://blueshotwiki2.odoo.com"
$DB    = "blueshotwiki2"
$EMAIL = "Neerajsaklani89@gmail.com"
$CRED  = if ($ApiKey) { $ApiKey } else { $Password }
$ASSETS_DIR = "F:\BlueShot Website\assets"
$XML_FILE   = "F:\BlueShot Website\homepage.xml"

if (-not $CRED) {
    Write-Host "❌ Usage: .\deploy_odoo.ps1 -Password 'yourpassword'" -ForegroundColor Red
    Write-Host "   OR   : .\deploy_odoo.ps1 -ApiKey 'your-api-key'" -ForegroundColor Red
    exit 1
}

# ── Step 1: Authenticate ──────────────────────────────────────
Write-Host "`n🔐 Authenticating with Odoo..." -ForegroundColor Cyan
$authBody = @{
    jsonrpc = "2.0"; method = "call"; id = 1
    params  = @{ db = $DB; login = $EMAIL; password = $CRED }
} | ConvertTo-Json -Depth 5

$sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$r = Invoke-RestMethod -Uri "$URL/web/session/authenticate" `
    -Method Post -ContentType "application/json" `
    -Body $authBody -WebSession $sess -TimeoutSec 30

$uid = $r.result.uid
if (-not $uid) {
    Write-Host "❌ Authentication failed. Check your password/API key." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in! User ID = $uid" -ForegroundColor Green

# ── Step 2: Upload Assets to Odoo File Store ─────────────────
Write-Host "`n📁 Uploading image assets..." -ForegroundColor Cyan

$images = @(
    @{ file="ep1-explanation.jpg"; name="EP1 Explanation - BSG Poster" },
    @{ file="ep1-recap.png";       name="EP1 Recap - EP18 Scene" },
    @{ file="ep1-characters.png";  name="Characters Introduction" },
    @{ file="merch-1.png";         name="DXZ Merch Phone Mockup 1" },
    @{ file="merch-2.png";         name="DXZ Merch Phone Mockup 2" },
    @{ file="char-bsg.png";        name="Character BSG" },
    @{ file="char-zalta.png";      name="Character Zalta" },
    @{ file="char-eysa.png";       name="Character Eysa" },
    @{ file="char-hell.png";       name="Character Hell" },
    @{ file="char-jiggo.png";      name="Character Jiggo" },
    @{ file="char-kan.png";        name="Character Kan" },
    @{ file="char-suma.png";       name="Character Suma" },
    @{ file="char-berry.png";      name="Character Berry" },
    @{ file="char-blackdagger.png";name="Character Black Dagger" },
    @{ file="dxz-poster.jpg";      name="DXZ Season 3 Poster" },
    @{ file="video-thumbnail.jpg"; name="DXZ Video Thumbnail" }
)

$uploadedUrls = @{}

foreach ($img in $images) {
    $path = Join-Path $ASSETS_DIR $img.file
    if (-not (Test-Path $path)) {
        Write-Host "  ⚠️  Skipping $($img.file) — file not found" -ForegroundColor Yellow
        continue
    }

    $bytes    = [System.IO.File]::ReadAllBytes($path)
    $b64      = [Convert]::ToBase64String($bytes)
    $ext      = [System.IO.Path]::GetExtension($img.file).TrimStart(".").ToLower()
    $mimetype = if ($ext -eq "jpg" -or $ext -eq "jpeg") { "image/jpeg" } else { "image/png" }

    $uploadBody = @{
        jsonrpc = "2.0"; method = "call"; id = 1
        params = @{
            model  = "ir.attachment"
            method = "create"
            args   = @(@{
                name     = $img.name
                datas    = $b64
                mimetype = $mimetype
                public   = $true
                res_model = "ir.ui.view"
            })
            kwargs = @{}
        }
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $resp = Invoke-RestMethod -Uri "$URL/web/dataset/call_kw" `
            -Method Post -ContentType "application/json" `
            -Body $uploadBody -WebSession $sess -TimeoutSec 60
        $attachId = $resp.result
        if ($attachId) {
            $imgUrl = "/web/image/$attachId"
            $uploadedUrls[$img.file] = $imgUrl
            Write-Host "  ✅ $($img.file) → $imgUrl" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Failed: $($img.file)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ Error uploading $($img.file): $_" -ForegroundColor Red
    }
}

# ── Step 3: Find the homepage view ───────────────────────────
Write-Host "`n🔍 Finding homepage view in Odoo..." -ForegroundColor Cyan

$searchBody = @{
    jsonrpc = "2.0"; method = "call"; id = 2
    params = @{
        model  = "ir.ui.view"
        method = "search_read"
        args   = @(@( @("key","=","website.homepage") ))
        kwargs = @{ fields = @("id","name","key","arch_db"); limit = 1 }
    }
} | ConvertTo-Json -Depth 10 -Compress

$views = Invoke-RestMethod -Uri "$URL/web/dataset/call_kw" `
    -Method Post -ContentType "application/json" `
    -Body $searchBody -WebSession $sess -TimeoutSec 30

if (-not $views.result -or $views.result.Count -eq 0) {
    Write-Host "⚠️  website.homepage not found — searching by name..." -ForegroundColor Yellow
    $searchBody2 = @{
        jsonrpc = "2.0"; method = "call"; id = 3
        params = @{
            model  = "ir.ui.view"
            method = "search_read"
            args   = @(@( @("name","ilike","homepage") ))
            kwargs = @{ fields = @("id","name","key"); limit = 10 }
        }
    } | ConvertTo-Json -Depth 10 -Compress
    $views2 = Invoke-RestMethod -Uri "$URL/web/dataset/call_kw" `
        -Method Post -ContentType "application/json" `
        -Body $searchBody2 -WebSession $sess -TimeoutSec 30
    Write-Host ($views2.result | ConvertTo-Json)
    exit 0
}

$viewId   = $views.result[0].id
$viewName = $views.result[0].name
Write-Host "✅ Found: '$viewName' (ID=$viewId)" -ForegroundColor Green

# ── Step 4: Read & patch homepage.xml ────────────────────────
Write-Host "`n📝 Reading homepage.xml template..." -ForegroundColor Cyan
$xmlContent = Get-Content $XML_FILE -Raw -Encoding UTF8

# Replace local asset paths with Odoo uploaded URLs
foreach ($key in $uploadedUrls.Keys) {
    $odooUrl = $uploadedUrls[$key]
    $xmlContent = $xmlContent -replace [regex]::Escape("assets/$key"), $odooUrl
    Write-Host "  Replaced: assets/$key → $odooUrl"
}

# Extract the arch_db content (the <t t-name="website.homepage"> block)
$archMatch = [regex]::Match($xmlContent, '(?s)<t[^>]*t-name="website\.homepage"[^>]*>(.*?)</t>\s*$')
if (-not $archMatch.Success) {
    # Try extracting the full content between outer template tags
    $archMatch = [regex]::Match($xmlContent, '(?s)(<t\s+name="Homepage"[^>]*>.*</t>)')
}

if ($archMatch.Success) {
    $archContent = $archMatch.Value
    Write-Host "✅ Extracted arch_db content ($($archContent.Length) chars)" -ForegroundColor Green
} else {
    $archContent = $xmlContent
    Write-Host "⚠️  Using full XML as arch_db" -ForegroundColor Yellow
}

# ── Step 5: Write homepage view to Odoo ──────────────────────
Write-Host "`n🚀 Updating homepage view in Odoo..." -ForegroundColor Cyan

$writeBody = @{
    jsonrpc = "2.0"; method = "call"; id = 4
    params = @{
        model  = "ir.ui.view"
        method = "write"
        args   = @(@($viewId), @{ arch_db = $archContent })
        kwargs = @{}
    }
} | ConvertTo-Json -Depth 10 -Compress

$writeResp = Invoke-RestMethod -Uri "$URL/web/dataset/call_kw" `
    -Method Post -ContentType "application/json" `
    -Body $writeBody -WebSession $sess -TimeoutSec 60

if ($writeResp.result -eq $true) {
    Write-Host "✅ Homepage updated successfully!" -ForegroundColor Green
    Write-Host "`n🌐 Visit: $URL" -ForegroundColor Cyan
} else {
    Write-Host "❌ Write failed:" -ForegroundColor Red
    Write-Host ($writeResp | ConvertTo-Json -Depth 5)
}

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
