import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CtaButton, CommonInput } from '../../components'; // Removed Navbar import
import infinite from './../../assets/infinite.svg';
import './landing.css';

const featureList = [
    'Face Verification',
    'Multiple People Detection',
    'Voice Detection',
    'Devtools Check',
    'Full Screen Check',
    'Multiple Tabs Check'
];

const Landing = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const testCodeRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleJoin = (e) => {
        e.preventDefault();
        if (testCodeRef.current) {
            const testCode = testCodeRef.current.value;
            if (testCode) {
                navigate(`/exam/${testCode}`);
            } else {
                alert('Please enter a test code.');
            }
        } else {
            console.error('Test code input field not found.');
        }
    };

    return (
        <React.Fragment>
            <div className="section-type landing-page">
                <div className="landing-content">
                    <div className="headings">
                        <span className="sub-text">Advanced & Automated</span>
                        <span className="main-heading gradient-text">
                            Proctoring Solution
                        </span>
                    </div>

                    <p className="desc">
                        A straightforward framework built for online proctoring
                        to create online tests within minutes,{' '}
                        <i>effortlessly</i>.
                    </p>
                </div>

                <div className="landing-cta">
                    <a href="/create">
                        <CtaButton text="Create a test" />
                    </a>

                    <p className="desc">OR</p>
                    <div className="input-item unique-link">
                        <CommonInput
                            placeholderText="Unique test code"
                            id="testCode"
                            ref={testCodeRef}
                        />
                        <span className="join-link">
                            <a href="/" onClick={handleJoin}>Join</a>
                        </span>
                    </div>
                </div>

                <div className="features-content">
                    <div className="curr-heading">
                        <p className="gradient-text">
                            <b>Powerful</b> & Lightweight
                        </p>
                        <h2 className="title-heading">Features</h2>
                    </div>

                    <div className="all-features">
                        {featureList.map((it, index) => (
                            <p className="single-feature" key={index}>{it}</p>
                        ))}
                    </div>

                    <div className="mid-cta">
                        <p className="phew">phew...</p>
                        <a href="/create">
                            <CtaButton />
                        </a>
                    </div>
                </div>

                <div className="final-features">
                    <div className="top-sec">
                        <div className="left-text">
                            <h3 className="gradient-text">
                                Effortlessly integrates with
                            </h3>
                            <h1 className="title-heading">
                                Google Forms or Microsoft Surveys
                            </h1>
                        </div>
                        <div className="infinite">
                            <img src={infinite} alt="infinite" />
                        </div>

                        <div className="right-text">
                            <h3 className="gradient-text">The best part?</h3>
                            <h1 className="title-heading">
                                Live Status on Admin Dashboard
                            </h1>
                        </div>
                    </div>

                    <div className="mid-cta final-cta">
                        <p className="phew">
                            And it’s <b>free</b>.
                            <br />
                            What are you waiting for?
                        </p>
                        <a href="/create">
                            <CtaButton text="Create a test" />
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Landing;
