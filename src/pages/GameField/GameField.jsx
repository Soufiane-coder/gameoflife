import React, { useContext, useEffect, useState } from 'react';
import Header from '../../layout/GameField/Header/Header';
import './GameField.scss';
import ListRoutine from '../../layout/GameField/ListRoutine/ListRoutine';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { setCurrentRoutines } from '../../redux/routines/routines.actions';
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const GameField = ({ setCurrentRoutines, user, routines}) => {
    const [selectedFilterOption, setSelectedFilterOption] = useState("all");
    const [loadingRoutine, setLoadingRoutine] = useState(true);

    const history = useHistory();
    if(!user){
        console.error("user is not logged in")
        history.push('/signin')
    }

    useEffect(() => {
        setLoadingRoutine(!routines)
    }, [routines])

    if (loadingRoutine) {
        return (
            <h1>Loading routines ...</h1>
        )
    }
    return (
        <div className='game__field'>

            
            <main>
                <Header {...{ selectedFilterOption, setSelectedFilterOption }} />
                <ListRoutine {...{ selectedFilterOption, }} />
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