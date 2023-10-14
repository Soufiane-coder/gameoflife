import React, { useEffect } from "react";
import "./Setting.scss";
import DisplayModeSwitcher from '../../components/DisplayModeSwitcher/DisplayModeSwitcher';

import { Route , Link} from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {selectCurrentUser } from '../../redux/user/user.selector';
import LogoGOL from '../../assets/clipart/game_of_life_clipart.svg';
import {setCurrentUser} from '../../redux/user/user.actions';
import {signUserOutFromFirebase} from '../../../lib/firebase';

const Setting = ({user, history, location: {pathname}, setCurrentUser,}) => {
    useEffect(()=> {
        if(pathname === '/settings'){
            history.push('/settings/profile')
        }
    })
    const handleSignOut = async () => {
        try{
            await signUserOutFromFirebase();
            setCurrentUser()
            history.push('/')
        }
        catch(err){
            console.error(err);
        }
    }
        return (
            <>
                
                <div className="settings">
                    <nav className="settings__nav-bar">
                        <img src={LogoGOL} alt="" className="settings__logo-img" />
                        <Link to='/settings/profile'  
                            className={`settings__nav-bar-item ${pathname === '/settings/profile' ? "settings__nav-bar-item--selected" : ""}`} >Profile</Link>
                        <Link to='/settings/appearance'
                            className={`settings__nav-bar-item ${pathname === '/settings/appearance' ? "settings__nav-bar-item--selected" : ""}`}>Appearance</Link>
                    </nav>
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
    });

export default connect(mapStateToProps, mapDispatchToProps)(Setting);