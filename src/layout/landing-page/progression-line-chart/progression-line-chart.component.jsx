import './progression-line-chart.style.scss';
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

import { Fade } from 'react-reveal';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

const ProgressionLineChart = () => {

    const data = {
        labels: [1,2,3,4,5,6,7,8,9,'...'].map(dayNumber => 'day ' + dayNumber),
        datasets: [{
          label: 'progression is 1% better every day',
          data: [1, 2.71828182846, 7.38905609893, 20.0855369232, 54.5981500331, 148.413159103, 403.428793493, 1096.63315843, 2980.95798704 ,8103.08392758],
          fill: false,
          borderColor: '#009245',
          tension: .3,
        },
        {
            label: 'what do you think progression is',
            data: [0,300,600,900,1200,1500,1800,2100, 2400, 2700,3000],
            fill: false,
            borderColor: '#EA3117',
            tension: 0,
          }]
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
            display: false,
          },
        },
      };
    return (
        <section className="progression-line-chart">
            <div className="progression-line-chart__wrapper">
                <h1 className='progression-line-chart__title lp-title'>Small Changes, Big Outcomes: Harnessing the Power of Exponential Growth</h1>
                <p className='progression-line-chart__description lp-description'>Small changes often appear to make no difference until you cross a critical threshold. The most powerful outcomes of any compounding process are delayed. You need to be patient.</p>
            </div>
            <Line className='progression-line-chart__chart' options={options} data={data}/>
        </section>
    )
}

export default ProgressionLineChart;
