import './ClockContainer.scss';
import { beginningOfHourToDegrees, hoursToDegrees } from '../../utils/clock';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getAllTimes } from './utils';
import ReactClock from '@uiw/react-clock';
import SlideRoutine from '../slide-routine/slide-routine.component';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ClockContainer = ({ routines, am = false, pm = false, }) => {
    const [selectedRoutine, setSelectedRoutine] = useState('-2');
    const ids = getAllTimes(routines, am, pm).map(item => item.id);

    const data = {
        labels: getAllTimes(routines, am, pm).map(hour => hour.label),
        datasets: [
            {
                label: 'routine',
                data: getAllTimes(routines, am, pm).map(hour => hour.hours),
                backgroundColor: getAllTimes(routines, am, pm).map(hour => hour.bgEmojiColor),
                borderColor: getAllTimes(routines, am, pm).map(hour => hour.bgEmojiColor),
                borderWidth: 1,
                cutout: '95%',
            },
        ],
    };
    return (
        <section className=''>
            <div className={`clock-container ${am ? 'am' : 'pm'}`}>
                <Doughnut className='clock-container__doughnut-timer' data={data} options={
                    {
                        onClick: (_, element) => {
                            if (element.length === 0) return;
                            setSelectedRoutine(ids[element[0].index]);
                        },
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },

                    }
                } />

                <ReactClock className="clock-container__analoge-clock" />

            </div>
            <SlideRoutine {...{ routines, selectedRoutine }} />
        </section>

    )
}

export default ClockContainer;