import React, { useContext, useEffect, useState } from 'react';
import OptionBarLayout from '../../layout/GameField/option-bar/option-bar.layout';
import './GameField.scss';
import ListRoutine from '../../layout/GameField/list-routine/list-routine.layout';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { setCurrentRoutines } from '../../redux/routines/routines.actions';
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';
import LoadingRoutine from '../../components/loading-routine/loading-routine.component'
import PageHeader from '../../components/PageHeader/page-header';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const isRoutineArchived = (routine) => routine.isArchived

const GameField = ({ setCurrentRoutines, user, routines }) => {
    const [selectedFilterOption, setSelectedFilterOption] = useState('unarchived');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loadingRoutine, setLoadingRoutine] = useState(true);
    const [labelFilterTags, setLabelFilterTags] = useState({
        all: 0,
        important: 0,
        waiting: 0,
        completed: 0,
        archived: 0,
        unarchived: 0,
    });

    const history = useHistory();

    if (!user) {
        console.error("user is not logged in")
        history.push('/signin')
    }

    useEffect(() => {
        setLoadingRoutine(!routines)
        if (!routines) return;
        Object.keys(labelFilterTags).forEach(tagName => {
            let tagValue = 0
            switch (tagName) {
                case 'important':
                    tagValue = routines?.reduce(
                        (accum, routine) =>
                            routine.priority === "important" && !isRoutineArchived(routine)? ++accum : accum, 0);
                    break
                case 'waiting':
                    tagValue = routines?.reduce(
                        (accum, routine) => (routine.isSubmitted === false && !isRoutineArchived(routine)? ++accum : accum),
                        0
                    );
                    break;
                case 'completed':
                    tagValue = routines?.reduce(
                        (accum, routine) => (routine.isSubmitted === true && !isRoutineArchived(routine)? ++accum : accum),
                        0
                    );
                    break;
                case 'archived':
                    tagValue = routines?.reduce(
                        (accum, routine) => (routine.isArchived === true ? ++accum : accum),
                        0
                    );
                    break;
                case 'unarchived':
                    tagValue = routines?.reduce(
                        (accum, routine) => (routine.isArchived === false ? ++accum : accum),
                        0
                    );
                    break;
                default:
                    tagValue = routines.length
            }
            setLabelFilterTags(old => ({ ...old, [tagName]: tagValue }))
        });
    }, [routines])

    return (
        <div className='game-field'>
            <PageHeader title="Routines" />
            <main className='game-field__main'>
                {
                    loadingRoutine ?
                        <LoadingRoutine />
                        :
                        <>
                            <OptionBarLayout {
                                ...{
                                    selectedFilterOption,
                                    setSelectedFilterOption,
                                    setSelectedCategories,
                                    labelFilterTags
                                }} />
                            <ListRoutine {
                                ...{
                                    selectedFilterOption,
                                    selectedCategories,
                                }} />
                        </>
                }

            </main>
        </div >
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines
})

const mapDispatchToProps = (dispatch) => ({
    setCurrentRoutines: (routines) => dispatch(setCurrentRoutines(routines)),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameField);