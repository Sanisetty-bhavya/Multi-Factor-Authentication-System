import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { sentOtpFunction } from '../services/Apis';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/mix.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [spiner, setSpiner] = useState(false);

    const navigate = useNavigate();

    // sendotp
    const sendOtp = async (e) => {
        e.preventDefault();

        if (email === '') {
            toast.error('Enter Your Email!');
        } else if (!email.includes('@')) {
            toast.error('Enter Valid Email!');
        } else if (password === '') {
            toast.error('Enter Your Password!');
        } else {
            setSpiner(true);
            const data = {
                email: email,
                password: password, // Include password in the data
            };

            const response = await sentOtpFunction(data);

            if (response.status === 200) {
                setSpiner(false);
                navigate('/user/otp', { state: email });
            } else {
                toast.error(response.response.data.error);
            }
        }
    };

    return (
        <>
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Welcome Back, Log In</h1>
                        <p>Hi, we are glad you are back. Please log in.</p>
                    </div>
                    <form>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email Address" />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Your Password" />
                        </div>
                        <button className="btn" onClick={sendOtp}>
                            Login
                            {spiner ? <span><Spinner animation="border" /></span> : ''}
                        </button>
                        <p>
                            Don't have an account? <NavLink to="/register">Sign up</NavLink>
                        </p>
                    </form>
                </div>
                <ToastContainer />
            </section>
        </>
    );
};

export default Login;
