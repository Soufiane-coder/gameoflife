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
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { createStructuredSelector } from 'reselect';
import { isYesterday, isToday, fillMissingDates} from './utils'
import { selectCurrentRoutines } from '../../redux/routines/routines.selector';

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

const StatisticsPage = ({user, routines,}) => {
    const [last30DaysStatistics, setLast30DaysStatistics] = useState([{day: '', routinesChecked: []}])

    useEffect(() => {
        (async () => {
            let newStatistics = await getStatisticsFromFirebase(user.uid)
            newStatistics = fillMissingDates(newStatistics)
            setLast30DaysStatistics(newStatistics)
        })()
    }, [])

    const unarchivedRoutines = routines.reduce((acc, routine) => !routine.isArchived ? acc + 1: acc, 0)
    const average = last30DaysStatistics
        .reduce((acc, statistic) => acc + statistic.routinesChecked.length, 0) / last30DaysStatistics.length

    const data = {
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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
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
    
    return (
        <div className='statistics-page' >
            <PageHeader title={'Statistics'} />
            <div className="statistics-page__30days-progession">
                <Line className='' options={options} data={data} />
            </div>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
    routines: selectCurrentRoutines
})

export default connect(mapStateToProps)(StatisticsPage);