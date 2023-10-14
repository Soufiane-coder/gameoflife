const timeStringToFloat = (timeString, am = false, pm = false) => {
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
const compareTimes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    if (hours1 < hours2) return -1;
    if (hours1 > hours2) return 1;

    if (minutes1 < minutes2) return -1;
    if (minutes1 > minutes2) return 1;

    return 0;
}

export const getAllTimes = (array, am, pm) => {
    const routines = [...array].sort((routine1, routine2) => {
        return compareTimes(routine1.startRoutine, routine2.startRoutine);
    });
    let data = [];
    let acc = 0;
    let previewsWasEmpty = false;
    for (let i = 0, dataIndex = 0; i < routines.length; i++) {
        if (i == 0) {
            if (am && routines[i].startRoutine !== '00:00' && data.length === 0) {
                const hours = timeStringToFloat(routines[i].startRoutine, am, pm) - timeStringToFloat('00:00', am, pm);
                if (hours === 0.0) {
                    continue;
                }
                data.push({ label: 'empty', hours, bgEmojiColor: 'rgba(0,0,0,0.2)', id: '-1' });
                --i;
            } else if (pm && routines[i].startRoutine !== '12:00' && data.length === 0) {
                const hours = timeStringToFloat(routines[i].startRoutine, am, pm) - timeStringToFloat('12:00', am, pm);
                if (hours === 0.0) {
                    continue;
                }
                data.push({ label: 'empty', hours, bgEmojiColor: 'rgba(0,0,0,0.2)', id: '-1' });
                --i;
            }
            else {
                const hours = timeStringToFloat(routines[i].endRoutine, am, pm) - timeStringToFloat(routines[i].startRoutine, am, pm);
                if (hours === 0.0) {
                    continue;
                }
                data.push({ label: routines[i].emoji + routines[i].title, hours, bgEmojiColor: routines[i].bgEmojiColor, id: routines[i].routineId });
                previewsWasEmpty = false;
            }
        } else if (routines[i - 1].endRoutine === routines[i].startRoutine) {
            const hours = timeStringToFloat(routines[i].endRoutine, am, pm) - timeStringToFloat(routines[i].startRoutine, am, pm);
            if (hours === 0.0) {
                continue;
            }
            data.push({ label: routines[i].emoji + routines[i].title, hours, bgEmojiColor: routines[i].bgEmojiColor, id: routines[i].routineId });
            previewsWasEmpty = false;
        }
        else if (routines[i - 1].endRoutine !== routines[i].startRoutine && previewsWasEmpty) {
            const hours = timeStringToFloat(routines[i].endRoutine, am, pm) - timeStringToFloat(routines[i].startRoutine, am, pm);
            if (hours === 0.0) {
                continue;
            }
            data.push({ label: routines[i].emoji + routines[i].title, hours, bgEmojiColor: routines[i].bgEmojiColor, id: routines[i].routineId });
            previewsWasEmpty = false;
        }
        else if (routines[i - 1].endRoutine !== routines[i].startRoutine) {
            const hours = timeStringToFloat(routines[i].startRoutine, am, pm) - timeStringToFloat(routines[i - 1].endRoutine, am, pm);
            if (hours === 0.0) {
                continue;
            }
            data.push({ label: 'empty', hours, bgEmojiColor: 'rgba(0,0,0,0.2)', id: '-1' });
            --i;
            previewsWasEmpty = true;
        }
        acc += data[dataIndex].hours;
        dataIndex++;
    }
    if (acc != 12) {
        data.push({ label: 'empty', hours: 12 - acc, bgEmojiColor: 'rgba(0,0,0,0.2)', id: '-1' });
    }

    return data;
}