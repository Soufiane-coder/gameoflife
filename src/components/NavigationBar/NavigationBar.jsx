import React, { useState } from 'react'
import { ReactComponent as HomePageIcon } from '../../assets/icons/homepage.svg';
import { ReactComponent as GamePageIcon } from '../../assets/icons/gamepage.svg';
import { ReactComponent as SignInPageIcon } from '../../assets/icons/sign-in-page.svg';
import { ReactComponent as SignUpPageIcon } from '../../assets/icons/sign-up-page.svg';
import { ReactComponent as SettingPageIcon } from '../../assets/icons/settings.svg';
import { ReactComponent as ClockIcon } from '../../assets/icons/schedule.svg';
import { ReactComponent as StatisticsIcon } from '../../assets/icons/statistics.svg';
import { ReactComponent as CalendarIcon} from '../../assets/icons/calendar.svg';
import './NavigationBar.scss';
import { withRouter } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

const NavigationBar = ({ history, user,}) => {
    const [isNavOn, setIsNavOn] = useState(false);

    const menuSignedIn = [{
        label: 'home gol',
        icon: HomePageIcon,
        url: '/',
        action: () => { }
    }, {
        label: 'game field',
        icon: GamePageIcon,
        url: '/game-field',
        action: () => { }
    }, {
        label: 'clock view',
        icon: ClockIcon,
        url: '/clockView',
        action: () => { }
    }, {
        label: 'calendar',
        icon: CalendarIcon,
        url: '/calendar',
        action: () => { }
    },{
        label: 'statistics',
        icon: StatisticsIcon,
        url: '/statistics',
        action: () => { }
    }, {
        label: 'settings',
        icon: SettingPageIcon,
        url: '/settings',
        action: () => { }
    },

    ]

    const menuNotSignedIn = [{
        label: 'home gol',
        icon: HomePageIcon,
        url: '/',
        action: () => { }
    }, {
        label: 'game field',
        icon: GamePageIcon,
        url: '/game-field',
        action: () => { }
    }, {
        label: 'sign up',
        icon: SignUpPageIcon,
        url: '/signin',
        action: () => { },
    }, {
        label: 'sign in',
        icon: SignInPageIcon,
        url: '/signin',
        action: () => { },
    }
    ]
    return (
        <>
            <div className="navigation-bar">
                {
                    user ? menuSignedIn.map((item, key) => (

                        <item.icon key={key + '_in'} className='icon' onClick={() => { history.push(item.url); item.action() }} />

                    ))
                        :
                        menuNotSignedIn.map((item, key) => (

                            <item.icon key={key} className='icon' onClick={() => { history.push(item.url); item.action() }} />

                        ))
                }
            </div>
            <div className="navigation-burger-menu">
                <input type="checkbox" className="navigation-burger-menu__checkbox" id="navi-toggle" onChange={event => setIsNavOn(event.target.checked)} checked={isNavOn} />

                <label htmlFor="navi-toggle" className="navigation-burger-menu__button">
                    <span className="navigation-burger-menu__icon">&nbsp;</span>
                </label>

                <div className="navigation-burger-menu__background">&nbsp;</div>

                <nav className="navigation-burger-menu__nav">
                    <ul className="navigation-burger-menu__list">

                        {
                            user ? menuSignedIn.map((item, key) => (

                                <li className="navigation-burger-menu__item" key={key + '_in'}><div className="navigation-burger-menu__link" onClick={() => { history.push(item.url); setIsNavOn(false); item.action(); }} >{item.label}</div></li>
                            ))
                                :
                                menuNotSignedIn.map((item, key) => (

                                    <li className="navigation-burger-menu__item" key={key}><div className="navigation-burger-menu__link" onClick={() => { history.push(item.url); setIsNavOn(false); item.action(); }} >{item.label}</div></li>

                                ))
                        }

                    </ul>
                </nav>
            </div>
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser
})

// const mapDispatchToProps = (dispatch) => ({
//     setCurrentUser: (user) => dispatch(setCurrentUser(user)),
// });
export default withRouter(connect(mapStateToProps,)(NavigationBar));