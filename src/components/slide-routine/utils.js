export const sortArrayByStartTime = (arr) => {
    return arr.map(item => ({ ...item })).sort((a, b) => {
        const [aHour, aMinute] = a.startRoutine.split(':').map(Number);
        const [bHour, bMinute] = b.startRoutine.split(':').map(Number);
        if (aHour !== bHour) {
            return aHour - bHour;
        } else {
            return aMinute - bMinute;
        }
    });
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

export const getRoutineIndexInTime = (routines, timeToCheck) => {
    return routines.findIndex(item => isTimeInInterval(timeToCheck, item.startRoutine, item.endRoutine));
}