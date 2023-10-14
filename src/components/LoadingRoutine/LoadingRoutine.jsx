import React from 'react';
import './LoadingRoutine.scss';

const LoadingRoutine = () => {
    return (

        <div className="loading-routine ">
            <div className="emoji-bg"></div>
            <div className="loading-routine__skeleton emoji"></div>
            <div className="loading-routine__skeleton title"></div>
            <div className="loading-routine__skeleton description"></div>
            <div className="extra">
            </div>
            <div className="buttons">
                <button className="loading-routine__skeleton btn"></button>
                <button className="loading-routine__skeleton btn"></button>
                <button className="loading-routine__skeleton btn"></button>
                <button className="loading-routine__skeleton btn"></button>
            </div>
        </div>

    )

}


export default LoadingRoutine;