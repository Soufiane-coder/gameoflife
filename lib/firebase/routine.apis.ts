import { collection, addDoc, Timestamp, updateDoc, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import RoutineType, {RoutineDeliverableType} from "../../src/types/routine.type";
import dayjs, { Dayjs } from "dayjs";
import dayjsToTimestamp, { TimestampToDayjs } from './utils.ts'

const fromLocalRoutineToDelivrable = (routine : RoutineType) : RoutineDeliverableType => {
    const routineDeliverable : RoutineDeliverableType = {
        ...routine,
        lastSubmit: dayjsToTimestamp(routine.lastSubmit),
        rangeTime: [dayjsToTimestamp(routine.rangeTime[0]), dayjsToTimestamp(routine.rangeTime[1])],
        spentedTime: dayjsToTimestamp(routine.spentedTime)
    };
    return routineDeliverable;
}

const fromDelivrableToLocleRoutine = (routine: RoutineDeliverableType) : RoutineType => {
    return {
        ...routine,
        lastSubmit : TimestampToDayjs(routine.lastSubmit),
        rangeTime: [TimestampToDayjs(routine.rangeTime[0]),TimestampToDayjs(routine.rangeTime[1])], // 'HH:mm:ss'
        spentedTime: TimestampToDayjs(routine.spentedTime),
    }
}

export const getRoutinesFromFirebase = async (uid : string,) => {
    const colRef = collection(db, `users/${uid}/routines`);
    const { docs } = await getDocs(colRef);
    return docs.map(doc => {
        const routine : RoutineDeliverableType = {...doc.data(), routineId: doc.id} as RoutineDeliverableType
        return fromDelivrableToLocleRoutine(routine)
    })
}


export const addRoutineToFirebase = async (uid: string, routine : RoutineType,) => {
    const routineDeliverable = fromLocalRoutineToDelivrable(routine)
    const colRef = collection(db, `users/${uid}/routines`);
    const { id: routineId } = await addDoc(colRef, routineDeliverable);
    return routineId;
}

export const editRoutineInFirebase = async (uid: string ,routine : RoutineType) => {
    const routineDeliverable = fromLocalRoutineToDelivrable(routine)
    const {routineId} = routineDeliverable;
    
    const selectedRoutine = doc(db, `/users/${uid}/routines/${routineId}`);
    await updateDoc(selectedRoutine, {
        ...routineDeliverable
    })
}


export const addTimeToSpentedTime = async (uid : string, routineId: string, spentedTime : Dayjs) => {
 
    const statisticsRef = doc(db, `users/${uid}/routines/`, routineId);
    const docSnap = await getDoc(statisticsRef)

    const selectedRoutine : RoutineDeliverableType = docSnap.data() as RoutineDeliverableType;

    await updateDoc(statisticsRef, {
        spentedTime: dayjsToTimestamp(spentedTime.add(TimestampToDayjs(selectedRoutine.spentedTime).valueOf()))
    })

    return spentedTime.add(TimestampToDayjs(selectedRoutine.spentedTime).valueOf())

    // if (docSnap.exists()){
    //     let updatedArray = docSnap.data()?.routinesSpentedTime

    //     if (updatedArray.length === 0 || updatedArray.some(item => item.routineId !== routineId)){
    //         updatedArray.push({routineId, spentedTime : dayjsToTimestamp(spentedTime)})
    //     }
    //     else {
    //         updatedArray = updatedArray.map((item : {routineId: string, spentedTime : Timestamp})  => {
    //             if(item.routineId === routineId){
    //                 const res = spentedTime.add(TimestampToDayjs(item.spentedTime).valueOf())
    //                 TotalTime = res;
    //                 return {...item, spentedTime : dayjsToTimestamp(res)}
    //             }
    //             return item;
    //         }) ?? []
    //     }
    //     await updateDoc(statisticsRef, {
    //         routinesSpentedTime: updatedArray
    //     })
    // }else{
    //     await setDoc( statisticsRef, { 
    //         day: today,
    //         routinesChecked : [],
    //         routinesSpentedTime : [{
    //             routineId,
    //             spentedTime : dayjsToTimestamp(spentedTime),
    //         }],
    //     });
    // }

    // return TotalTime
    // if (!docSnap.exists()) {
    //     await setDoc( statisticsRef, { 
    //         day: today,
    //         rouitnesChecked : [],
    //         routinesSpentedTime : [{
    //             routineId,
    //             spentedTime : spentedTimeTs,
    //         }],
    //     });
    // }
    // else{
    //     await updateDoc(statisticsRef, {
    //         routinesSpentedTime: arrayUnion({
    //             routineId,
    //             spentedTime : spentedTimeTs,
    //         })
    //     })
    // }

    // if (!docSnap.exists()) {
    //     await setDoc( statisticsRef, { 
    //         day: today,
    //         rouitnesChecked : [],
    //         routinesSpentedTime : [{
    //             routineId,
    //             spentedTime : spentedTimeTs,
    //         }],
    //     });
    // }
    // else{
    //     await updateDoc(statisticsRef, {
    //         routinesSpentedTime: arrayUnion({
    //             routineId,
    //             spentedTime : spentedTimeTs,
    //         })
    //     })
    // }
}