const grid = document.querySelector('.grid');
const today = new Date();

function dotter() {
    if (typeof WallpaperLib === 'undefined' || !WallpaperLib || typeof WallpaperLib.setup !== 'function') {
        console.error('WallpaperLib is not available. Skipping dotter initialization.');
        return;
    }

    const { params } = WallpaperLib.setup('.grid', {
        horizontalUnits: (4 * 7) + 8,
        verticalUnits: (3 * 10) + 6,
        baseSize: 12
    });

    const showMonths = params.months;
    const showWeeks = params.weeks;

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

    const totalDays = Math.round((new Date(currentYear + 1, 0, 1) - new Date(currentYear, 0, 1)) / (1000 * 60 * 60 * 24));
    WallpaperLib.updateStats(dayOfYear + 1, totalDays);
}

dotter();
