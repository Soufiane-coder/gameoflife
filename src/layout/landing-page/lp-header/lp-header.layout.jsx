import React from 'react';
import LPTitle from '../lp-title/lp-title.layout'
import './lp-header.style.scss';


const LPHeader = () => {
    return (
        <div className='header' >
            <div className='header__background-white' />
            <div className='header__triangle-white header__triangle-up-right' />
            <div className='header__triangle-white header__triangle-buttom-left' />
            <LPTitle />
        </div>
    )
}


export default LPHeader;