import React, { useEffect } from "react";
import { ReactComponent as CoinIcon } from '../../../assets/icons/coin-icon.svg';
import './Header.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../../redux/user/user.selector";
import { selectCurrentRoutines } from '../../../redux/routines/routines.selector';
import { useState } from "react";
import PageHeader from '../../../components/PageHeader/page-header';
import Filter from '../../../components/Filter/Filter';

import { displayAddRoutinePopupState } from "../../../redux/popup/popup.actions";


const Header = ({ user, routines, selectedFilterOption, setSelectedFilterOption, displayAddRoutinePopupState }) => {


    const [optionsTags, setOptionsTags] = useState({
        all: '0',
        important: '0',
        waiting: '0',
        completed: '0',
    });

    useEffect(() => {
        Object.keys(optionsTags).forEach(tagName => {
            let tagValue = 'all';
            switch (tagName) {
                case 'all':
                    tagValue = Object.keys(routines || {}).length;
                    break;
                case 'important':
                    tagValue = routines?.reduce((accum, routine) => routine.priority === "important" ? ++accum : accum, 0);
                    break;
                case 'waiting':
                    tagValue = routines?.reduce((accum, routine) => routine.submitted === "0" ? ++accum : accum, 0);
                    break;
                case 'completed':
                    tagValue = routines?.reduce((accum, routine) => routine.submitted === "1" ? ++accum : accum, 0);
                    break;
                default:
                    tagValue = Object.keys(routines || {}).length;
            }
            setOptionsTags(oldTags => ({ ...oldTags, [tagName]: tagValue }));
        })
    }, [routines])


    const handleRadioChange = (event) => {
        setSelectedFilterOption(event.target.value); // Update the state with the selected option
    };


    return (
        <div className="game__field--header">
            <PageHeader title='Routines'/>
            <div className="filter-and-adding-button">
                <div className="filter">
                    <input type="radio" name="filter" id="all" value="all"
                        checked={selectedFilterOption === "all"}
                        onChange={handleRadioChange} />
                    <label className="filter-item all" htmlFor="all">All routine <span className="tag">{optionsTags.all}</span></label>

                    <input type="radio" name="filter" id="_important" value="important"
                        checked={selectedFilterOption === "important"}
                        onChange={handleRadioChange} />
                    <label className="filter-item important" htmlFor="_important">Important <span className="tag">{optionsTags.important}</span></label>

                    <input type="radio" name="filter" id="waiting" value="waiting"
                        checked={selectedFilterOption === "waiting"}
                        onChange={handleRadioChange} />
                    <label className="filter-item waiting" htmlFor="waiting"> Waiting <span className="tag">{optionsTags.waiting}</span></label>

                    <input type="radio" name="filter" id="completed" value="completed"
                        checked={selectedFilterOption === "completed"}
                        onChange={handleRadioChange} />
                    <label className="filter-item completed" htmlFor="completed"> Completed <span className="tag">{optionsTags.completed}</span></label>
                    <span className="selector"></span>
                </div>
                <Filter />
                {/* we put false so editThisRoutine will be false */}
                <button className="adding-routine-button" onClick={() => displayAddRoutinePopupState(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20" fill="none" className="svg-icon"><g strokeWidth="1.5" strokeLinecap="round" stroke="#de8a2a"><circle r="7.5" cy="10" cx="10"></circle><path d="m9.99998 7.5v5"></path><path d="m7.5 9.99998h5"></path></g></svg>
                    <span className="lable">Add routine</span>
                </button>
            </div>
        </div >
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines,
})

const mapDispatchToProps = dispatch => ({
    displayAddRoutinePopupState: (state) => dispatch(displayAddRoutinePopupState(state)),

})


export default connect(mapStateToProps, mapDispatchToProps)(Header);