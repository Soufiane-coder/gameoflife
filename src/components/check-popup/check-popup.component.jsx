import './check-popup.style.scss';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

import { ReactComponent as MessageIcon } from '../../assets/icons/message.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';

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
import bellSound from '../../../public/bell-sound.mp3'

const CheckPopup = ({ user, checkRoutine, routineId, hidePopup, routines }) => {
    const [messageInput, setMessageInput] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [lastGoal, setLastGoal] = useState({})

    const [playCheckSound] = useSound(bellSound)

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
            playCheckSound()
            await checkRoutineInFirebase(user.uid, routineId, messageInput,)
            if(lastGoal?.isAchieved){
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
                <div className="popup-window message-window__popup">
                    <div className="popup-window__head message-window__head">
                        <MessageIcon className='popup-window__icon message-window__message-icon' />
                        <h3 className='message-window__title'>
                            Write message
                        </h3>
                        <CloseIcon className='popup-window__close-icon'/>
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
                    
                    
                    <button className="message-window__button message-window__button--filled" onClick={handleCheckRoutine}>
                        {
                            isLoading ? <LoadingSpinner /> : "Check this routine"
                        }
                    </button>
                    <button className="message-window__button message-window__button--outlined" onClick={() => hidePopup()}>Cancel</button>
                    
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