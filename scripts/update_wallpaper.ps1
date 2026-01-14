param (
    [string]$res = "4k",
    [string]$scale = "1.0",
    [string]$months = "false",
    [string]$weeks = "false",
    [string]$targetFolder = "$PSScriptRoot\..\assets",
    [string]$fileName = "life.png"
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
# We use the live URL or local file path
$url = "https://shanujha.github.io/lifecalendar-desktop/?res=$res&scale=$scale&months=$months&weeks=$weeks"

Write-Host "Rendering $res wallpaper to $targetPath..." -ForegroundColor Cyan

# 3. Capture screenshot
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

# 5. Set Lock Screen (requires WinRT API access)
Write-Host "Setting Lock Screen..." -ForegroundColor Cyan
try {
    $AsyncInfo = [Windows.System.UserProfile.LockScreen, Windows.System.UserProfile, ContentType = WindowsRuntime]
    $file = Get-Item $targetPath
    [Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName).AsTask().ContinueWith({
        param($task)
        [Windows.System.UserProfile.LockScreen]::SetImageFileAsync($task.Result).AsTask().Wait()
    }).Wait()
} catch {
    Write-Warning "Could not set Lock Screen. This typically happens if the script isn't running in a supported UWP/WinRT context."
}

Write-Host "Operation Complete! $res wallpaper applied." -ForegroundColor Green
