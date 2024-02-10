import Routine from "../../../components/Routine/Routine";
import { Fade } from "react-reveal";

const isRoutineArchived = (routine) => routine.isArchived

export const filterRoutines = (routines, filterLabel) =>{
    switch (filterLabel) {
        case 'all':
            return routines
        case 'important':
            return routines.filter(routine => routine.priority === 'important' && !isRoutineArchived(routine));
        case 'completed':
            return routines.filter(routine => routine.isSubmitted === true && !isRoutineArchived(routine));
        case 'waiting':
            return routines.filter(routine => routine.isSubmitted === false && !isRoutineArchived(routine));
        case 'archived':
            return routines.filter(routine => routine.isArchived === true);
        case 'unarchived':
            return routines.filter(routine => routine.isArchived === false);
        default:
            return routines;
        }
}

export const filterCategoriesAndRoutines = (categories, routines, filterLabel, categoryLabels) => {
    let filteredCategories = categories

    // const isAll = categoryLabels.find(categoryLabel => categoryLabel.value === 'all') !== -1

    if (!Boolean(categoryLabels?.legnth)){
        filteredCategories = categories.filter(
            category =>  categoryLabels.some(categoryLabel => categoryLabel.value === category.categoryId))
    }

    filteredCategories = filteredCategories.map(category => ({
        ...category,
        routines: filterRoutines(
            routines.filter(routine => routine.categoryId == category.categoryId),
                filterLabel)
    }))

    return filteredCategories
}

export const sortRoutinesBy = (routines, sortAttr) => {
    switch (sortAttr){
        case 'level':
            routines.sort((a, b) => b.level - a.level)
            return routines
        case 'priority':
            routines.sort((a,b) => {
                const priorityOrder = { 'important': 0, 'medium': 1, 'low': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            console.log(routines.map(routine => routine.priority))
            return routines
        default:
            return routines
    }
    
}
export const ListRoutinesComponent = ({routines}) => {
    return routines.map(routine => {
        return (
            <Fade key={routine.routineId}>
                <Routine className='routine' key={routine.routineId} {...{routine}} />
             </Fade> 
        )
    })
}
