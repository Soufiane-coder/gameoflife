import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './slide-routine.style.scss';
import { sortArrayByStartTime, hourMinFormat, getRoutineIndexInTime } from './utils';
import Routine from '../Routine/Routine';
import { useRef } from 'react';

const SlideItem = ({ currentRoutine }) => {
    return (
        <div className="slide__each-slide-effect">
            <Routine routine={currentRoutine} />
        </div>
    )
}

const SlideRoutine = ({ routines, selectedRoutine }) => {
    const sortedRoutines = sortArrayByStartTime(routines);
    const index = getRoutineIndexInTime(sortedRoutines, hourMinFormat());
    const slideRef = useRef(null)

    if (selectedRoutine !== '-2') slideRef.current.goTo(sortedRoutines.findIndex(routine => routine.routineId === selectedRoutine))

    const slideProperites = {
        indicators: true,
        autoplay: false,
        transitionDuration: 500,
        defaultIndex: index === -1 ? sortedRoutines.length : index,
    }

    return (
        <div className="slide">
            <Slide  {...slideProperites} ref={slideRef}>
                {
                    sortedRoutines.map((currentRoutine, key) => (<SlideItem {...{ key, currentRoutine }} />))
                }
                {
                    <div className="slide__each-slide-effect">
                        <h1>There is no routine in this time</h1>
                    </div>
                }
            </Slide>
        </div>
    )
}

export default SlideRoutine;