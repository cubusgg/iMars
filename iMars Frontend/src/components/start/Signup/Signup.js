import React, { useRef } from 'react';
import emailpng from '../../../assets/register/email.png';
import keypng from '../../../assets/register/key.png';
import namepng from '../../../assets/register/name.png';
import datepng from '../../../assets/register/date.png';

import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import './signup.css';


const Signup = () => {

    // eslint-disable-next-line no-extend-native
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const name = useRef();
    const lastname = useRef();
    const dateofbirth = useRef();
    const email = useRef();
    const password = useRef();
    const history = useHistory();

    const handleClick = async (e) => {
        e.preventDefault();
        const user = {
            name: capitalize(name.current.value),
            lastname: capitalize(lastname.current.value),
            email: email.current.value,
            password: password.current.value,
            date_of_birth: dateofbirth.current.value,
        };

        try {
            await axios.post("/register", user);
            await swal("Good job!", "You signed up!", "success");
            history.push('/login');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="br4 b--black-10 mv2 w-100 w-50-m w-30-l mw6 shadow-5 center" onSubmit={handleClick}>
            <main className="br4 pa4 black bg-white-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="center f3 fw6 ph0 mh0">Sign Up</legend>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6">First Name</label>
                            <input className="shadow-5 f6 pa2 input-reset ba b--white-025 bg-transparent w-100"
                                   type="text"
                                   name="firstname" id="firstname"
                                   placeholder="Enter your First Name"
                                   style={{background: `url(${namepng}) no-repeat scroll 5px`, paddingLeft: '40px'}}
                                   ref={name}
                                   required
                            />
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6">Last Name</label>
                            <input className="shadow-5 f6 pa2 input-reset ba b--white-025 bg-transparent w-100"
                                   type="text"
                                   name="lastname" id="lastname"
                                   placeholder="Enter your Last Name"
                                   style={{background: `url(${namepng}) no-repeat scroll 5px`, paddingLeft: '40px'}}
                                   ref={lastname}
                                   required
                            />
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6">Date of Birth</label>
                            <input className="shadow-5 pa2 f6 input-reset ba b--white-025 bg-transparent w-100"
                                   type="date"
                                   name="date-of-birth"
                                   id="date-of-birth"
                                   min="1900-01-01"
                                   max={new Date().toDateInputValue()}
                                   style={{boxSizing: 'border-box', background: `url(${datepng}) no-repeat scroll 5px`, paddingLeft: '40px'}}
                                   ref={dateofbirth}
                                   required
                            />
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="shadow-5 f6 pa2 input-reset ba b--white-025 bg-transparent w-100"
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
                            <input className="shadow-5 f6 pa2 input-reset ba b--white-025 bg-transparent w-100"
                                   type="password"
                                   name="password" id="password"
                                   placeholder="Enter your password"
                                   style={{background: `url(${keypng}) no-repeat scroll 5px`, paddingLeft: '40px'}}
                                   ref={password}
                                   required
                                   minLength="8"
                            />
                        </div>
                    </fieldset>

                    <div>
                        <button className="b br4 w-100 pv2 input-reset ba b--black bg-black tracked pointer f5 db center white dim" type="submit">SIGNUP</button>
                    </div>

                    <div className="lh-copy mt2">
                        <Link to='/login' style={{textDecoration: 'none'}}>
                            <p className="mt4 f6 dim normal link pointer black tc">Have an Account? <b>Sign in</b></p>
                        </Link>
                    </div>

                </div>
            </main>
        </form>
    )
};


export default Signup;

