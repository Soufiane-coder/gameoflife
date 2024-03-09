import { collection, addDoc, Timestamp } from "firebase/firestore";
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

export const addRoutineToFirebase = async (uid: string, routine : RoutineType,) => {
    const routineDeliverable : RoutineDeliverableType = {
        ...routine,
        lastSubmit: dayjsToTimestamp(routine.lastSubmit),
        rangeTime: [dayjsToTimestamp(routine.rangeTime[0]), dayjsToTimestamp(routine.rangeTime[1])]
    };

    const colRef = collection(db, `users/${uid}/routines`);
    const { id: routineId } = await addDoc(colRef, routineDeliverable);
    return routineId;
}