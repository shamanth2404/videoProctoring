import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Timer, WebLiveCapture } from '../../components';
import devtools from 'devtools-detect';
import './exam.css';

const Exam = () => {
    const navigate = useNavigate();
    const { formLinkCode } = useParams();
    const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated
    const studentFullName = localStorage.getItem('fullName'); // Get the student's full name from local storage
    const studentEmail = localStorage.getItem('email'); // Get the student's email from local storage
    const [profilePicture, setProfilePicture] = useState(null); // State to store the profile picture
    const [examName, setExamName] = useState(''); // State to store the exam name
    const [duration, setDuration] = useState(60); // State to store the exam duration, default is 60
    const [testLink, setTestLink] = useState(''); // State to store the test link
    const [warningCnt, setWarningCnt] = useState(0); // State to count the warnings
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false); // State to track if devtools is open
    const [isFullScreen, setIsFullScreen] = useState(true); // State to track if the window is in fullscreen
    const [showMessage, setShowMessage] = useState(''); // State to store messages to show
    const intervalRefs = useRef([]); // Ref to store intervals for cleanup

    // Check if the user is authenticated when the component mounts
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, navigate]);

    // Fetch test details and user details when the component mounts
    useEffect(() => {
        async function fetchTestDetails() {
            try {
                // Fetch test details from the backend
                const response = await axios.get(`http://localhost:5000/api/test-details/${formLinkCode}`);
                setTestLink(response.data.test_link_by_user); // Set the test link
                setExamName(response.data.test_name); // Set the exam name
                setDuration(response.data.duration); // Set the exam duration
            } catch (error) {
                console.error('Error fetching test details:', error);
                navigate('/login'); // Redirect to login on error
            }
        }

        async function fetchUserDetails() {
            try {
                // Fetch user details from the backend
                const response = await axios.get(`http://localhost:5000/api/user-details/${studentEmail}`);
                setProfilePicture(response.data.user.profilePicture); // Set the profile picture
                localStorage.setItem('fullName', response.data.user.fullName); // Store the full name in local storage
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }

        fetchTestDetails(); // Call the function to fetch test details
        fetchUserDetails(); // Call the function to fetch user details
    }, [formLinkCode, navigate, studentEmail]);

    // Monitor fullscreen mode and devtools state
    // useEffect(() => {
    //     // function captureCheck() {
    //     //     // Capture a screenshot at intervals
    //     //     const btn = document.querySelector('#root > div > div > div.left-column > div.image-capture > button');
    //     //     if (btn) {
    //     //         btn.click();
    //     //     }
    //     // }

    //     // function check() {            
    //     //     // Check if the window is in fullscreen mode
    //     //     if (!window.screenTop && !window.screenY && isFullScreen) {
    //     //         setIsFullScreen(false); // Set fullscreen state to false
    //     //     }

    //     //     if (!isFullScreen) {
    //     //         setWarningCnt(warningCnt + 1); // Increment warning count
    //     //         setShowMessage('Your exam will terminate. Please go to full screen mode.'); // Show message
    //     //         disableForm(); // Disable the form
    //     //     } else {
    //     //         enableForm(); // Enable the form
    //     //     }

    //     //     terminateExam(); // Check if the exam should be terminated
    //     // }

    //     let overlay = document.getElementById('overlay'); // Get the overlay element
    //     let formBlur = document.getElementById('form-blur'); // Get the form blur element

    //     function disableForm() {
    //         // Disable the form by adding classes
    //         if (overlay) {
    //             overlay.classList.remove('hide');
    //             overlay.classList.add('disable');
    //         }
    //         if (formBlur) {
    //             formBlur.classList.add('blur');
    //         }
    //     }

    //     function enableForm() {
    //         // Enable the form by removing classes
    //         if (overlay) {
    //             overlay.classList.add('hide');
    //             overlay.classList.remove('disable');
    //         }
    //         if (formBlur) {
    //             formBlur.classList.remove('blur');
    //         }
    //     }

    //     function terminateExam() {
    //         // Terminate the exam if the warning count exceeds the limit
    //         if (warningCnt > 5) {
    //             disableForm();
    //             if (overlay) {
    //                 overlay.classList.add('terminate');
    //             }
    //         }
    //     }

    //     const devtoolsListener = (event) => {
    //         // Listen for devtools changes
    //         if (event.detail.isOpen) {
    //             setWarningCnt(warningCnt + 1); // Increment warning count if devtools is open
    //             setIsDevToolsOpen(true); // Set devtools state to open
    //         }

    //         if (!isDevToolsOpen) {
    //             setShowMessage('Your exam will terminate. Please close devtools.'); // Show message
    //             disableForm(); // Disable the form
    //         } else {
    //             enableForm(); // Enable the form
    //         }

    //         terminateExam(); // Check if the exam should be terminated
    //     };

    //     window.addEventListener('devtoolschange', devtoolsListener); // Add event listener for devtools

    //     // const captureCheckInterval = setInterval(captureCheck, 20000); // Set interval for capturing screenshots
    //     // const fullScreenCheckInterval = setInterval(check, 10000); // Set interval for checking fullscreen mode

    //     // intervalRefs.current.push(captureCheckInterval, fullScreenCheckInterval); // Store intervals in ref

    //     return () => {
    //         window.removeEventListener('devtoolschange', devtoolsListener); // Remove event listener
    //         intervalRefs.current.forEach(clearInterval); // Clear intervals on cleanup
    //     };
    // }, []);
    //isFullScreen, isDevToolsOpen, warningCnt, formLinkCode

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarningCnt(prev => prev + 1);
                setShowMessage('Do not switch tabs or windows.');
            }
        };

        const handleBlur = () => {
            setWarningCnt(prev => prev + 1);
            setShowMessage('Do not blur tabs or windows.');
        };

        const handleFocus = () => {
            setShowMessage('');
        };

        const handleDevToolsChange = (event) => {
            if (event.detail.isOpen) {
                setWarningCnt(prev => prev + 1);
                setIsDevToolsOpen(true);
                setShowMessage('Do not open developer tools.');
            } else {
                setIsDevToolsOpen(false);
                setShowMessage('');
            }
        };

        const handleResize = () => {
            setWarningCnt(prev => prev + 1);
            setShowMessage('Do not resize the window.');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('devtoolschange', handleDevToolsChange);
        window.addEventListener('resize', handleResize);

        // Add a listener for devtools detection
        const detectDevTools = () => {
            if (devtools.isOpen) {
                setWarningCnt(prev => prev + 1);
                setIsDevToolsOpen(true);
                setShowMessage('Do not open developer tools.');
            } else {
                setIsDevToolsOpen(false);
                setShowMessage('');
            }
        };
        detectDevTools();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('devtoolschange', handleDevToolsChange);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Function to check for malpractice
    async function checkMalpractice() {
        try {
            const response = await axios.post('http://localhost:8080/predict_pose', {                
                profile_picture: profilePicture // Send the profile picture
            });
            console.log('Malpractice response:', response.data);
        } catch (error) {
            console.error('Error checking malpractice:', error);
        }
    }    

    const handleFinish = (e) => {          
        window.location.href = '/';        
    }

    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            window.history.pushState(null,null,window.location.pathname);
        }
        window.addEventListener('popstate',handleBackButton);

        const handleBeforeUnload = (e) => {
            e.preventDefault();            
        }
        window.addEventListener('beforeunload', handleBeforeUnload);      

        window.history.pushState(null, null, window.location.pathname);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
            window.removeEventListener('beforeunload', handleBeforeUnload);
          };

    },[]);
    return (
        <div className="exam-container">
            <div className="left-column">
                <div className="image-capture">
                    <WebLiveCapture /> {/* Component to capture live webcam feed */}
                    {showMessage && <p>{showMessage}</p>}
                </div>
                <div className="exam-details">
                    <h3 className="title-heading">Student Details</h3>
                    <div className="details">
                        <h4 className="student-name">Student Name: {studentFullName}</h4> {/* Display student's full name */}
                        <h4 className="student-email">Student Email: {studentEmail}</h4> {/* Display student's email */}
                        {profilePicture && (
                            <img 
                                src={`http://localhost:5000/public/${profilePicture}`} 
                                alt="Profile" 
                                className="profile-picture" 
                            /> // Display student's profile picture
                        )}
                    </div>
                </div>
            </div>

            <div className="embedded-form">
                <div className="hide" id="overlay">
                    <h2>Message: {showMessage}</h2> {/* Display messages */}
                    <h2>Warnings: {warningCnt}</h2> {/* Display warning count */}
                    <h1>Exam Terminated</h1>
                    <h3>Please contact your organization/admin.</h3>
                </div>
                <div className="form" id="form-blur">
                    <h2 className="title-heading">{examName}</h2> {/* Display exam name */}
                    {testLink ? (
                        <iframe
                            title={examName}
                            className="form-link"
                            src={testLink}
                        >
                            Form
                        </iframe>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div className="responsive-message">
                        <h1>Please join via a Laptop/PC for best performance</h1>
                    </div>
                </div>
            </div>

            <div className="timer">
                <Timer initialMinute={duration} /> {/* Display timer with duration from backend */}
                <button onClick={handleFinish}>Finish</button>
            </div>
        </div>
    );
};

export default Exam;
