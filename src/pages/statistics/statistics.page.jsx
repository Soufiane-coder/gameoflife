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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const statistics = [
    {
        day: '16-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
            '43YCFu7m5eJLcjpoNT92',
            '6Mc3JsLrCTkiOU0yzaiK',
            
        ],
    }, 
    {
        day: '17-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
            '43YCFu7m5eJLcjpoNT92',
            '6Mc3JsLrCTkiOU0yzaiK',
            'CXXKf3YRsnnuU9IGjHyS',
            'XcMFZqtxTy4lnYpDW8aP',
        ],
    },
    {
        day: '18-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
            '43YCFu7m5eJLcjpoNT92',
            '6Mc3JsLrCTkiOU0yzaiK',
            'CXXKf3YRsnnuU9IGjHyS',
        ],
    },
    {
        day: '19-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
            '43YCFu7m5eJLcjpoNT92',
            '6Mc3JsLrCTkiOU0yzaiK',
            'CXXKf3YRsnnuU9IGjHyS',
        ],
    },
    {
        day: '20-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
            '43YCFu7m5eJLcjpoNT92',
            '6Mc3JsLrCTkiOU0yzaiK',
            'CXXKf3YRsnnuU9IGjHyS',
            'HEvEMb1pEOoHiHJ5Aigc',

        ],
    },
    {
        day: '21-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
        ],
    },
    {
        day: '22-01-2024',
        routinesChecked: [
            '50MOf1STLRGZ25krewPk',
            '43YCFu7m5eJLcjpoNT92',
            'CXXKf3YRsnnuU9IGjHyS',
            'HEvEMb1pEOoHiHJ5Aigc',
            'HVu9m11WaxMbUkpMV5Rg',
        ],
    },
    {
        day: '23-01-2024',
        routinesChecked: [
            'HEvEMb1pEOoHiHJ5Aigc',
            'HVu9m11WaxMbUkpMV5Rg',
            'Hpmip2s12SrHbC4uJfCD',
            'M5ZrusDoYsvuc0AoyOqj',
            'XcMFZqtxTy4lnYpDW8aP',
        ],
    },
    {
        day: '24-01-2024',
        routinesChecked: [
            'CXXKf3YRsnnuU9IGjHyS',
            'HEvEMb1pEOoHiHJ5Aigc',
            'HVu9m11WaxMbUkpMV5Rg',
            'Hpmip2s12SrHbC4uJfCD',
        ],
    },
]


const StatisticsPage = () => {
    const data = {
        labels: statistics.map(statistic => statistic.day),
        datasets: [{
            label: 'Your pregression in checking routines',
            data: statistics.map(statistic => statistic.routinesChecked.length),
            fill: false,
            borderColor: '#009245',
            // tension: .3,
        },
        ]
        // {
        //     label: 'what do you think progression is',
        //     data: [0,300,600,900,1200,1500,1800,2100, 2400, 2700,3000],
        //     fill: false,
        //     borderColor: '#EA3117',
        //     tension: 0,
        //   }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
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
                suggestedMax: statistics.reduce((acc, statistic) => 
                Math.max(statistic.routinesChecked.length, acc), 0) + 3, // max check routines * 2 to view it in the chart
                title: {
                    display: true,
                    text: 'All routines'
                },
            },
        },
    };
    return (
        <div className='statistics-page' >
            <PageHeader title={'Statistics'} />
            <div className="statistics-page__30days-progession" style={{width: '70rem'}}>
                <Line className='' options={options} data={data} />
            </div>
        </div>
    )
}

export default StatisticsPage;