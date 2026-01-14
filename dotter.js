const grid = document.querySelector('.grid');
const downloadBtn = document.getElementById('download-btn');
const resIndicator = document.getElementById('res-indicator');

function dotter() {
    const urlParams = new URLSearchParams(window.location.search);
    const showMonths = urlParams.get('months') !== 'false';
    const showWeeks = urlParams.get('weeks') !== 'false';

    // Resolution shortcuts
    const resShortcuts = {
        '4k': { w: 3840, h: 2160 },
        '8k': { w: 7680, h: 4320 },
        '1080p': { w: 1920, h: 1080 }
    };

    const resParam = urlParams.get('res');
    let targetW = parseInt(urlParams.get('w')) || (resShortcuts[resParam]?.w) || window.innerWidth;
    let targetH = parseInt(urlParams.get('h')) || (resShortcuts[resParam]?.h) || window.innerHeight;

    // Calculate base scaling factor (1920px as reference)
    const baseScale = targetW / 1920;
    // Add manual scale override (default to 1.0)
    const manualScale = parseFloat(urlParams.get('scale')) || 1.0;
    const finalScale = baseScale * manualScale;

    // Apply dynamic scaling to CSS variables
    grid.style.setProperty('--dot-size', `${Math.round(12 * finalScale)}px`);
    grid.style.setProperty('--dot-gap', `${Math.round(5 * finalScale)}px`);
    grid.style.setProperty('--header-font', `${Math.round(10 * finalScale)}px`);
    grid.style.setProperty('--week-font', `${Math.round(7 * finalScale)}px`);
    grid.style.setProperty('--month-gap', `${Math.round(3 * finalScale)}vh`);
    grid.style.setProperty('--month-padding', `${Math.round(5 * finalScale)}vh`);

    if (urlParams.has('w') || urlParams.has('h') || urlParams.has('res') || urlParams.has('scale')) {
        grid.style.width = `${targetW}px`;
        grid.style.height = `${targetH}px`;
        grid.classList.add('rendering');
        resIndicator.innerText = `${targetW} x ${targetH} (${Math.round(finalScale * 100)}% absolute scale)`;
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    let dayOfYearCounter = 0;
    const startOfYear = new Date(currentYear, 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay) - 1;

    for (let m = 0; m < 12; m++) {
        const monthContainer = document.createElement('div');
        monthContainer.classList.add('month-container');

        if (showMonths) {
            const monthHeader = document.createElement('div');
            monthHeader.classList.add('month-header');

            const monthName = document.createElement('div');
            monthName.classList.add('month-name');
            monthName.innerText = monthNames[m];
            monthHeader.appendChild(monthName);
            monthContainer.appendChild(monthHeader);
        }

        const monthGrid = document.createElement('div');
        monthGrid.classList.add('month-grid');

        if (showWeeks) {
            weekDays.forEach(day => {
                const dayLabel = document.createElement('div');
                dayLabel.classList.add('weekday-label');
                dayLabel.innerText = day;
                monthGrid.appendChild(dayLabel);
            });
        }

        const firstDay = new Date(currentYear, m, 1).getDay();
        for (let p = 0; p < firstDay; p++) {
            const spacer = document.createElement('div');
            spacer.classList.add('dot-spacer');
            monthGrid.appendChild(spacer);
        }

        const daysInMonth = new Date(currentYear, m + 1, 0).getDate();

        for (let d = 0; d < daysInMonth; d++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');

            if (dayOfYearCounter < dayOfYear) {
                dot.classList.add('past');
            } else if (dayOfYearCounter === dayOfYear) {
                dot.classList.add('present');
            } else {
                dot.classList.add('future');
            }

            monthGrid.appendChild(dot);
            dayOfYearCounter++;
        }

        monthContainer.appendChild(monthGrid);
        grid.appendChild(monthContainer);
    }
}

async function captureWallpaper() {
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = 'Capturing...';
    downloadBtn.disabled = true;

    try {
        const canvas = await html2canvas(grid, {
            backgroundColor: '#0d0d0d',
            scale: 1, // Element is already sized correctly
            useCORS: true,
            logging: false
        });

        const link = document.createElement('a');
        link.download = `life-calendar-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Wallpaper capture failed:', err);
        alert('Failed to generate image. Browser memory limits might affect 8K renders.');
    } finally {
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    }
}

downloadBtn.addEventListener('click', captureWallpaper);
dotter();
