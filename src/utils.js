import { 
    uncheckAllRoutinesBelongToUserInFirebase,
    updateTheDayOfLastVisitToTodayInFirebase,
    setComboToZeroInFirebase,
    UpdateSkipAndLastSubmitInFirebase  } from "../lib/firebase"
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

export const getTodayName = () => {
    const dayOfWeek = dayjs().day()
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday' , 'friday', 'saturday']
    return daysOfWeek[dayOfWeek]
}

export const andOperator = (...conditions) => {
    if (conditions.length === 0) {
        return false; // No conditions to test
    }

    // Test all conditions using logical AND
    for (let condition of conditions) {
        if (!condition) {
            return false; // If any condition is false, return false
        }
    }

    return true;
}


const formattingDate = (inputDateString) => {
    const date = new Date(inputDateString);

    // Get the day, month, and year components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    // Create the formatted date string in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
}

export const initialProtocol = async (user, routines) => {
    const {lastVisit: userSLastVisit} = user;
    
    // if users opject has been loaded from local storage then that function will
    if(!userSLastVisit?.toDate) return;
    // not be in the scope so we wait until we get the object from database

    const lastVisit = formattingDate(userSLastVisit.toDate())

    if(lastVisit !== formattingDate(new Date())){
        await uncheckAllRoutinesBelongToUserInFirebase(user.uid, routines);
        await updateTheDayOfLastVisitToTodayInFirebase(user.uid)
        routines = routines.map(routine => ({...routine, isSubmitted: false,}))
    }

    return await Promise.all(routines.map(async routine => {
        const {routineId, combo, lastSubmit} = routine;
        let {skip} = routine;
        
        if(combo === 0) return routine;

        const currentDate = new Date();
        const lastSubmitFormatted = new Date(lastSubmit.toDate()).toISOString().slice(0, 10);

        if (lastSubmitFormatted === currentDate.toISOString().slice(0, 10)) return routine;

        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        const yesterdayFormatted = yesterday.toISOString().slice(0, 10);

        if (lastSubmitFormatted === yesterdayFormatted) return routine;

        const dateDiff = Math.floor((currentDate - new Date(lastSubmitFormatted)) / (1000 * 60 * 60 * 24));


        if(skip >= dateDiff - 1){ // it will not be -1 cause when diff is zero it means yesterday
            skip -= dateDiff - 1; // -1 means untill yesterday

            await UpdateSkipAndLastSubmitInFirebase(user.uid, routineId, skip, Timestamp.fromDate(yesterday))
            routine.skip = skip;
        }
        else{
            await setComboToZeroInFirebase(user.uid, routineId);
            routine.combo = 0;
        }

        return routine
    }))

}