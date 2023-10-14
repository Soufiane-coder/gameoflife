import React, { useContext } from 'react';
import './LandingPage.scss'
import LPHeader from '../../layout/landing-page/lp-header/lp-header.layout'
import Quote from '../../layout/landing-page/Quote/Quote';
import LPGlobalDescription from '../../layout/landing-page/lp-global-description/lp-global-description.layout';
import Footer from '../../layout/landing-page/Footer/Footer';
import ProgressionLineChart from '../../layout/landing-page/progression-line-chart/progression-line-chart.component';

const LandingPage = () => {

    return (
        <div className="container">
            <LPHeader />
            <Quote />
            <LPGlobalDescription />
            <ProgressionLineChart/>
            <Footer />
        </div>
    )
}

export default LandingPage;