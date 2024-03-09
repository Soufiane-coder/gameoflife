import { 
    uncheckAllRoutinesBelongToUserInFirebase,
    updateTheDayOfLastVisitToTodayInFirebase,
    setComboToZeroInFirebase,
    UpdateSkipAndLastSubmitInFirebase  } from "../lib/firebase"
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import { DaysWeekType } from './types/general.type'
import RoutineType, { RoutineDeliverableType } from "./types/routine.type";
import UserType from "./types/user.type";

export const getTodayName = () => {
    const dayOfWeek = dayjs().day()
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday' , 'friday', 'saturday']
    return daysOfWeek[dayOfWeek]
}

export const daysSchedule : {value: DaysWeekType, label: string}[] = [
    // {value:'day', label: 'Day'},
    {value: 'sunday', label: 'Sunday'},
    {value: 'monday', label: 'Monday'},
    {value: 'tuesday', label: 'Tuesday'},
    {value: 'wednesday', label: 'Wednesday'},
    {value: 'thursday', label: 'Thursday'},
    {value: 'friday', label: 'Friday'},
    {value: 'saturday', label: 'Saturday'},
]

const timestampToDayjs = (timestamp: Timestamp): dayjs.Dayjs => {
    // Convert Firebase Timestamp to JavaScript Date object
    const jsDate: Date = timestamp.toDate();

    // Convert JavaScript Date object to Day.js object
    const dayjsObject: dayjs.Dayjs = dayjs(jsDate);

    return dayjsObject;
}

export const andOperator = (...conditions: boolean[]) : boolean => {
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

export const initialProtocol = async (user : UserType, routines : RoutineDeliverableType[]) => {
    const {lastVisit: userSLastVisit} = user;
    
    // if users opject has been loaded from local storage then that function will
    if(!userSLastVisit?.toDate) return;
    // not be in the scope so we wait until we get the object from database

    const lastVisit = dayjs(userSLastVisit.toDate()).format('YYYY-MM-DD')

    if(lastVisit !== dayjs(new Date()).format('YYYY-MM-DD')){
        await uncheckAllRoutinesBelongToUserInFirebase(user.uid, routines);
        await updateTheDayOfLastVisitToTodayInFirebase(user.uid)
        routines = routines.map(routine => ({...routine, isSubmitted: false,}))
    }

    return await Promise.all(routines.map(async routine => {
        const localRoutine : RoutineType = {
            ...routine,
            lastSubmit: timestampToDayjs(routine.lastSubmit),
            rangeTime: [timestampToDayjs(routine.rangeTime[0]), timestampToDayjs(routine.rangeTime[1])]
        };

        const {routineId, combo, lastSubmit} = localRoutine;
        let {skip} = localRoutine;
        
        if(combo === 0) return localRoutine;

        const currentDate = new Date();
        const lastSubmitFormatted = new Date(lastSubmit.toDate()).toISOString().slice(0, 10);

        if (lastSubmitFormatted === currentDate.toISOString().slice(0, 10)) return localRoutine;

        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        const yesterdayFormatted = yesterday.toISOString().slice(0, 10);

        if (lastSubmitFormatted === yesterdayFormatted) return localRoutine;

        const dateDiff = Math.floor((currentDate.getTime() - new Date(lastSubmitFormatted).getTime()) / (1000 * 60 * 60 * 24));


        if(skip >= dateDiff - 1){ // it will not be -1 cause when diff is zero it means yesterday
            skip -= dateDiff - 1; // -1 means untill yesterday

            await UpdateSkipAndLastSubmitInFirebase(user.uid, routineId, skip, Timestamp.fromDate(yesterday))
            localRoutine.skip = skip;
        }
        else{
            await setComboToZeroInFirebase(user.uid, routineId);
            localRoutine.combo = 0;
        }

        return localRoutine
    }))

}