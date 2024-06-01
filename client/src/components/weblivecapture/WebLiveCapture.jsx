// import React, { useState } from 'react';
// import Webcam from 'react-webcam';
// import './weblivecapture.css';

// const videoConstraints = {
// 	width: 1280,
// 	height: 720,
// 	facingMode: 'user'
// };

// const WebLiveCapture = () => {
// 	const webcamRef = React.useRef(null);
// 	const [ image, setImage ] = useState('');
// 	const capture = React.useCallback(
// 		() => {
// 			const imageSrc = webcamRef.current.getScreenshot();
// 			setImage(imageSrc);
// 			// console.log('Captured');
// 		},
// 		[ webcamRef ]
// 	);

// 	return (
// 		<React.Fragment>
// 			<Webcam
// 				audio={false}
// 				ref={webcamRef}
// 				screenshotFormat="image/jpeg"
// 				height={150}
// 				width={300}
// 				videoConstraints={videoConstraints}
// 			/>

// 			<button className="hide" onClick={capture}>
// 				Capture photo
// 			</button>
// 		</React.Fragment>
// 	);
// };

// export default WebLiveCapture;


import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import './weblivecapture.css';
import axios from 'axios';

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: 'user'
};

const WebLiveCapture = () => {
	const webcamRef = useRef(null);
	const [ image, setImage ] = useState('');
	const [res,setRes] = useState('');

	const capture = React.useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();		
		
		setImage(imageSrc);
		sendImage(imageSrc); // Send captured image to backend
	}, [webcamRef]);

	const sendImage = async (imageSrc) => {
		try {
			const response = await axios.post('http://localhost:8080/predict_pose', {
                img: imageSrc,                
            });			
			console.log(response.data);
			// setRes(data);
			// Handle the response data as needed
		} catch (error) {
			console.error('Error sending image:', error);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			capture();
		}, 1000); // Capture and send image every second

		return () => clearInterval(interval);
	}, [capture]);

	return (
		<React.Fragment>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				height={150}
				width={300}
				videoConstraints={videoConstraints}
			/>
			{/* {res && (<span>{res}</span>)} */}
			{/* {image && <img src={image} />} */}
		</React.Fragment>
	);
};

export default WebLiveCapture;
