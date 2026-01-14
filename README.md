# Life Calendar 

> 💡 Inspired by [thelifecalendar.com](https://thelifecalendar.com). They covered mobile devices, I wanted it on PC as well — so here we go!

## How to Use

<video src="assets/how_to.webm" controls="controls" style="max-width: 100%; height: auto; display: block;"></video>

## Contents
- [Overview](#overview)
- [Usage](#usage)
- [Configuration Parameters](#configuration-parameters)
- [Automation (Desktop Integration)](#automation-desktop-integration)
- [Contributing](#contributing)
- [License](#license)

## Overview

A high-resolution calendar generation engine that renders your year as a minimalist grid. Designed primarily for desktop wallpapers, it supports resolutions up to 8K with automated scaling and system integration.

### 8K Render Examples
| Default Fit (Scale 1.0) | Jumbo Dots (Scale 2.0) | With Labels |
| :--- | :--- | :--- |
| ![8k](assets/8k.png) | ![8k_2.5](assets/8k2.png) | ![8k_2.0_w_m](assets/8k_weeks_months.png) |

## Usage

### For Windows Users

Download the script in the `scripts` folder and save it where you want. I have saved it in `C:\tools\lifecaldesktop\lifecal.ps1`.

If you have **Windows PowerShell**, run it with:
```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\tools\lifecaldesktop\lifecal.ps1"
```

Else if you have **PowerShell 7**, run:
```powershell
pwsh -c lifecal.ps1
```
in the folder.

I try to keep this folder in path and therefore to automate it I only need to run `pwsh -c lifecal.ps1` from the **Run** window. This way you can automate this small command from anywhere.

Remember to read up on the [Execution Policy settings](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies).

---

The application is hosted at [shanujha.github.io/lifecalendar-desktop/](https://shanujha.github.io/lifecalendar-desktop/). 

You can use the site directly to generate a layout, but for the best experience (especially for 4K/8K wallpapers), use the **URL Parameters** or the **Automation Scripts** provided below.

## Configuration Parameters

The engine is controlled via URL query parameters. Append these to the base URL to customize the output.

### Display Options
By default, the interface is a minimalist dot grid.
- `months=true`: Displays month names.
- `weeks=true`: Displays weekday labels (S M T W T F S).

### Resolution and Scaling
The engine uses a **Best-Fit Algorithm** that automatically calculates the optimal dot size for your resolution.
- `res`: Standard presets: `1080p`, `4k`, `8k`.
- `w` / `h`: Custom width and height in pixels.
- `scale`: Manual multiplier for the "Best-Fit" calculation.
  - `1.0` (Default): Perfectly fills the screen edge-to-edge.
  - `0.8`: Adds a comfortable margin around the grid.
  - `1.2`: Enthusiastic bloom; dots become larger and may overflow the screen edges.

## Automation (Desktop Integration)

For a seamless experience, we provide scripts to render and set your wallpaper in one command.

### Windows (PowerShell)
The `scripts/update_wallpaper.ps1` script launches a headless browser, renders the calendar at your desired resolution, saves it to your `assets/` folder, and sets it as both your **Desktop Background** and **Lock Screen**.

**Usage:**
```powershell
# Set a clean 4K wallpaper
.\scripts\update_wallpaper.ps1 -res 4k

# Set a Detailed 8K wallpaper with jumbo dots
.\scripts\update_wallpaper.ps1 -res 8k -months true -weeks true -scale 1.5
```

**Parameters:**
- `-res`: Preset (`1080p`, `4k`, `8k`) or custom `width,height`.
- `-scale`: Relative scale multiplier (default: `1.0`).
- `-months`: `true` / `false`.
- `-weeks`: `true` / `false`.

### Other Platforms
Contributions for macOS (AppleScript), Linux (feh/gsettings), and AutoHotkey are welcome!

---

## Contributing

Contributions are welcome to improve the rendering engine or add new scripts.
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
