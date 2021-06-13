import React from 'react';
import './register.css';
import Navigation from "../../components/main/navigation/Navigation";
import Signup from "../../components/start/Signup/Signup";
import Footer from "../../components/main/footer/Footer";

const Register = () => {
        return (
            <>
                <Navigation register />
                <div className="wrapperRegister">
                    <Signup />
                </div>
                <Footer />
            </>
        )
};


export default Register;

