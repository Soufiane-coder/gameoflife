const isTimeInInterval = (timeToCheck, startTime, endTime) => {
    const time = new Date(`1970-01-01T${timeToCheck}:00`); // Create a Date object with the specified time (ignoring the date part)

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    return time > start && time < end;
}

export const isTimeInArray = (array, timeToCheck) => {
    return array.some(item => isTimeInInterval(timeToCheck, item.startRoutine, item.endRoutine));
}