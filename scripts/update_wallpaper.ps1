param (
    [string]$res = "4k",
    [string]$scale = "1.0",
    [string]$months = "false",
    [string]$weeks = "false",
    [string]$targetFolder = "$PSScriptRoot\..\assets",
    [string]$fileName = "life.png",
    [switch]$local,
    [switch]$core
)

# 1. Setup paths and check for Chrome/Edge
$targetPath = Join-Path $targetFolder $fileName
if (-not (Test-Path $targetFolder)) { New-Item -ItemType Directory -Path $targetFolder }

$chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
}
if (-not (Test-Path $chromePath)) {
    $chromePath = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
}

if (-not (Test-Path $chromePath)) {
    Write-Error "Could not find Google Chrome or Microsoft Edge."
    exit 1
}

# 2. Map resolution to window size
$resolutions = @{
    "1080p" = "1920,1080"
    "4k"    = "3840,2160"
    "8k"    = "7680,4320"
}

$windowSize = if ($resolutions.ContainsKey($res)) { $resolutions[$res] } else { $res }

# 3. Determine Base URL and Path
$baseUrl = if ($local) { "http://127.0.0.1:5500" } else { "https://shanujha.github.io/lifecalendar-desktop" }
$path = if ($core) { "/core/" } else { "/" }

$url = "${baseUrl}${path}?res=${res}&scale=${scale}&months=${months}&weeks=${weeks}"
Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host "Rendering $res wallpaper to $targetPath..." -ForegroundColor Cyan

# 4. Capture screenshot
# We force scale factor 1 to ensure 1:1 pixel mapping (no OS scaling interference)
$chromeArgs = @(
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--force-device-scale-factor=1",
    "--screenshot=$targetPath",
    "--window-size=$windowSize",
    "--default-background-color=00000000",
    "--hide-scrollbars",
    "--virtual-time-budget=10000",
    "--run-all-compositor-stages-before-draw",
    "$url"
)

Start-Process -FilePath $chromePath -ArgumentList $chromeArgs -Wait

if (-not (Test-Path $targetPath)) {
    Write-Error "Failed to capture screenshot."
    exit 1
}

# 4. Set Desktop Wallpaper
Write-Host "Setting Desktop Background..." -ForegroundColor Cyan
$code = @'
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
'@
Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue
[Wallpaper]::SystemParametersInfo(20, 0, $targetPath, 3) | Out-Null

Write-Host "Operation Complete! $res wallpaper applied." -ForegroundColor Green
