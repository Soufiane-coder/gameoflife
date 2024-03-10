import Routine from "../../../components/Routine/Routine";
import { Fade }  from "react-reveal";
import { andOperator } from "../../../utils";
import React from "react";
import RoutineType from "../../../types/routine.type";
import { DaysWeekType, FilterLabelsType } from "../../../types/general.type";
import CategoryType from '../../../types/category.type';


const isRoutineArchived = (routine : RoutineType) : boolean => routine.isArchived

export const filterRoutines = (
    routines: RoutineType[],
    filterLabel : FilterLabelsType,
    selectedDaysSchedule : DaysWeekType[],) => {
    switch (filterLabel) {
        case FilterLabelsType.ALL:
            return routines.filter(routine => 
                !selectedDaysSchedule.length || routine.days.some(day => selectedDaysSchedule.includes(day)))
        case FilterLabelsType.IMPORTANT:
            return routines.filter(routine => andOperator(
                !selectedDaysSchedule.length || routine.days.some(day => selectedDaysSchedule.includes(day)),
                routine.priority === 'important',
                !isRoutineArchived(routine)))

        case FilterLabelsType.COMPLETED:
            return routines.filter(routine => andOperator(
                !selectedDaysSchedule.length || routine.days.some(day => selectedDaysSchedule.includes(day)),
                routine.isSubmitted === true,
                !isRoutineArchived(routine)))

        case FilterLabelsType.WAITNG:
            return routines.filter(routine => andOperator(
                !selectedDaysSchedule.length || routine.days.some(day => selectedDaysSchedule.includes(day)),
                routine.isSubmitted === false,
                !isRoutineArchived(routine)))

        case FilterLabelsType.ARCHIVED:
            return routines.filter(routine => andOperator(
                !selectedDaysSchedule.length || routine.days.some(day => selectedDaysSchedule.includes(day)),
                routine.isArchived === true))
            
        case FilterLabelsType.UNARCHIVED:
            return routines.filter(routine => andOperator(
                !selectedDaysSchedule.length || routine.days.some(day => selectedDaysSchedule.includes(day)),
                routine.isArchived === false))
        default:
            return routines;
        }
}

export const filterCategoriesAndRoutines = (
        categories : CategoryType[],
        routines : RoutineType[],
        filterLabel : FilterLabelsType,
        categoryLabels : string[],
        selectedDaysSchedule: DaysWeekType[],
        ) : CategoryType[] => {

    let filteredCategories = categories
    // const isAll = categoryLabels.find(categoryLabel => categoryLabel.value === 'all') !== -1
    
    if (Boolean(categoryLabels?.length)){
        filteredCategories = categories.filter(
            category => categoryLabels.some(categoryLabel => categoryLabel === category.categoryId))
        }
    
    filteredCategories = filteredCategories.map(category => {
        return {
        ...category,
        routines: filterRoutines(
            routines.filter(routine => routine.categoryId === category.categoryId),
                filterLabel, selectedDaysSchedule)
    }})

    return filteredCategories
}

export const sortRoutinesBy = (routines : RoutineType[], sortAttr : 'difficulty' | 'priority') => {
    switch (sortAttr){
        case 'difficulty':
            routines.sort((a, b) => b.level - a.level)
            return routines
        case 'priority':
            routines.sort((a,b) => {
                const priorityOrder = { 'important': 0, 'medium': 1, 'low': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            return routines
        default:
            return routines
    }
    
}
export const ListRoutinesComponent : React.FC<{routines: RoutineType[]}> = ({routines}) => {
    return routines.map((routine) => {
        return (
            <React.Fragment key={routine.routineId}>
                <Fade >
                    <Routine routine={routine} />
                </Fade> 
            </React.Fragment>
        )
    })
}
