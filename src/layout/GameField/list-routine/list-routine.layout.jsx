import React, { useEffect, useState } from "react";

import './list-routine.style.scss';
import {ReactComponent as EditButton} from '../../../assets/icons/edit.svg';
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {selectCurrentRoutines} from "../../../redux/routines/routines.selector";
import {selectCurrentCategories} from '../../../redux/categories/categories.selector';
import {
    filterRoutines,
    ListRoutinesComponent,
    filterCategoriesAndRoutines,
    sortRoutinesBy
} from './utils'

const ListRoutine = ({ 
    selectedFilterOption,
    currentRoutines,
    selectedCategories,
    currentCategories,
    selectedSort,
}) => {

    const [choosenCategory, setChoosenCategory ] = useState(
        filterCategoriesAndRoutines(
            currentCategories, currentRoutines,selectedFilterOption, selectedCategories)
    )

    const [choosenRoutines, setChoosenRoutines ] = useState(
        filterRoutines(currentRoutines, selectedFilterOption)) // so it render directely filtered routines in the first render

    useEffect(() => {
        if (selectedCategories.length === 0){
            setChoosenRoutines(
                sortRoutinesBy(
                    filterRoutines(currentRoutines, selectedFilterOption), selectedSort))
            return
        }
        setChoosenCategory(
            sortRoutinesBy(
                filterCategoriesAndRoutines(
                    currentCategories, currentRoutines,selectedFilterOption, selectedCategories), selectedSort))
        
    }, [selectedFilterOption, selectedCategories, currentRoutines, selectedSort])


    if (currentRoutines.length === 0){
        return(
            <h1>There is no routine</h1>
        )
    }

    // const EditButton = () => (
    //     <button class="list-routine__edit-category">
    //         <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    //         <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z"></path></svg>
    //     </button>
    // )

    return (
        <>
            <div className="list-routine ">
                {
                    selectedCategories.length === 0 ? 
                        <div className="list-routine__default">
                            <ListRoutinesComponent routines={choosenRoutines}/>
                        </div>
                    :
                    choosenCategory.map(({categoryId, emoji, routines, label}) => (
                        <fieldset className="list-routine__category-fieldset" key={`cat__${categoryId}`}>
                            <legend className='list-routine__legend'>{emoji} {label}
                                <EditButton className="list-routine__legend-edit-button"/>
                            </legend>
                            {
                                routines?.length == 0 ? 
                                <h2 className='list-routine__no-categry'>There is no routine in this category</h2> :
                                <ListRoutinesComponent routines={routines}/>
                            }
                        </fieldset>
                    ))
                }
            </div>
            {/* <div className="archived-routines">
                {
                    archivedRoutines?.length !== 0 ?
                        <>
                            <h2 className="archived-routines__title"
                                onClick={() => setShowArchivedList(old=>!old)}>Archived</h2>
                            <div className="list-routine">
                                {showArchivedList ? archivedRoutines.map(routine => 
                                    <Fade key={routine.routineId}>
                                        <Routine className='routine'  {...{routine}}  />
                                    </Fade>) : null}
                            </div>
                        </>
                        : null
                }
            </div> */}
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    currentRoutines: selectCurrentRoutines,
    currentCategories: selectCurrentCategories,
})

export default connect(mapStateToProps)(ListRoutine);
