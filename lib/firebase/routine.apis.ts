import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import RoutineType, {RoutineDeliverableType} from "../../src/types/routine.type";
import { Dayjs } from "dayjs";

const dayjsToTimestamp = (dayjsObject : Dayjs) : Timestamp =>  {
    if (!dayjsObject || !dayjsObject.isValid()) {
        new Timestamp(0, 0)
    }
    const unixTimestamp = dayjsObject.unix();
    return new Timestamp(unixTimestamp, 0);
}

const fromLocalRoutineToDelivrable = (routine : RoutineType) : RoutineDeliverableType => {
    const routineDeliverable : RoutineDeliverableType = {
        ...routine,
        lastSubmit: dayjsToTimestamp(routine.lastSubmit),
        rangeTime: [dayjsToTimestamp(routine.rangeTime[0]), dayjsToTimestamp(routine.rangeTime[1])]
    };
    return routineDeliverable;
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