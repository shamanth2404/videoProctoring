import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/logofont.svg';
import { CommonInput, CtaButton } from '../../components';
import './create.css';

const inputField = [
    { label: 'Email ID', name: 'email' },
    { label: 'Organization Name', name: 'organizationName' },
    { label: 'Test Name', name: 'testName' },
    { label: 'Question Paper Link', name: 'testLink' },
    { label: 'Total Expected Candidates', name: 'totalCandidates' },
    { label: 'Start Date-Time Format', name: 'startTime' },
    { label: 'Duration', name: 'duration' }
];

const Create = () => {
    const [formData, setFormData] = useState({
        email: '',
        organizationName: '',
        testName: '',
        testLink: '',
        totalCandidates: '',
        startTime: '',
        duration: ''
    });
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        if (!isAuthenticated) {
            console.log("navigate('/login');")
        }
    }, [isAuthenticated, navigate]);

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
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/create-test', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('There was an error creating the test!', error);
        }
    };

    return (
        <div className="client-create">
            <div className="logo">
                <img src={logo} alt="aankh-logo" />
            </div>
            <div className="create-form">
                <h1 className="title-heading">Create a test</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-fields">
                        {inputField.map((item, index) => (
                            <CommonInput
                                key={index}
                                placeholderText={item.label}
                                name={item.name}
                                value={formData[item.name]}
                                onChange={handleInputChange}
                            />
                        ))}
                    </div>
                    <CtaButton text="Create" />
                </form>
            </div>
        </div>
    );
};

export default Create;
