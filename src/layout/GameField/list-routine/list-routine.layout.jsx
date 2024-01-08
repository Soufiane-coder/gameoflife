import React, { useState } from "react";
import Routine from "../../../components/Routine/Routine";

import './list-routine.style.scss';
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectFilteredOption, selectCurrentRoutines} from "../../../redux/routines/routines.selector";
import { Fade } from "react-reveal";



const ListRoutine = ({ filterOption, selectedFilterOption, currentRoutines }) => {
    const filteredRoutines = filterOption(selectedFilterOption);
    const archivedRoutines = filteredRoutines.filter((routine) => routine.isArchived);
    const notArchivedRoutines = filteredRoutines.filter((routine) => !routine.isArchived);

    const [showArchivedList, setShowArchivedList] = useState(false);

    if (currentRoutines.length === 0){
        return(
            <h1>There is no routine</h1>
        )
    }

    
    return (
        <>
            <div className="list-routine">
                {
                    notArchivedRoutines.map(routine => {
                        return (
                            <Fade key={routine.routineId}>
                                <Routine className='routine' key={routine.routineId} {...{routine}} />
                            </Fade>
                        )
                    })
                }
            </div>
            <div className="archived-routines">
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
            </div>
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    filterOption: selectFilteredOption,
    currentRoutines: selectCurrentRoutines,
})

export default connect(mapStateToProps)(ListRoutine);
