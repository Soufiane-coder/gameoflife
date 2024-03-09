import RoutineType from "./routine.type";

export default interface CategoryType {
    categoryId?: string;
    emoji: string;
    label: string;
    routines: RoutineType[] | undefined;
}