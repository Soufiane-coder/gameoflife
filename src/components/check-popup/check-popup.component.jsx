import './check-popup.style.scss';
import { ReactComponent as MessageIcon } from '../../assets/icons/message.svg';
import { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { checkRoutine } from '../../redux/routines/routines.actions';
import { Zoom } from 'react-reveal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { hidePopup } from '../../redux/popup/popup.actions';
import { checkGoalInFirabase, checkRoutineInFirebase } from '../../../lib/firebase';
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';
import { getGoalsOfRoutine } from '../../../lib/firebase';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const CheckPopup = ({ user, checkRoutine, routineId, hidePopup, routines }) => {
    const [messageInput, setMessageInput] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [lastGoal, setLastGoal] = useState({})

    useEffect(() => {
        if(routines){
            (async () => {
                let goals = await getGoalsOfRoutine(user.uid, routineId)
                setLastGoal(goals.find(goal => !goal.isAchieved))
            })()
        }
    }, [routines])


    const handleChange = (event) => {
        const { value } = event.target;
        setMessageInput(value);
    }

    const handleCheckRoutine = async () => {
        setIsLoading(true);
        try {
            await checkRoutineInFirebase(user.uid, routineId, messageInput,)
            if(lastGoal.isAchieved){
                await checkGoalInFirabase(user.uid, routineId, lastGoal.goalId)
            }
            checkRoutine(routineId, messageInput);
            hidePopup()
        } catch (err) {
            console.error(`Error cannot checked this routine`, err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCheckGoal = () => {
        setLastGoal(old => ({...old, isAchieved: !old.isAchieved}))
    }

    return (
        <div className="message-window">
            <Zoom duration={500}>
                <div className="message-window__popup">
                    <div className="message-window__head">
                        <MessageIcon className='message-window__message-icon' />
                        <h2 className='message-window__title'>Write message</h2>
                    </div>
                    <p className="message-window__description">
                        Write a message for future you to motivate, noting the progress or planing the next step
                    </p>
                    {
                        lastGoal?.description ? 
                        <>
                            <div className="message-window__check-goal">
                                <input onChange={handleCheckGoal} name="goal" type="checkbox" id='message-window__check-goal_id'/>
                                <label htmlFor='message-window__check-goal_id'>{lastGoal.description}</label>
                            </div>
                        </> : 
                        <p>There is no goal go to <Link onClick={hidePopup} to={`road-map/${routineId}`}>road map</Link> and add a goal</p>
                    }
                   
                    <textarea type="text" className='message-window__input-text' value={messageInput} onChange={handleChange} />
                    <div className="message-window__buttons">
                        <button className="message-window__button message-window__button--filled" onClick={handleCheckRoutine}>
                            {
                                isLoading ? <LoadingSpinner /> : "Check this routine"
                            }
                        </button>
                        <button className="message-window__button message-window__button--outlined" onClick={() => hidePopup()}>Cancel</button>
                    </div>
                </div>
            </Zoom>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines,
})

const mapDispatchToProps = dispatch => ({
    checkRoutine: (routineId, message) => dispatch(checkRoutine(routineId, message)),
    hidePopup: () => dispatch(hidePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckPopup);