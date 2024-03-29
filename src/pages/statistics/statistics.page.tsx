import './statistics.style.scss';
import PageHeader from '../../components/PageHeader/page-header';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getStatisticsFromFirebase } from '../../../lib/firebase'
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { createStructuredSelector } from 'reselect';
import { isYesterday, isToday, fillMissingDates} from './utils'
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';
import StatisticsType from './statistics.type'
import UserType from '../../types/user.type';
import RoutineType from '../../types/routine.type';
import React from 'react'
import LoadingRoutine from '../../components/loading-routine/loading-routine.component';
import StatisticPieMajority from '../../components/statistic-pie-majority/statistic-pie-majority';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const StatisticsPage : React.FC<{user: UserType, routines: RoutineType[]}> = ({user, routines,}) =>  {
    const [last30DaysStatistics, setLast30DaysStatistics] = useState<StatisticsType[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            let newStatistics : any = await getStatisticsFromFirebase(user.uid)
            newStatistics = fillMissingDates(newStatistics)
            setLast30DaysStatistics(newStatistics)
        })()
    }, [])

    useEffect(() => {
        if(routines){
            setIsLoading(false)
        }
    }, [routines])

    const unarchivedRoutines = useMemo(() => {
        if (routines){
            return  routines.reduce((acc, routine) => !routine.isArchived ? acc + 1: acc, 0)
        }
        return 0
    }, [routines])

    const average = useMemo(() => {
        if(last30DaysStatistics) {
            return last30DaysStatistics.reduce(
                (acc, statistic) => acc + statistic.routinesChecked.length, 0) / last30DaysStatistics.length
        }
        return 0;
    }, [last30DaysStatistics])


    const data = useMemo(() => {
        if(last30DaysStatistics) {

            return {
                labels: last30DaysStatistics.map(
                    statistic => (isYesterday(statistic.day) ? 'yesterday' : 
                    (isToday(statistic.day) ? 'today' : statistic.day))),
                datasets: [{
                    label: 'Your accomplished routines',
                    data: last30DaysStatistics.map(statistic => statistic.routinesChecked.length),
                    fill: false,
                    borderColor: '#009245',
                    },
                    {
                        label: 'All unarchieved routines',
                        data: last30DaysStatistics.map(() => unarchivedRoutines),
                        fill: true,
                        backgroundColor: '#FDC8301F',
                        borderColor: '#FDC830',
                        hidden: true,
                    },
                    {
                        label: 'Average checked routines',
                        data: last30DaysStatistics.map(() => average),
                        fill: true,
                        backgroundColor: '#43BEED1F',
                        borderColor: '#43BEED',
                        hidden: true,
                    },
                ]
            };
        }
        return {};
    }, [last30DaysStatistics])

    const options = useMemo(() => {
        if (last30DaysStatistics){
            return {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        // position: 'left',
                    },
                    title: {
                        display: true,
                        text: 'Chart of progression',
                    },
                },
                scales: {
                    y: {
                        display: true,
                        suggestedMin: 0,
                        // suggestedMax: last30DaysStatistics.reduce((acc, statistic) => 
                        //     Math.max(statistic.routinesChecked.length, acc), 0), // max check routines * 2 to view it in the chart
                        suggestedMax : Math.max(unarchivedRoutines,
                            last30DaysStatistics.reduce((acc, statistic) => 
                            Math.max(statistic.routinesChecked.length, acc), 0)),
                        ticks: {
                            stepSize: 1 // Set step size to 1 to display one by one
                        },
                        title: {
                            display: true,
                            text: 'All routines',
                        },
                    },
                },
            };
        }

        return {}
    }, [last30DaysStatistics])

    if (isLoading){
        return <LoadingRoutine/>
    }
    return (
        <>
            <PageHeader title={'Statistics'} />
            <div className='statistics-page' >
                <div className="statistics-page__30days-progession">
                    <Line className='' options={options} data={data} />
                </div>
                <StatisticPieMajority routines={routines}/>
            </div>
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines
})

// const mapStateToProps = createStructuredSelector({
//     user: selectCurrentUser,
//     routines: selectCurrentRoutines
// })


export default connect(mapStateToProps)(StatisticsPage);