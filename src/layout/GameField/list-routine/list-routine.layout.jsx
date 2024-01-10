import React, { useEffect, useState } from "react";

import './list-routine.style.scss';
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {selectCurrentRoutines} from "../../../redux/routines/routines.selector";
import {selectCurrentCategories} from '../../../redux/categories/categories.selector';
import {filterRoutines, ListRoutinesComponent, filterCategoriesAndRoutines} from './utils'

const ListRoutine = ({ 
    selectedFilterOption,
    currentRoutines,
    selectedCategory,
    currentCategories,
}) => {

    const [choosenCategory, setChoosenCategory ] = useState(
        filterCategoriesAndRoutines(
            currentCategories, currentRoutines,selectedFilterOption, selectedCategory)
    )

    const [choosenRoutines, setChoosenRoutines ] = useState(currentRoutines)

    useEffect(() => {
        if (selectedCategory === 'default'){
            setChoosenRoutines(filterRoutines(currentRoutines, selectedFilterOption))
            return
        }
        setChoosenCategory(
            filterCategoriesAndRoutines(
                currentCategories, currentRoutines,selectedFilterOption, selectedCategory))
    }, [selectedFilterOption, selectedCategory])


    if (currentRoutines.length === 0){
        return(
            <h1>There is no routine</h1>
        )
    }

    return (
        <>
            <div className="list-routine ">
                {
                    selectedCategory === 'default' ? 
                        <div className="list-routine__default">
                            <ListRoutinesComponent routines={choosenRoutines}/>
                        </div>
                    :
                    choosenCategory.map(({categoryId, emoji, routines, label}) => (
                        <fieldset className="list-routine__category-fieldset" key={`cat__${categoryId}`}>
                            <legend className='list-routine__legend'>{emoji} {label}</legend>
                            <ListRoutinesComponent routines={routines}/>
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
