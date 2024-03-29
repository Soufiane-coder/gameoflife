import React, { useEffect } from "react";
import "./setting.style.scss";
import DisplayModeSwitcher from '../../components/DisplayModeSwitcher/DisplayModeSwitcher';

import { Route , Link} from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {selectCurrentUser } from '../../redux/user/user.selector';

import {setCurrentUser} from '../../redux/user/user.actions';
import { setCurrentRoutines } from "../../redux/routines/routines.actions";
import {signUserOutFromFirebase} from '../../../lib/firebase';
import SettingSidebar from "../../layout/setting/setting-sidebar/setting-sidebar.component";


const Setting = ({user, history, location: {pathname}, setCurrentUser,setCurrentRoutines,}) => {
    useEffect(()=> {
        if(pathname === '/settings'){
            history.push('/settings/profile')
        }
    })
    const handleSignOut = async () => {
        try{
            await signUserOutFromFirebase();
            setCurrentUser(null)
            setCurrentRoutines(null)
            history.push('/')
        }
        catch(err){
            console.error(err);
        }
    }
        return (
            <>
                <div className="settings">
                    <SettingSidebar/>
                    {/* <nav className="settings__nav-bar">
                        <img src={LogoGOL} alt="" className="settings__logo-img" />
                        <Link to='/settings/profile'  
                            className={`settings__nav-bar-item ${pathname === '/settings/profile' ? "settings__nav-bar-item--selected" : ""}`} >Profile</Link>
                        <Link to='/settings/appearance'
                            className={`settings__nav-bar-item ${pathname === '/settings/appearance' ? "settings__nav-bar-item--selected" : ""}`}>Appearance</Link>
                    </nav>*/}
                    <main className="settings__dashboard">
                        <Route exact path="/settings/profile">
                            <h1 className="settings__title">Profile</h1>
                            <ul className="settings__setting-list">
                                <li className="settings__setting-item">
                                    <label className="settings__setting-label">Username</label>
                                    <p>{user.displayName}</p>
                                </li>
                            </ul>
                            <ul className="settings__setting-list">
                                <li className="settings__setting-item">
                                    <button onClick={handleSignOut}>sign out</button>
                                </li>
                            </ul>
                        </Route>
                        <Route exact path="/settings/appearance">
                            <h1 className="settings__title">Appearance</h1>
                            <ul className="settings__setting-list">
                                <li className="settings__setting-item">
                                    <label className="settings__setting-label" htmlFor="display-mode-switcher">Display mode</label>
                                    <DisplayModeSwitcher/>
                                </li>
                            </ul>
                        </Route>
                    </main> 
                </div>
            </>
        );
    }

    const mapStateToProps = createStructuredSelector({
        user: selectCurrentUser
    })

    const mapDispatchToProps = (dispatch) => ({
        setCurrentUser: (user) => dispatch(setCurrentUser(user)),
        setCurrentRoutines: (routines) => dispatch(setCurrentRoutines(routines))
    });

export default connect(mapStateToProps, mapDispatchToProps)(Setting);