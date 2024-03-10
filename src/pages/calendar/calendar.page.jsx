import './calendar.style.scss';
import { connect } from "react-redux";
import { selectCurrentRoutines } from "../../redux/routines/routines.selector";
import { createStructuredSelector } from "reselect";
import { getTodayName } from '../../utils';

const CalendarPage = ({routines}) => {
  const weeksdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  routines = routines?.filter(routine => !routine.isArchived)
  const todayName = getTodayName()
  return (
    <section className='calendar-page'>
      <ul className='calendar-page__weeksdays'>
        {weeksdays.map((day, index) => (
          <li kay={index} className={`calendar-page__weeksday ${day === todayName ? 'calendar-page__weeksday--selected' : ''}`}>{day}</li>
        ))}

        {
          weeksdays.map((dayName, index) => (
            <li key={index} className={`calendar-page__day ${dayName === todayName ? 'calendar-page__day--selected' : ''}`}>
            {
              routines?.filter(routine => 
                (routine.days === undefined || routine.days.includes(dayName) || routine.days.includes('every-day'))).map(routine => (
                  <div className='calendar-page__item' style={{backgroundColor: routine.bgEmojiColor}}>
                    <span className='calendar-page__item-emoji'>{routine.emoji}</span>
                    <p className='calendar-page__item-title'>{routine.title}</p>
                  </div>
                ))
            }</li>
          ))
        }
        {/* <li className='calendar-page__day calendar-page__monday'>Monday</li>
        <li className='calendar-page__day calendar-page__tuesday'>Tuesday</li>
        <li className='calendar-page__day calendar-page__wednesday'>Wednesday</li>
        <li className='calendar-page__day calendar-page__thursday'>Thursday</li>
        <li className='calendar-page__day calendar-page__friday'>Friday</li>
        <li className='calendar-page__day calendar-page__saturday'>Saturday</li>
        <li className='calendar-page__day calendar-page__sunday'>Sunday</li> */}
      </ul>


    </section>
  );
}

const mapStateToProps = createStructuredSelector({
	routines: selectCurrentRoutines,
})
export default connect(mapStateToProps)(CalendarPage);
