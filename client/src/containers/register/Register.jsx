import React, { useState } from 'react';
import axios from 'axios';
import logo from './../../assets/logofont.svg';
import human from './../../assets/human.svg';
import { CommonInput, CtaButton, WebcamCapture } from '../../components';
import './register.css';

const inputField = ['email', 'fullName', 'password'];

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        profilePicture: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('email', formData.email);
        form.append('fullName', formData.fullName);
        form.append('password', formData.password);
        if (formData.profilePicture) {
            form.append('profilePicture', formData.profilePicture);
        }

        console.log('Form data before submission:', formData); // Debugging line

        try {
            const response = await axios.post('http://localhost:5000/api/register', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response from server:', response.data); // Debugging line
        } catch (error) {
            console.error('There was an error registering!', error);
        }
    };

    return (
        <div className="user-register">
            <div className="logo">
                <img src={logo} alt="aankh-logo" />
            </div>
            <div className="register-form">
                <h1 className="title-heading">Register</h1>
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
                    <div className="image-capture">
                        <img src={human} alt="human-outline" />
                        <WebcamCapture setImage={(img) => setFormData({ ...formData, profilePicture: img })} />
                    </div>
                    <CtaButton text="Register" />
                </form>
            </div>
        </div>
    );
};

export default Register;
