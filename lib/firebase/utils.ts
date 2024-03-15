import dayjs, { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";

const dayjsToTimestamp = (dayjsObject : Dayjs) : Timestamp =>  {
    if (!dayjsObject || !dayjsObject.isValid()) {
        new Timestamp(0, 0)
    }
    return new Timestamp(dayjsObject.valueOf() / 1000, 0);
}
export const TimestampToDayjs = (timestampObject : Timestamp) : Dayjs => {
    return dayjs(timestampObject.toDate());
}

export default dayjsToTimestamp;