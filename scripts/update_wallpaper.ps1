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
$url = "https://shanujha.github.io/lifecalendar-desktop/?res=$res&scale=$scale&months=$months&weeks=$weeks"

Write-Host "Rendering wallpaper to $targetPath..." -ForegroundColor Cyan

# 3. Capture screenshot
$chromeArgs = @(
    "--headless",
    "--disable-gpu",
    "--screenshot=$targetPath",
    "--window-size=$windowSize",
    "--default-background-color=00000000",
    "--hide-scrollbars",
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
    # Ensure Windows.System.UserProfile is available
    $AsyncInfo = [Windows.System.UserProfile.LockScreen, Windows.System.UserProfile, ContentType = WindowsRuntime]
    $file = Get-Item $targetPath
    # Convert to StorageFile
    [Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName).AsTask().ContinueWith({
        param($task)
        [Windows.System.UserProfile.LockScreen]::SetImageFileAsync($task.Result).AsTask().Wait()
    }).Wait()
} catch {
    Write-Warning "Could not set Lock Screen. This typically happens if the script isn't running in a supported UWP/WinRT context or version of Windows."
}

Write-Host "Operation Complete! Wallpaper updated." -ForegroundColor Green
