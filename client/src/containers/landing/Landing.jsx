import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CtaButton, CommonInput } from "../../components"; // Removed Navbar import
import infinite from "./../../assets/infinite.svg";
import "./landing.css";
import axios from "axios";

const featureList = [
  "Face Verification",
  "Multiple People Detection",
  "Voice Detection",
  "Devtools Check",
  "Full Screen Check",
  "Multiple Tabs Check",
];

const Landing = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const testCodeRef = useRef(null);
  const [message, setMessage] = useState("");
  const [attemptMessage,setAttemptMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (testCodeRef.current) {
      const testCode = testCodeRef.current.value;
      if (testCode) {
        const email = localStorage.getItem("email");
        const response = await axios.get(`http://localhost:5000/api/attempted-test?email=${email}&testCode=${testCode}`);
        if(response.length === 0){
          const addAttempt = await axios.post(`http://localhost:5000/api/add-attempt?email=${email}&testCode=${testCode}`);
          if(!addAttempt.attempt){
            console.log("Error adding attempt");
            return
          }else{
            localStorage.setItem("minutes", "");
        localStorage.setItem("seconds", "");
        navigate(`/exam/${testCode}`);
          }
        }else{
          setAttemptMessage("Test Already Attempted");
        }       
      } else {
        alert("Please enter a test code.");
      }
    } else {
      console.error("Test code input field not found.");
    }
  };

  const handleCreate = () => {
    console.log("called");
    if (localStorage.getItem("role") === "student") {
      setMessage("Students aren't allowed to create Test");
    } else {
      navigate("/create");
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
            A straightforward framework built for online proctoring to create
            online tests within minutes, <i>effortlessly</i>.
          </p>
        </div>

        <div className="landing-cta">
          <div onClick={handleCreate}>
            <CtaButton text="Create a test" />
            {message && <p>{message}</p>}
          </div>

          <p className="desc">OR</p>
          <div className="input-item unique-link">
            <div>
            <CommonInput
              placeholderText="Unique test code"
              id="testCode"
              ref={testCodeRef}
            />
            {attemptMessage && <p>{attemptMessage}</p>}
            </div>
            <span className="join-link">
              <a href="/" onClick={handleJoin}>
                Join
              </a>
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
              <p className="single-feature" key={index}>
                {it}
              </p>
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
              <h3 className="gradient-text">Effortlessly integrates with</h3>
              <h1 className="title-heading">
                Google Forms or Microsoft Surveys
              </h1>
            </div>
            <div className="infinite">
              <img src={infinite} alt="infinite" />
            </div>

            <div className="right-text">
              <h3 className="gradient-text">The best part?</h3>
              <h1 className="title-heading">Live Status on Admin Dashboard</h1>
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
