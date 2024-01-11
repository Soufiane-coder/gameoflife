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

export const ListRoutinesComponent = ({routines}) => {
    return routines.map(routine => {
        return (
            <Fade key={routine.routineId}>
                <Routine className='routine' key={routine.routineId} {...{routine}} />
            </Fade>
        )
    })
}
