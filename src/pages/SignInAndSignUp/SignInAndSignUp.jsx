import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignIn from "../../layout/sign-in-and-sign-out/SignIn/SignIn";
import SignUp from "../../layout/sign-in-and-sign-out/SignUp/SignUp";
import { ReactComponent as UndrawMobileImage } from "../../assets/undraw/undraw_access_account_re_8spm.svg";
import ToggleSignInSignUp from "../../components/ToggleSignInSignUp/ToggleSignInSignUp";
import Flip from 'react-reveal/Flip';
import './SignInAndSignUp.scss';


const SignInAndSignUp = () => {
    const [hidden, setHidden] = useState(true);

    return (
        <>
            <div className="log-in-log-out">
                <div className="side-bar" />
                <div className="side-bar-dark" />
                {/* <Flip bottom>
                    <UndrawMobileImage />
                </Flip> */}
                <section className="form-section">
                    <ToggleSignInSignUp {...{ hidden, setHidden }} />

                    <SignIn hidden={!hidden} />

                    <SignUp hidden={hidden} />

                </section>
            </div>
        </>
    )
}



export default SignInAndSignUp;