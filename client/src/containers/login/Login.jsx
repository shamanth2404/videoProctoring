import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/logofont.svg';
import { CommonInput, CtaButton } from '../../components';
import './login.css';

const inputField = ['email', 'password'];

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signin', formData);
            console.log('Response from server:', response.data);
            if (response.data.token && response.data.user) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('email', user.email);
                localStorage.setItem('fullName', user.fullName);
                localStorage.setItem('role',user.role);
                navigate('/');
            } else {
                console.error('Login failed:', response.data.msg);
            }
        } catch (error) {
            console.error('There was an error logging in!', error);
        }
    };

    return (
        <div className="user-login">
            <div className="logo">
                <img src={logo} alt="aankh-logo" />
            </div>
            <div className="login-form">
                <h1 className="title-heading">User Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-fields">
                        {inputField.map((item, index) => (
                            <CommonInput
                                key={index}
                                placeholderText={item}
                                name={item}
                                value={formData[item]}
                                onChange={handleInputChange}
                            />
                        ))}
                    </div>
                    <CtaButton text="Login" />
                </form>
            </div>
        </div>
    );
};

export default Login;
