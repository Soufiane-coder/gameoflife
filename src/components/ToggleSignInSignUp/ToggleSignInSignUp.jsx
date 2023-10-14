import React from "react";
import './ToggleSignInSignUp.scss';

const ToggleSignInSignUp = ({ hidden, setHidden }) => (
    <div className="toggle-sign-in-sign-up" onClick={() => setHidden(!hidden)}>
        <span className="is-sign-in"
            style={
                {
                    color: `${hidden ? '#009245' : '#383838'}`,
                    borderBottom: `3px solid ${hidden ? '#009245' : '#383838'}`
                }}
        >Sign in</span>
        <span className="is-sign-up"
            style={
                {
                    color: `${hidden ? '#383838' : '#009245'}`,
                    borderBottom: `3px solid ${hidden ? '#383838' : '#009245'}`
                }}
        >Sign up</span>
    </div>
)

export default ToggleSignInSignUp;