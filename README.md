# Life Calendar 

> 💡 Inspired by [thelifecalendar.com](https://thelifecalendar.com). They covered the mobile devices, i wanted on PC as well - so here we go!

## Contents
- [Overview](#overview)
- [Usage](#usage)
- [Quick Start Examples](#quick-start-examples)
- [Configuration Parameter Reference](#configuration-parameter-reference)
- [Contributing](#contributing)
- [License](#license)

## Overview
### 8k with Default Scaling
![8k](assets/8k.png)

### 8k with 2.5 scaling
![8k_2.5](assets/8k2.png)

### 8k with 2.0 scaling and months and weeks
![8k_2.0_w_m](assets/8k_weeks_months.png)

A high-resolution calendar generation engine that renders your year as a minimalist grid. Designed primarily for desktop wallpapers, it supports resolutions up to 8K with automated scaling and export.



## Usage

The application is hosted at [shanujha.github.io/lifecalendar-desktop/](https://shanujha.github.io/lifecalendar-desktop/). You can use it directly in your browser or through the URL parameters for custom wallpaper generation.

## Configuration Parameters

The application is controlled via URL query parameters. Append these to the base URL to customize the output.

### Display Options
By default, the interface shows only the dot grid.
- `months=true`: Displays month headings.
- `weeks=true`: Displays weekday labels (S M T W T F S).

### Resolution and Scaling
- `res`: Standard resolution presets (`1080p`, `4k`, `8k`).
- `w`: Custom width in pixels.
- `h`: Custom height in pixels.
- `scale`: Manual scaling multiplier for dots and typography. Default is 1.0 (relative to resolution).

## Quick Start Examples

Direct links to common configurations:

### Standard Desktop Wallpapers
- **4K Ultra HD (Minimalist)**: [?res=4k](https://shanujha.github.io/lifecalendar-desktop/?res=4k)
- **4K Ultra HD (Detailed)**: [?res=4k&months=true&weeks=true](https://shanujha.github.io/lifecalendar-desktop/?res=4k&months=true&weeks=true)
- **8K Super Retina (Minimalist)**: [?res=8k](https://shanujha.github.io/lifecalendar-desktop/?res=8k)
- **8K Super Retina (Jumbo Dots)**: [?res=8k&scale=1.5](https://shanujha.github.io/lifecalendar-desktop/?res=8k&scale=1.5)

### Custom & Ultra-Wide Screens
- **MacBook Pro 14"**: [?w=3024&h=1964&scale=1.2](https://shanujha.github.io/lifecalendar-desktop/?w=3024&h=1964&scale=1.2)
- **Ultra-Wide (21:9)**: [?w=3440&h=1440&scale=1.3](https://shanujha.github.io/lifecalendar-desktop/?w=3440&h=1440&scale=1.3)
- **Super Ultra-Wide (32:9)**: [?w=5120&h=1440&scale=1.5](https://shanujha.github.io/lifecalendar-desktop/?w=5120&h=1440&scale=1.5)

### One-Click Auto Download
Append `&d=true` to any URL to trigger an automatic render and download.
- **Auto-Render 4K Minimalist**: [?res=4k&d=true](https://shanujha.github.io/lifecalendar-desktop/?res=4k&d=true)
- **Auto-Render 8K Detailed**: [?res=8k&months=true&weeks=true&d=true](https://shanujha.github.io/lifecalendar-desktop/?res=8k&months=true&weeks=true&d=true)

---

## Configuration Parameter Reference

Append these to the base URL `https://shanujha.github.io/lifecalendar-desktop/` to customize your render.

### Display Toggles
- `months=true`: Show month names (default: hidden).
- `weeks=true`: Show weekday initials (default: hidden).

### Resolution Presets
- `res=1080p`: 1920 x 1080
- `res=4k`: 3840 x 2160
- `res=8k`: 7680 x 4320

### Custom Sizes
- `w=[pixels]`: Custom width (e.g., `w=2560`).
- `h=[pixels]`: Custom height (e.g., `h=1440`).
- `scale=[multiplier]`: Adjust dot size relative to resolution (e.g., `scale=1.5`).

### Download Automation
- `d=true`: Automatically trigger image download 1 second after load.


## Contributing

Contributions are welcome to improve the rendering engine or add new design features.
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a detailed description of changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
