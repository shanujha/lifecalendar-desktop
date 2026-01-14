const grid = document.querySelector('.grid');

function dotter() {
    const urlParams = new URLSearchParams(window.location.search);
    const showMonths = urlParams.get('months') !== 'false';
    const showWeeks = urlParams.get('weeks') !== 'false';

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    let dayOfYearCounter = 0;
    // Calculate current day of year for the present marker
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

        // Add weekday labels
        if (showWeeks) {
            weekDays.forEach(day => {
                const dayLabel = document.createElement('div');
                dayLabel.classList.add('weekday-label');
                dayLabel.innerText = day;
                monthGrid.appendChild(dayLabel);
            });
        }

        // Add padding for the first day of the month
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
