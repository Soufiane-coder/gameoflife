
import './ClockView.scss';
import ClockContainer from '../../components/ClockContainer/ClockContainer';
import SlideRoutine from '../../components/slide-routine/slide-routine.component';
import React, { useState, useEffect  }  from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';
import PageHeader from '../../components/PageHeader/page-header';
import { isAmPm, getCurrentRoutine, hourMinFormat } from './utils';

import { selectCurrentUser } from '../../redux/user/user.selector';
import ToDoList from '../../components/todo-list/todo-list.component';


const ClockView = ({ user, routines }) => {
    const [loadingRoutines, setLoadingRoutines] = useState(true);


    useEffect(() => {
        setLoadingRoutines(!routines);
        
    }, [routines])


    const [amPm, setAmPm] = useState({ ...isAmPm() });
    

    const handleChangeCheckBox = () => {
        setAmPm(old => ({ am: !old.am, pm: !old.pm }))
    }


    if (loadingRoutines) {
        return (
            <h1>loading Routines ...</h1>
        )
    }
    return (
        <>
            <PageHeader title={'Clock View'} />
            <div 
                className='clock-view-page'
                >
                <ClockContainer routines={routines}  {...amPm} />
                <ToDoList user={user}/>
                
            </div>
        </>
    )
}

const mapPropsToMap = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines
})

export default connect(mapPropsToMap)(ClockView);