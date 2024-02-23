import "./App.scss";
import { Switch, Route, Redirect } from "react-router-dom";

import LandingPage from "./pages/landing-page/LandingPage";
import SignInAndSignUp from "./pages/SignInAndSignUp/SignInAndSignUp";
import GameField from "./pages/GameField/GameField";
import Setting from "./pages/setting/setting.page";
import ClockView from "./pages/ClockView/ClockView";
import RoadMap from "./pages/roadMap/road-map";
import StatisticsPage from "./pages/statistics/statistics.page";

import PopupField from "./layout/popup-field/popup-field.layout";

import NavigationBar from "./components/NavigationBar/NavigationBar";
import UserBar from "./components/UserBar/UserBar";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "./redux/user/user.selector";
import { selectCurrentDisplayMode } from "./redux/display-mode/display-mode.selector";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserData } from "../lib/firebase";
import UserLoader from "./layout/user-loader/user-loader.layout";
import { selectCurrentRoutines } from "./redux/routines/routines.selector";
import { createContext, createRef, useEffect, useState } from "react";
import { getRoutinesFromFirebase, getCategories, } from "../lib/firebase";
import { setCurrentRoutines } from "./redux/routines/routines.actions";
import { setCurrentUser } from "./redux/user/user.actions";
import { initialProtocol } from "./utils";
import NotificationSystem from 'react-notification-system';
import { setCurrentCategories } from "./redux/categories/categories.actions";
import GoogleAd from "./components/google-ad/google-ad.component";
import { message } from 'antd';

export const NotficationContext = createContext();
export const ContextHolderMessage = createContext();

const App = ({ 
    user, 
    displayMode, 
    routines, 
    setCurrentRoutines, 
    setCurrentUser,
    setCurrentCategories }) => {
    const [userImp, userLoading, userError] = useAuthState(auth);

    // Adding this state so we can fill the gap between userImp has been finished
    //and getting the user's informations from firebase
    const [userFromFirebaseLoading, setUserFromFirebaseLoading] = useState(true);
    const notificationSystem = createRef()
    const [messageApi, contextHolder] = message.useMessage();
    
    
    useEffect(() => {
        (async () => {
            if (user && !routines) {
                // so we can make sure that our users firebase is the one that has been uploaded
                if (!user.lastVisit?.toDate) return;
                setUserFromFirebaseLoading(false);

                let categories = await getCategories(user.uid)
                setCurrentCategories(categories)

                let routines = await getRoutinesFromFirebase(user.uid)
                routines = await initialProtocol(user, routines);
                setCurrentRoutines(routines)
            }
        })()
    }, [user]);

    useEffect(() => {
        (async () => {
            if (userImp) {
                try {
                    const user = await getUserData(userImp)
                    setCurrentUser(user);
                } catch (error) {
                    console.log('notification: error accured', error)
                }
            }
            // this condition avoid the initialization of userImp state so when userLoading is true we wait until it is done
            else if (!userLoading) {
                setUserFromFirebaseLoading(false);
            }
        })()
    }, [userImp, userLoading])

    


    const style = {
        NotificationItem: { // Override the notification item
            DefaultStyle: { // Applied to every notification, regardless of the notification level
                fontSize: '2rem',
                width: '40rem',
                zIndex: '110'
            },
        },
        Title: {
            DefaultStyle: {
                fontSize: '2rem',
            }
        },
        MessageWrapper: {
            DefaultStyle: {
                margin: '5px',
            }
        }
    }

    return (
        <>
            <div id={displayMode}>
            {contextHolder}
            <ContextHolderMessage.Provider value={messageApi}>
                {/* <GoogleAd/> */}
                <NotficationContext.Provider value={{ notificationSystem }}>
                    {
                        user ? <PopupField /> : ''
                    }

                    {
                        userLoading || userFromFirebaseLoading ? null : <NavigationBar />
                    }

                    <NotificationSystem ref={notificationSystem} style={style} />
                    <Switch>

                        <Route exact={true} path="/signin">
                            {!user ? (
                                <SignInAndSignUp />
                            ) : (
                                <Redirect to="/game-field" />
                            )}
                        </Route>
                        <Route exact={true} path="/">
                            <LandingPage />
                        </Route>
                        {
                            userLoading || userFromFirebaseLoading ?
                                <UserLoader /> :
                                <>
                                    <UserBar user={user} />
                                    <Route exact={true} path="/clockView">
                                        {user ?
                                            <ClockView />
                                            :
                                            <Redirect to="/signin" />}
                                    </Route>
                                    <Route exact={true} path='/game-field'>
                                        {user ?
                                            <GameField />
                                            :
                                            <Redirect to="/signin" />}
                                    </Route>
                                    <Route exact={true} path="/statistics">
                                        {user ?
                                            <>
                                                <StatisticsPage />
                                            </>
                                            :
                                            <Redirect to="/signin" />}
                                    </Route>
                                    <Route path="/settings" component={Setting} />
                                    <Route path='/road-map/:routineId'>
                                        {user ?
                                            <RoadMap />
                                            :
                                            <Redirect to="/signin" />}
                                    </Route>
                                </>
                        }
                        <Route exact={true} path="*">
                            <div style={{ fontSize: "200px" }}>not found</div>
                        </Route>
                    </Switch>
                </NotficationContext.Provider>
                </ContextHolderMessage.Provider>
            </div>
        </>

    );
}

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
    displayMode: selectCurrentDisplayMode,
    routines: selectCurrentRoutines
});

const mapDispatchToProps = dispatch => ({
    setCurrentRoutines: routines => dispatch(setCurrentRoutines(routines)),
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    setCurrentCategories: categories => dispatch(setCurrentCategories(categories)),
})
export default connect(mapStateToProps, mapDispatchToProps)(App);

