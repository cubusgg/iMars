import React from 'react';
import './login.css';
import Navigation from "../../components/main/navigation/Navigation";
import Signin from "../../components/start/Signin/Signin";
import Footer from "../../components/main/footer/Footer";

const Login = () => {
        return (
            <>
                <Navigation login />
                <div className="wrapperLogin">
                    <Signin />
                </div>
                <Footer />
            </>
        )
};


export default Login;

