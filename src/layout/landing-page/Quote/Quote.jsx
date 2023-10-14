import React from 'react';

import './Quote.scss';
import Fade from 'react-reveal/Fade';

const Quote = () => (
    <div className="quote-section">

        <div className='background-oval' />
        <div className="rectangle-green-up-right" />
        <div className="rectangle-green-down-left" />
        <Fade bottom>
            <div className="container-quote">
                <p className='quote'>"You only live once, but if you do it right, once is enough."</p>
                <p className='quoter'>― Mae West</p>
            </div>
        </Fade>
    </div>
)


export default Quote;