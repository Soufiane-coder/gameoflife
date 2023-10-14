import './lp-gloabel-description.style.scss';
import { ReactComponent as ComplateRoutineUndraw } from '../../../assets/undraw/undraw_done_checking_re_6vyx.svg';
import { ReactComponent as CoinUndraw } from '../../../assets/undraw/undraw_savings_re_eq4w.svg'
import { ReactComponent as InspirationUndraw } from '../../../assets/undraw/undraw_video_game_night_8h8m.svg';
import { ReactComponent as TrainingUndraw } from '../../../assets/undraw/undraw_indoor_bike_pwa4.svg';
import {Fade, LightSpeed} from 'react-reveal';

const LPGlobalDescription = () => {
    return (
        <>
            <div className='complete-routine'>
                <div className='complete-routine__description'>
                    <h1 className='complete-routine__description-title lp-title'>Complete your routine</h1>
                    <p className='complete-routine__description-paragraph lp-description'>Our website offers a unique approach to organizing daily routines, with the aim of improving your life and increasing your efficiency at work.</p>
                </div>
                <ComplateRoutineUndraw className='complete-routine__undraw' />
            </div>

            <div className="lp-coins">
                <CoinUndraw className='lp-coins__undraw' />
                <div className='lp-coins__description-wrapper'>
                    <p className='lp-coins__title lp-title'>Earn coins</p>
                    <p className="lp-coins__description lp-description">You can input your daily tasks and earn coins for completing them. You can also skip a task using coins, which can be earned from completed routines.</p>
                </div>
            </div>
            <div className="lp-inspiration">
                <InspirationUndraw className='lp-inspiration__undraw' />
                <div className='lp-inspiration__description-wrapper'>
                    <p className='lp-inspiration__title lp-title'>Video Games inspired</p>
                    <p className="lp-inspiration__description lp-description">Inspired by video games, our approach is designed to keep you motivated to complete your daily routines.</p>
                </div>
            </div>

            <div className="lp-remember">
                <LightSpeed left delay={100}>
                    <h1 className='lp-remember__title'>Remember</h1>
                </LightSpeed>
                <div className="lp-remember__wrapper">
                    <TrainingUndraw className='lp-remember__undraw'/>
                    <Fade delay={200}>
                        <p className='lp-remember__section-description'>
                            every completed <span className='color-yellow'>task</span> brings you one step closer to achieving your <span className='color-red'>goals</span>. Keep up the <span className='color-green'>good</span> work and stay <span className='color-blue'>motivated</span>!
                        </p>
                    </Fade>
                </div>
            </div>
        </>
    )
}

export default LPGlobalDescription;