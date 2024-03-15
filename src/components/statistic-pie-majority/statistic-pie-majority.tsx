import React from 'react'
import { Pie } from 'react-chartjs-2'
import StatisticsType from '../../pages/statistics/statistics.type';
import RoutineType from '../../types/routine.type';
interface PropsType {
  routines: RoutineType[]
}

const StatisticPieMajority : React.FC<PropsType> = ({routines}) => {
    const data = {
        labels: routines.map(routine => `${routine.emoji} ${routine.title}`),
        datasets: [
          {
            label: 'Routine : ',
            data: routines.map(routine => routine.spentedTime.valueOf()),
            backgroundColor: routines.map(routine => routine.bgEmojiColor + '80'),
            borderColor: routines.map(routine => routine.bgEmojiColor),
            borderWidth: 1,
          },
        ],
      };
  return (
    <div className='statistics-pie-majority'>
      <Pie data={data}/>
    </div>
  )
}

export default StatisticPieMajority
