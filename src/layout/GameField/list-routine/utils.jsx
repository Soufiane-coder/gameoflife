import Routine from "../../../components/Routine/Routine";
import { Fade } from "react-reveal";

export const filterRoutines = (routines, filterLabel) =>{
    switch (filterLabel) {
        case 'all':
            return routines;
        case 'important':
            return routines.filter(routine => routine.priority === 'important');
        case 'completed':
            return routines.filter(routine => routine.isSubmitted === true);
        case 'waiting':
            return routines.filter(routine => routine.isSubmitted === false);
        default:
            return routines;
        }
}

export const filterCategoriesAndRoutines = (categories, filterLabel, categoryLabel) => {
    let filteredCategories = categories

    if (categoryLabel !== 'all'){
        filteredCategories = categories.filter(category => category.label === categoryLabel)
    }
    filteredCategories = filteredCategories.map(category => ({
        ...category,
        routines: filterRoutines(category.routines, filterLabel)
    }))

    return filteredCategories
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
