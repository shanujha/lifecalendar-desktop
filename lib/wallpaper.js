const WallpaperLib = {
    // Standard wallpaper resolutions
    resolutions: {
        '1080p': { w: 1920, h: 1080 },
        '2k': { w: 2560, h: 1440 },
        '4k': { w: 3840, h: 2160 },
        '8k': { w: 7680, h: 4320 },
        'ultrawide': { w: 3440, h: 1440 }
    },

    /**
     * Parse and return all relevant URL parameters
     */
    getParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const parseIntOrNull = (value) => {
            if (value == null || value === '') {
                return null;
            }
            const parsed = parseInt(value, 10);
            return Number.isNaN(parsed) ? null : parsed;
        };

        return {
            res: urlParams.get('res'),
            w: parseIntOrNull(urlParams.get('w')),
            h: parseIntOrNull(urlParams.get('h')),
            scale: parseFloat(urlParams.get('scale')) || 1.0,
            months: urlParams.get('months') === 'true',
            weeks: urlParams.get('weeks') === 'true',
            download: urlParams.get('download') === 'true'
        };
    },

    /**
     * Applies scaling and resolution settings to the document
     * @param {string} containerSelector - CSS selector for the main grid container
     * @param {Object} options - Configuration for units and base sizes
     */
    setup(containerSelector, options = {}) {
        const params = this.getParams();
        const body = document.body;

        // 1. Determine Target Dimensions
        let targetW = params.w || (this.resolutions[params.res]?.w) || window.innerWidth;
        let targetH = params.h || (this.resolutions[params.res]?.h) || window.innerHeight;

        // Apply explicit dimensions to body for high-res rendering
        if (params.w || params.h || params.res) {
            body.style.width = `${targetW}px`;
            body.style.height = `${targetH}px`;
            body.style.overflow = 'hidden';
            body.style.position = 'relative';
            body.classList.add('resolution-mode');
        }

        // 2. Calculate Scaling
        const hUnits = options.horizontalUnits || 60;
        const vUnits = options.verticalUnits || 35;
        const baseSize = options.baseSize || 12;

        const scaleW = targetW / (hUnits * baseSize);
        const scaleH = targetH / (vUnits * baseSize);

        const bestFitScale = Math.min(scaleW, scaleH);
        const finalScale = bestFitScale * params.scale;

        // 3. Apply CSS Variables
        const dotSize = Math.max(2, Math.floor(baseSize * finalScale));
        const dotGap = Math.max(1, Math.floor((options.baseGap || 5) * finalScale));

        document.documentElement.style.setProperty('--dot-size', `${dotSize}px`);
        document.documentElement.style.setProperty('--dot-gap', `${dotGap}px`);
        document.documentElement.style.setProperty('--header-font', `${(10 * finalScale).toFixed(1)}px`);
        document.documentElement.style.setProperty('--week-font', `${(7 * finalScale).toFixed(1)}px`);

        const statsBaseSize = params.res === '8k' ? 16.2 : 14.4;
        document.documentElement.style.setProperty('--stats-font', `${(statsBaseSize * finalScale).toFixed(1)}px`);

        // 4. Handle Stats visibility
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            statsElement.style.fontSize = `var(--stats-font, ${(statsBaseSize * finalScale).toFixed(1)}px)`;
        }

        // 5. Render UI if not in headless/resolution mode or if ui=true
        if (new URLSearchParams(window.location.search).get('ui') === 'true') {
            this.renderControls();
        }

        return { params, finalScale, targetW, targetH };
    },

    /**
     * Helper to update the stats text
     */
    updateStats(daysPast, totalDays) {
        const daysLeft = totalDays - daysPast;
        const percentCompleted = Math.floor((daysPast / totalDays) * 100);
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            statsElement.innerText = `${daysLeft} days left - ${percentCompleted}% completed`;
        }
    },

    /**
     * Renders a control panel for resolution and scaling
     */
    renderControls() {
        if (document.getElementById('wallpaper-controls')) return;

        const controls = document.createElement('div');
        controls.id = 'wallpaper-controls';
        controls.innerHTML = `
            <div class="control-group">
                <label>Resolution</label>
                <select id="res-picker">
                    <option value="">Viewport</option>
                    ${Object.keys(this.resolutions).map(r => `<option value="${r}">${r.toUpperCase()}</option>`).join('')}
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div id="custom-res" style="display:none">
                <input type="number" id="custom-w" placeholder="W" style="width:60px">
                <input type="number" id="custom-h" placeholder="H" style="width:60px">
            </div>
            <div class="control-group">
                <label>Scale: <span id="scale-val">1.0</span></label>
                <input type="range" id="scale-slider" min="0.1" max="3" step="0.1" value="1.0">
            </div>
            <div class="control-buttons">
                <button id="apply-btn">Apply</button>
                <button id="download-btn">Download</button>
            </div>
            <style>
                #wallpaper-controls {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    font-family: sans-serif;
                    font-size: 12px;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .control-group { display: flex; flex-direction: column; gap: 5px; }
                .control-buttons { display: flex; gap: 5px; margin-top: 5px; }
                button { background: #ff4757; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
                input, select { background: #222; border: 1px solid #444; color: white; padding: 3px; border-radius: 4px; }
            </style>
        `;

        document.body.appendChild(controls);

        const params = this.getParams();
        const resPicker = document.getElementById('res-picker');
        const customRes = document.getElementById('custom-res');
        const scaleSlider = document.getElementById('scale-slider');
        const scaleVal = document.getElementById('scale-val');

        if (params.res) resPicker.value = params.res;
        if (params.scale) {
            scaleSlider.value = params.scale;
            scaleVal.innerText = params.scale.toFixed(1);
        }

        resPicker.onchange = () => {
            customRes.style.display = resPicker.value === 'custom' ? 'flex' : 'none';
        };

        scaleSlider.oninput = () => {
            scaleVal.innerText = parseFloat(scaleSlider.value).toFixed(1);
        };

        document.getElementById('apply-btn').onclick = () => {
            const res = resPicker.value;
            const scale = scaleSlider.value;
            const url = new URL(window.location.href);
            if (res && res !== 'custom') {
                url.searchParams.set('res', res);
                url.searchParams.delete('w');
                url.searchParams.delete('h');
            } else if (res === 'custom') {
                const customWRaw = document.getElementById('custom-w').value.trim();
                const customHRaw = document.getElementById('custom-h').value.trim();
                const customW = parseInt(customWRaw, 10);
                const customH = parseInt(customHRaw, 10);
                if (
                    !customWRaw ||
                    !customHRaw ||
                    !Number.isInteger(customW) ||
                    !Number.isInteger(customH) ||
                    customW <= 0 ||
                    customH <= 0
                ) {
                    alert('Please enter valid positive integers for custom width and height.');
                    return;
                }
                url.searchParams.delete('res');
                url.searchParams.set('w', String(customW));
                url.searchParams.set('h', String(customH));
            } else {
                url.searchParams.delete('res');
                url.searchParams.delete('w');
                url.searchParams.delete('h');
            }
            url.searchParams.set('scale', scale);
            url.searchParams.set('ui', 'true');
            window.location.href = url.href;
        };

        document.getElementById('download-btn').onclick = () => this.download();
    },

    download() {
        alert('Downloading high-res wallpaper. Please use the PowerShell script for best results, or right-click > Save Image As if in headless mode.');
        // In a real browser, we'd use html2canvas if we wanted a single click, 
        // but for now, we point them to the script or manual save.
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WallpaperLib;
}
