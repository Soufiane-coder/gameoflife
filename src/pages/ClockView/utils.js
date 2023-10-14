
export const isAmPm = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours <= 12 ? { am: true, pm: false } : { pm: true, am: false };
}
const isTimeInInterval = (timeToCheck, startTime, endTime) => {
    const time = new Date(`1970-01-01T${timeToCheck}:00`); // Create a Date object with the specified time (ignoring the date part)

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    return time > start && time < end;
}

export const hourMinFormat = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

export const getCurrentRoutine = (routines, timeToCheck) => {
    return routines.find(item => isTimeInInterval(timeToCheck, item.startRoutine, item.endRoutine));
}