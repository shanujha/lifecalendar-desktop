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

    // Calculate base scaling factor (1920px as reference)
    const baseScale = targetW / 1920;
    const manualScale = parseFloat(urlParams.get('scale')) || 1.0;
    const finalScale = baseScale * manualScale;

    // Apply dynamic scaling to CSS variables for density
    grid.style.setProperty('--dot-size', `${Math.round(12 * finalScale)}px`);
    grid.style.setProperty('--dot-gap', `${Math.round(5 * finalScale)}px`);
    grid.style.setProperty('--header-font', `${Math.round(10 * finalScale)}px`);
    grid.style.setProperty('--week-font', `${Math.round(7 * finalScale)}px`);
    grid.style.setProperty('--month-padding', `${Math.round(2 * finalScale)}vh`);

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

dotter();
