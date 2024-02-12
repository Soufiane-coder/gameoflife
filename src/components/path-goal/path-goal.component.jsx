import './path-goal.style.scss';
import { useEffect, useRef } from 'react';
import Goku from '../../assets/badjets/goku_0-stand.gif';
import ArrowUp from '../../assets/icons/arrow_up.svg'

const PathGoal = ({ goals, setGoal, getIndexOfLastAchievedGoal, user }) => {
    const characterDiv = useRef(null);
    useEffect(() => {
        if (goals && goals.length > 0){
            characterDiv.current.scrollIntoView({ behavior: 'smooth' ,block: 'nearest', inline: 'center'});
        }
    }, [goals])

    const handleClick = (event) => {
        const { id } = event.target;
        const searchedGoal = goals.find(goal => goal.goalId === id);
        console.log(searchedGoal)
        setGoal(searchedGoal);
    }

    const getCharacterPosition = (getIndexOfLastAchievedGoal ? getIndexOfLastAchievedGoal : 0) + 1;
    
    return (
        <div className="path-goal">
            <img 
                src={user.character ? user.character : ArrowUp} alt=""
                className="path-goal__character"
                style={
                    {
                        left: getCharacterPosition * 8 + 'rem',
                        transform: 'translateX(-50%)',
                    }
                } />
            <div 
                className='path-goal__progress-container'
                style={{ width: goals.length * 8 + 'rem' }} />
            <div className='path-goal__progress' style={{ width: (getIndexOfLastAchievedGoal + 1) * 8 + 'rem' }} />
            {
                goals.map((goal, index) => (
                    <div key={++index} id={goal.goalId} 
                        ref={getCharacterPosition === (index + 1) ? characterDiv : undefined}
                        className={`path-goal__station path-goal__station--${goal.type} ${goal.isAchieved ? 'path-goal__station--achieved' : ''}`}
                        style={
                            { left: ++index * 8 + 'rem' }
                        }
                        onClick={handleClick}>
                        {goal.index}
                    </div>
                ))
            }
 
            <div className="path-goal__path" />
        </div>
    )
}

export default PathGoal;