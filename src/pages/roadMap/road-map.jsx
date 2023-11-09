import './road-map.scss';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../../components/PageHeader/page-header';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { addNewGoalToFirebase, getGoalsOfRoutine } from '../../../lib/firebase';
import PathGoal from '../../components/path-goal/path-goal.component';
import { checkGoalInFirabase } from '../../../lib/firebase';


const RoadMap = ({ routines, user, }) => {
    const params = useParams();
    const [loadingRoutine, setLoadingRoutine] = useState(true);

    const [goal, setGoal] = useState({});

    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({
        description: '',
        type: 'sub-goal',
        index: -1,
        isAchieved: false,
    });

    useEffect(() => {
        if (routines) {
            getGoalsOfRoutine(user.uid, params.routineId).then(goals =>
                setGoals(goals.sort((a, b) => a.index - b.index))
            );
        }
        setLoadingRoutine(!routines);
    }, [routines])


    const getIndexOfReverseArray = [...goals].reverse().findIndex(goal => goal.isAchieved)
    const getIndexOfLastAchievedGoal = getIndexOfReverseArray === -1 ? -1 : (goals.length - 1 - getIndexOfReverseArray)

    useEffect(() => {
        if (goals) {
            setGoal(goals[getIndexOfLastAchievedGoal + 1] ? goals[getIndexOfLastAchievedGoal + 1] : {})
        }
    }, [goals])

    if (loadingRoutine) {
        return (
            <h1>loading routine ...</h1>
        )
    }

    const selectedRoutine = routines.find(routine => routine.routineId === params.routineId);

    if (!selectedRoutine) {
        return (
            <>
                <h1>There is no routine with Id : {params.routineId}</h1>
                <Link to='/gameField'>Return to the game field</Link>
            </>
        )
    }


    const handleAddGoal = async (event) => {
        event.preventDefault();
        const goalId = await addNewGoalToFirebase(user.uid, params.routineId, { ...newGoal, index: goals.length });
        goals.push({ ...newGoal, index: goals.length, goalId })
        setGoals(old => [...old])
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewGoal(old => ({ ...old, [name]: value }));
    }

    const handleCheckingGoal = () => {
        checkGoalInFirabase(user.uid, params.routineId, goal.goalId)
        const updatedGoals = [...goals];
        updatedGoals[getIndexOfLastAchievedGoal + 1].isAchieved = true;
        setGoals(updatedGoals)
    }
    // const getDistanceToGoal = (((+goal.goalId + 1) * 10) - selectedRoutine.time)
    return (
        <div className="road-map">
            <PageHeader title={'Road Map'} />
            <PathGoal {...{ goals, setGoal, getIndexOfLastAchievedGoal }} />
            <div className="road-map__dashboard">
                <div className="road-map__goal-descriptions">
                    {
                        goal.goalId ? <>
                            <h1>Goal index: {goal.index}</h1>
                            <p className="road-map__goal-description">{goal.description}</p>
                            {goal.isAchieved ? null : <button onClick={handleCheckingGoal}> check this goal</button>}
                        </> :
                            <h1>Click on your goals</h1>
                    }

                </div>
                <div className="road-map__adding-goal">
                    <h1>Add a goal</h1>
                    <textarea className="road-map__adding-description" name='description' value={newGoal.description} onChange={handleChange} placeholder='Write a description of your goal'></textarea>
                    <div className="road-map__button-wrapper">
                        <select name="type"
                            onChange={handleChange}
                            value={newGoal.type}>
                            <option value="sub-goal"> sub goal</option>
                            <option value="small-goal"> small goal</option>
                            <option value="big-goal"> big goal</option>
                        </select>
                        <button className="road-map__adding-button" onClick={handleAddGoal}>Add a goal</button>
                    </div>
                </div>
                
            </div>
        </div >
    )
}

const mapStateToProps = createStructuredSelector({
    routines: selectCurrentRoutines,
    user: selectCurrentUser
})


export default connect(mapStateToProps)(RoadMap);