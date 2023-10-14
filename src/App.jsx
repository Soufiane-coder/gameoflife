import "./App.scss";
import { Switch, Route, Redirect } from "react-router-dom";

import LandingPage from "./pages/landing-page/LandingPage";
import SignInAndSignUp from "./pages/SignInAndSignUp/SignInAndSignUp";
import GameField from "./pages/GameField/GameField";
import Setting from "./pages/Setting/Setting";
import ClockView from "./pages/ClockView/ClockView";
import RoadMap from "./pages/roadMap/road-map";
import StatisticsPage from "./pages/Statistics/statistics.page";

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
import { createContext, createRef, useEffect , useState} from "react";
import { getRoutines } from "../lib/firebase";
import { setCurrentRoutines } from "./redux/routines/routines.actions";
import { setCurrentUser } from "./redux/user/user.actions";
import { initialProtocol } from "./utils";
import NotificationSystem from 'react-notification-system';

export const MyContext = createContext();
const App = ({ user, displayMode, routines, setCurrentRoutines, setCurrentUser }) => {
    const [userImp, userLoading, userError] = useAuthState(auth);

    // Adding this state so we can fill the gap between userImp has been finished
    //and getting the user's informations from firebase
    const [userFromFirebaseLoading, setUserFromFirebaseLoading] = useState(true);
    const notificationSystem = createRef()

    useEffect(() => {
        (async () => {
            if (user && !routines) {
                // so we can make sure that our users firebase is the one that has been uploaded
                if(!user.lastVisit?.toDate) return;
                setUserFromFirebaseLoading(false);
                let routines = await getRoutines(user.uid)
                routines = await initialProtocol(user, routines);
                setCurrentRoutines(routines);
            }
        })()
    }, [user]);

    useEffect(() => {
        (async () => {
            if (userImp) {
                try{
                    const user = await getUserData(userImp)
                    setCurrentUser(user);
                }catch(error){
                    console.log('notification: error accured', error)
                }
            }
            // this condition avoid the initialization of userImp state so when userLoading is true we wait until it is done
            else if(!userLoading){ 
                setUserFromFirebaseLoading(false);
            }
        })()
    }, [userImp,])

    
    const style = {
        NotificationItem: { // Override the notification item
          DefaultStyle: { // Applied to every notification, regardless of the notification level
            fontSize: '2rem',
            width: '40rem',
          },
        },
        Title: {
            DefaultStyle: {
                fontSize: '2rem',
            }
        },
        MessageWrapper:{
            DefaultStyle: {
                margin: '5px',
            }
        }
      }

    return (
        <MyContext.Provider id={displayMode} value={{notificationSystem}}>
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
                        <Redirect to="/gameField" />
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
                            <Route exact={true} path='/gameField'>
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
        </MyContext.Provider>
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
})
export default connect(mapStateToProps, mapDispatchToProps)(App);

