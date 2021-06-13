import React, { useRef, useContext } from 'react';
import emailpng from '../../../assets/register/email.png';
import keypng from '../../../assets/register/key.png';
import { Link } from 'react-router-dom';
import { loginCall } from "../../../apiCalls";
import { AuthContext } from "../../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import './signin.css';

const Signin = () => {

    const email = useRef();
    const password = useRef();
    const {isFetching, error, dispatch} = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({email: email.current.value, password: password.current.value}, dispatch);
    }

    return (
            <form className="br4 b--black-10 mv2 w-100 w-50-m w-30-l mw6 shadow-5 center" onSubmit={handleClick}>
                <main className="br4 pa4 black bg-white-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="center f3 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input
                                        className="shadow-5 f6 pa2 input-reset ba b--white-025 bg-transparent w-100"
                                        type="email"
                                        name="email-address"
                                        id="email-address"
                                        placeholder="Enter your Email"
                                        style={{background: `url(${emailpng}) no-repeat scroll 5px`, paddingLeft: '40px'}}
                                        ref={email}
                                        required
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                        className="shadow-5 f6 pa2 input-reset ba b--white-025 bg-transparent w-100"
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        style={{background: `url(${keypng}) no-repeat scroll 5px`, paddingLeft: '40px'}}
                                        ref={password}
                                        required
                                        minLength="8"
                                />
                            </div>
                        </fieldset>

                        {error &&
                            <div>
                                <p className="f3 red tc">Invalid email or password!</p>
                            </div>
                        }

                        <div>
                            <button className="b br4 w-100 pv2 input-reset ba b--black bg-black tracked dim pointer f5 db center white" type="submit"> {isFetching ? <CircularProgress color="primary" size="14px"/> : "LOGIN" } </button>
                        </div>
                        <div className="lh-copy mt2">
                            <Link to='/register' style={{textDecoration: 'none'}}>
                                <p className="mt4 f6 normal pointer link dim black tc">Don't have Account? <b>Sign up</b></p>
                            </Link>
                        </div>
                    </div>
                </main>
            </form>
    )
};


export default Signin;

