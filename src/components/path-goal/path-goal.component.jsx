import Goku from '../../assets/badjets/goku_0-stand.gif';

const PathGoal = ({ goals, setGoal, getIndexOfLastAchievedGoal }) => {
    const handleClick = (event) => {
        const { id } = event.target.closest('.road-map__station');
        const searchedGoal = goals.find(goal => goal.goalId === id);
        console.log(searchedGoal)
        setGoal(searchedGoal);
    }

    const getCharacterPosition = (getIndexOfLastAchievedGoal ? getIndexOfLastAchievedGoal : 0) + 1;
    return (
        <div className="road-map__container">
            <img src={Goku} alt="" className="road-map__character"
                style={
                    {
                        left: getCharacterPosition * 8 + 'rem',
                        transform: 'translateX(-50%)',
                    }
                } />
            <div className='road-map__progress-container' style={{ width: goals.length * 8 + 'rem' }} />
            <div className='road-map__progress' style={{ width: (getIndexOfLastAchievedGoal + 1) * 8 + 'rem' }} />
            {
                goals.map((goal, index) => (
                    <div key={++index} id={goal.goalId}
                        className={`road-map__station road-map__station--${goal.type} ${goal.isAchieved ? 'road-map__station--achieved' : ''}`}
                        style={
                            { left: ++index * 8 + 'rem' }
                        }
                        onClick={handleClick}>
                        {goal.index}
                    </div>
                ))
            }
            <div className="road-map__path" />
        </div>
    )
}

export default PathGoal;