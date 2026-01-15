param (
    [string]$res = "4k",
    [string]$scale = "1.0",
    [string]$months = "false",
    [string]$weeks = "false",
    [string]$targetFolder = "$PSScriptRoot\..\assets",
    [string]$fileName = "life.png"
)

# 1. Setup paths
$targetPath = Join-Path $targetFolder $fileName
if (-not (Test-Path $targetFolder)) {
    New-Item -ItemType Directory -Path $targetFolder | Out-Null
}

# 2. Locate Chrome / Edge
$chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
}
if (-not (Test-Path $chromePath)) {
    $chromePath = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path $chromePath)) {
    Write-Error "Chrome or Edge not found."
    exit 1
}

# 3. Resolution mapping
$resolutions = @{
    "1080p" = "1920,1080"
    "4k"    = "3840,2160"
    "8k"    = "7680,4320"
}
$windowSize = if ($resolutions.ContainsKey($res)) { $resolutions[$res] } else { $res }

$url = "https://shanujha.github.io/lifecalendar-desktop/?res=$res&scale=$scale&months=$months&weeks=$weeks"

Write-Host "Rendering wallpaper..." -ForegroundColor Cyan

# 4. Capture screenshot
$chromeArgs = @(
    "--headless"
    "--disable-gpu"
    "--no-sandbox"
    "--force-device-scale-factor=1"
    "--screenshot=$targetPath"
    "--window-size=$windowSize"
    "--default-background-color=00000000"
    "--hide-scrollbars"
    "--virtual-time-budget=10000"
    "--run-all-compositor-stages-before-draw"
    $url
)

Start-Process -FilePath $chromePath -ArgumentList $chromeArgs -Wait

if (-not (Test-Path $targetPath)) {
    Write-Error "Screenshot capture failed."
    exit 1
}

# 5. Set Desktop Wallpaper (Win32)
Write-Host "Setting Desktop Wallpaper..." -ForegroundColor Cyan

Add-Type @"
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@ -ErrorAction SilentlyContinue

[Wallpaper]::SystemParametersInfo(20, 0, $targetPath, 3) | Out-Null

Write-Host "Done." -ForegroundColor Green
