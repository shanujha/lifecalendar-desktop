# Life Calendar 

> 💡 Inspired by [thelifecalendar.com](https://thelifecalendar.com). They covered the mobile devices, i wanted on PC as well - so here we go!


### 8k with Default Scaling
![8k](assets/8k.png)

### 8k with 2.5 scaling
![8k_2.5](assets/8k2.png)

### 8k with 2.0 scaling and months and weeks
![8k_2.0_w_m](assets/8k_weeks_months.png)

A high-resolution calendar generation engine that renders your year as a minimalist grid. Designed primarily for desktop wallpapers, it supports resolutions up to 8K with automated scaling and export.

## Configuration Parameters

The application is controlled via URL query parameters. Append these to the url to customize the output.

### Display Options
By default, the interface shows only the dot grid.
- `months=true`: Displays month headings.
- `weeks=true`: Displays weekday labels (S M T W T F S).

### Resolution and Scaling
- `res`: Standard resolution presets (`1080p`, `4k`, `8k`).
- `w`: Custom width in pixels.
- `h`: Custom height in pixels.
- `scale`: Manual scaling multiplier for dots and typography. Default is 1.0 (relative to resolution).

### Download Options
- `d=true`: Triggers an automatic download of the rendered image one second after page load.

## Usage Examples

- **Standard 4K**: `index.html?res=4k`
- **Minimalist 8K**: `index.html?res=8k`
- **Complete Labels (4K)**: `index.html?res=4k&months=true&weeks=true`
- **Auto-Download 4K**: `index.html?res=4k&d=true`


## Contributing

Contributions are welcome to improve the rendering engine or add new design features.
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a detailed description of changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
