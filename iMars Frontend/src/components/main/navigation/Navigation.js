import React, {useContext} from 'react';
import Tilt from "react-tilt";
import logo from "../../../assets/imarslogo.png";
import './navigation.css';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
import swal from "sweetalert";
import {logoutCall} from "../../../apiCalls";

const Navigation = ({ login, register }) => {

    const { user, dispatch } = useContext(AuthContext);
    const history = useHistory();


    const handleClick = async (e) => {
        e.preventDefault();

        try {
            await logoutCall(dispatch);
            history.push('/welcome');
            await swal("Good job!", "You Logged out correctly!", "success");
        } catch (err) {
            console.log(err);
        }
    }

    const LoginNav = () => {
        return (
            <div className="navRight">
                <Link to='/login' style={{textDecoration: 'none'}}>
                    <p className="f4 link b dim white pointer ttu tracked">Sign In</p>
                </Link>
                    <p className="f3 b white ttu mr2 ml2">|</p>
                <Link to='/register' style={{textDecoration: 'none'}}>
                    <p className="f4 link b dim white pointer ttu tracked">Sign Up</p>
                </Link>
            </div>
        )
    }

    const HomeNav = () => {
        return (
        <div className="navRight">
            <Link to={`/profile/${user.id}`} style={{textDecoration: 'none'}}>
                <img src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} className="br-100 mr3 navImage" alt="avatar"/>
            </Link>
            <p onClick={handleClick} className="f4 link b dim white pointer ttu tracked">Sign Out</p>
        </div>
        )
    }

        return (
            <div className="navContainer">

                <div className="navLeft">
                    <div className="image">
                        <Link to='/' style={{textDecoration: 'none'}}>
                            <Tilt className="Tilt shadow-2" options={{ max: 40 }} style={{ height: 70, width: 70}}>
                                <div className="Tilt-inner">
                                    <img style={{width: '70px', height: '70px'}} src={logo} alt="logo"/>
                                </div>
                            </Tilt>
                        </Link>
                    </div>
                </div>


                <div className="navCenter">

                </div>

                {login || register ? <LoginNav /> : <HomeNav />}

            </div>
        );
};

export default Navigation;
