import { useState} from 'react';
import './SignIn.scss';
import { setCurrentUser } from '../../../redux/user/user.actions';
import { connect } from 'react-redux';
import { signUserInWithGoogle, signUserInWithEmail, getUserData } from '../../../../lib/firebase';



const SignIn = ({ hidden, setCurrentUser }) => {
    const [formule, setFormule] = useState({ email: '', password: '', message: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormule(old => ({ ...old, message: '', [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = formule;
        try {
            const userImpl = await signUserInWithEmail(email, password);
            const userData = await getUserData(userImpl);
            setCurrentUser(userData);
        } catch (error) {
            console.dir(error);
            setFormule(old => ({ ...old, message: error.message }))
        }
    }

    const handleSignInWithGoogle = async (event) => {
        event.preventDefault();
        const userImp = await signUserInWithGoogle();
        const user = await getUserData(userImp);
        setCurrentUser(user);
    }


    return (
        <div className={`sign-in-container  ${hidden ? "hidden" : ""}`} >

            <form className="sign-in-container__card" onSubmit={handleSubmit}>
                <h1 className="sign-in-container__title">Sign In</h1>
                <div className="sign-in-container__inputBox">
                    <input type="text" name="email" value={formule.email} required onChange={handleChange} />
                    <span className="sign-in-container__email">Email</span>
                </div>

                <div className="sign-in-container__inputBox">
                    <input type="password" name="password" value={formule.password} required onChange={handleChange} />
                    <span className="sign-in-container__password">Password</span>
                </div>
                <p className='sign-in-container__message'>{formule.message}</p>
                <button className="sign-in-container__sign-in-button">Sign in</button>

                <button className="sign-in-container__with-google" onClick={handleSignInWithGoogle}>
                    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                    Continue with Google
                </button>
            </form>

        </div >
    )


}

const mapDispatchToProps = (dispatch) => ({
    setCurrentUser: (user) => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(SignIn);