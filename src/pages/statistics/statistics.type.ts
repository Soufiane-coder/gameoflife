import { Timestamp } from "firebase/firestore";

interface SpentedTimeType {
    routineId: string;
    spentedTime: Timestamp;
}

export default interface StatisticsType {
    day: string;
    routinesChecked: string[];
    routinesSpentedTime: SpentedTimeType[];
}