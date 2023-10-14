import React, { useState } from "react";
import Routine from "../../../components/Routine/Routine";

import './ListRoutine.scss';
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectFilteredOption } from "../../../redux/routines/routines.selector";
import { Fade } from "react-reveal";


const ListRoutine = ({ filterOption, selectedFilterOption }) => {
    const filteredRoutines = filterOption(selectedFilterOption);
    const archivedRoutines = filteredRoutines.filter((routine) => routine.isArchived);
    const notArchivedRoutines = filteredRoutines.filter((routine) => !routine.isArchived);

    const [showArchivedList, setShowArchivedList] = useState(false);

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
    filterOption: selectFilteredOption
})

export default connect(mapStateToProps)(ListRoutine);
