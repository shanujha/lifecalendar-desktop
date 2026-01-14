const grid = document.querySelector('.grid');
const today = new Date();

function dotter() {
    const urlParams = new URLSearchParams(window.location.search);
    const showMonths = urlParams.get('months') === 'true';
    const showWeeks = urlParams.get('weeks') === 'true';

    // Resolution shortcuts
    const resShortcuts = {
        '4k': { w: 3840, h: 2160 },
        '8k': { w: 7680, h: 4320 },
        '1080p': { w: 1920, h: 1080 }
    };

    const resParam = urlParams.get('res');
    let targetW = parseInt(urlParams.get('w')) || (resShortcuts[resParam]?.w) || window.innerWidth;
    let targetH = parseInt(urlParams.get('h')) || (resShortcuts[resParam]?.h) || window.innerHeight;

    // Calculate "Best Fit" Scale
    // A month grid is roughly 7 dots wide and 6-9 "units" high (including header/weeks)
    // We add buffer for gaps between months.
    const horizontalUnits = (4 * 7) + 8; // 4 months + gaps/margins
    const verticalUnits = (3 * 10) + 6;  // 3 months + headers/gaps/margins

    const scaleW = targetW / (horizontalUnits * 12);
    const scaleH = targetH / (verticalUnits * 12);

    // Default to the smaller scale to ensure it fits the screen
    const bestFitScale = Math.min(scaleW, scaleH);
    const manualScale = parseFloat(urlParams.get('scale')) || 1.0;
    const finalScale = bestFitScale * manualScale;

    // Apply dynamic scaling to CSS variables
    grid.style.setProperty('--dot-size', `${Math.max(2, Math.floor(12 * finalScale))}px`);
    grid.style.setProperty('--dot-gap', `${Math.max(1, Math.floor(5 * finalScale))}px`);
    grid.style.setProperty('--header-font', `${(10 * finalScale).toFixed(1)}px`);
    grid.style.setProperty('--week-font', `${(7 * finalScale).toFixed(1)}px`);
    const statsBaseSize = resParam === '8k' ? 16.2 : 14.4; // 12 * 1.35 for 8k, 12 * 1.20 for others
    grid.style.setProperty('--stats-font', `${(statsBaseSize * finalScale).toFixed(1)}px`);

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

    // Update Stats
    const totalDays = Math.round((new Date(currentYear + 1, 0, 1) - new Date(currentYear, 0, 1)) / (1000 * 60 * 60 * 24));
    const daysPassed = dayOfYear + 1;
    const daysLeft = totalDays - daysPassed;
    const percentCompleted = Math.floor((daysPassed / totalDays) * 100);

    const statsElement = document.getElementById('stats');
    if (statsElement) {
        statsElement.innerText = `${daysLeft} days left - ${percentCompleted}% completed`;
    }
}

dotter();
