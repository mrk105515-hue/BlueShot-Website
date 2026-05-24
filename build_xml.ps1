$html = Get-Content -Raw -Encoding utf8 "F:\BlueShot Website\index.html"
$css = Get-Content -Raw -Encoding utf8 "F:\BlueShot Website\styles.css"
$js = Get-Content -Raw -Encoding utf8 "F:\BlueShot Website\script.js"

# Extract body content from HTML
$bodyStart = $html.IndexOf("<body>") + 6
$bodyEnd = $html.IndexOf("</body>")

if ($bodyStart -lt 6 -or $bodyEnd -lt 0) {
    Write-Error "Could not find body tags in index.html"
    Exit 1
}

$body = $html.Substring($bodyStart, $bodyEnd - $bodyStart).Trim()
$body = $body.Replace('<script src="script.js"></script>', "")

# Replace local asset paths with Netlify absolute paths for Odoo integration
$body = $body -replace 'assets/', 'https://blueshotwiki.netlify.app/assets/'
$js = $js -replace 'assets/', 'https://blueshotwiki.netlify.app/assets/'

# Define single-quoted here-strings to prevent PowerShell variable expansion of $ pageName or JS symbols
$xmlStart = @'
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <template id="blueshot_custom_homepage" name="BlueShot Home" inherit_id="website.homepage" active="True" customize_show="True">
        <xpath expr="//t[@t-call='website.layout']" position="replace">
            <t t-call="web.layout">
                <t t-set="pageName" t-value="'homepage'"/>
                <t t-set="html_meta">
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>The BlueShot | Danger X Zone Anime Series</title>
                    <meta name="description" content="Official website for The BlueShot YouTube channel. Creator of the epic Minecraft-inspired anime series Danger X Zone. Join the lore, watch episodes, and meet the characters in the new Season 3 art style."/>
                    <meta name="keywords" content="The BlueShot, Danger X Zone, DXZ, Neeraj Saklani, Minecraft Anime, Season 3, Flame Devil, Redago, Indian Animation, DXZ Wiki"/>
                    <link rel="icon" type="image/x-icon" href="https://blueshotgamerz.blogspot.com/favicon.ico"/>
                </t>
                
                <t t-set="head">
                    <!-- Google Fonts & FontAwesome Icons -->
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
                    
                    <!-- Embedded custom template styles -->
                    <style type="text/css">
'@

$xmlStylesEnd = @'
                    </style>
                </t>
                
                <!-- Main HTML Content -->
'@

$xmlBodyEnd = @'
                
                <!-- Embedded custom template scripts -->
                <script type="text/javascript">
'@

$xmlEnd = @'
                </script>
            </t>
        </xpath>
    </template>
</odoo>
'@

# Combine all parts and save to homepage.xml
$finalXml = $xmlStart + "`n" + $css + "`n" + $xmlStylesEnd + "`n" + $body + "`n" + $xmlBodyEnd + "`n" + $js + "`n" + $xmlEnd
Set-Content -Path "F:\BlueShot Website\homepage.xml" -Value $finalXml -Encoding utf8

# Generate a single self-contained file for Odoo's frontend HTML editor
$frontendPaste = "<style>`n" + $css + "`n</style>`n`n" + $body + "`n`n<script>`n" + $js + "`n</script>"
Set-Content -Path "F:\BlueShot Website\odoo_frontend_paste.html" -Value $frontendPaste -Encoding utf8

Write-Host "Successfully generated F:\BlueShot Website\homepage.xml and F:\BlueShot Website\odoo_frontend_paste.html!"
