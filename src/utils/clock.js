
export const timeStringToFloat = (timeString, am = false, pm = false) => {
    const [hours, minutes] = timeString.split(":").map(Number);

    // Calculate the fractional part of an hour
    const fractionOfHour = minutes / 60;

    // Add the fractional part to the hours
    const floatNumber = hours + fractionOfHour;

    if (am) {
        if (floatNumber < 0) throw Error('Date cannot be negative')
        return floatNumber > 12.0 ? 12 : floatNumber;
    }

    if (pm) {
        if (floatNumber > 24) throw Error('Date cannot greater than 24')
        return floatNumber < 12.0 ? 12 : floatNumber;
    }
    return floatNumber;
};

export const hoursToDegrees = (startHour, endHour, am, pm) => {
    const hours = timeStringToFloat(endHour, am, pm) - timeStringToFloat(startHour, am, pm);
    if (hours < 0) {
        throw Error('end hour is greater than start hour');
    }
    const degreesPerHour = 360 / 24 * 2;
    return hours * degreesPerHour;
};

export const beginningOfHourToDegrees = (hours, am, pm) => {
    const degreesPerHour = 360 / 12;
    return timeStringToFloat(hours, am, pm) * degreesPerHour;
};


