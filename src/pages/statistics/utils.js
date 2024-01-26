export const isYesterday = (date) => {
    let currentDate = new Date();

    // Subtract one day to get yesterday's date
    let yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);

    // Convert yesterday's date to its ISO string representation
    let yesterdayISOString = yesterdayDate.toISOString().split('T')[0];
    return date === yesterdayISOString
}

export const isToday= (date) => {
    let currentDate = new Date();

    // Subtract one day to get yesterday's date
    let yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate());

    // Convert yesterday's date to its ISO string representation
    let yesterdayISOString = yesterdayDate.toISOString().split('T')[0];
    return date === yesterdayISOString
}

export function fillMissingDates(statistics) {
    // Convert strings to Date objects for comparison
    const dates = statistics.map(function(stat) {
        return new Date(stat.day);
    });

    // Function to generate dates between two dates
    function getDates(startDate, endDate) {
        const datesArray = [];
        const currentDate = startDate;
        while (currentDate <= endDate) {
            datesArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return datesArray;
    }

    // Fill in the missing dates
    for (let i = 0; i < statistics.length - 1; i++) {
        const startDate = dates[i];
        const endDate = dates[i + 1];
        const missingDates = getDates(startDate, endDate);

        // Convert dates back to ISO string format
        const missingDatesISO = missingDates.map(function(date) {
            return date.toISOString().split('T')[0]; // Extract date part
        });

        // Add missing dates to the statistics array
        for (let j = 1; j < missingDatesISO.length - 1; j++) {
            statistics.push({ 
                day: missingDatesISO[j],
                routinesChecked: [],
            });
        }
    }

    // Sort the statistics array based on the 'day' property
    statistics.sort(function(a, b) {
        return new Date(a.day) - new Date(b.day);
    });

    return statistics.slice(-30);
}

