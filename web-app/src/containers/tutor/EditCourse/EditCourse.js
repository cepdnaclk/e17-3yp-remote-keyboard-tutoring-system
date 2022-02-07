import React, {useEffect, useState} from 'react';
import Container from '../../../components/Container/Container';
import { Button } from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import StepOne from './StepOne'
import StepTwo from './StepTwo';
import StepThree from './StepThree'
import StepFour from './StepFour'
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { clearAll } from '../../../reducers/createCourseSlice';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const steps = ['Course overview', 'Course content', 'Describe your course', 'Publish Your Course'];

const stepFooterStyle = {
	display : 'flex',
	justifyContent : 'space-between',
	position : 'fixed',
	width : '100%',
	right: 0,
	bottom: 0,
	padding : '15px 30px',
	backdropFilter: 'blur(25px)',
	webkitBackdropFilter: 'blur(25px)',
	alignItems : 'center',
    zIndex: 99999,
};

const stepContainerStyle = {
	height : '100%',
};

const level = ["Beginner", "Intermediate", "Expert"];

const categories = [
	'Music Theory',
	'Keyboard Instrument',
	'Piano Chords',
	'Music History',
	'Playing Music by Ear',
	'Piano for Kids',
	'Piano for Beginners',
	'Piano for Experts',
	'Certificate Course',
	'Improvisation',
	'Other'
];

export default function EditCourse(props) {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.userData.data);
	const createCourseData = useSelector(state => state.createCourse);
	const [activeStep, setActiveStep] = useState(0);
	const [forward, setForward] = React.useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = React.useState({ success: false, message: '' });

	const history = useHistory();
	const params = useParams();

	const trySubmit = async () => {
        setSubmitting(true);

		const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + userData.accessToken.token + ' ' + userData.id
            },
            body: JSON.stringify({
				title: createCourseData.courseName,
				description: createCourseData.courseDescription,
				price: createCourseData.coursePrice,
				difficulty: level[createCourseData.courseDifficulty],
				category: categories[createCourseData.courseCategory],
				searchTags: createCourseData.searchTags,
				syllabus: createCourseData.courseTopics,
				prerequisites: createCourseData.coursePrerequisites,
				isPublished: createCourseData.isPublished,
			})
        };
		await fetch(`/course/edit/${params.id}`, requestOptions)
		.then(response => response.json())
		.then(async data => {
			if (createCourseData.courseCoverBlob) {
				const coverImageFormData = new FormData();
				let blob = await fetch(createCourseData.courseCoverBlob).then(r => r.blob());
				coverImageFormData.append('cover-upload', blob, createCourseData.courseCoverName);
	
				await axios.post(`/course/coverImage/${data.ref._id}`, coverImageFormData, {headers: {'Authorization': 'Bearer ' + userData.accessToken.token + ' ' + userData.id} })
				.then(res => {
					const _data = res.data;
	
					if (res.status >= 500) return Promise.reject("Server error! Please try again");
	
					if (!_data.success) {
						const err = _data.message;
						return Promise.reject(err);
					}
				})
				.catch(err => {
					const mute = err;
				});
			}
		});

		setSubmitting(false);
		dispatch(clearAll());
		localStorage.setItem('courseEdited', 'Course has been edited successfully!');
		history.push('/courses');
    }

	const handleNext = () => {
		if (activeStep < steps.length - 1) {
			setForward(true);
			setActiveStep(activeStep + 1);
		}
		if (activeStep === steps.length - 1){
			trySubmit();
		}
	};

	const handleBack = () => {
		setForward(false);
		setTimeout(() => {
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		}, 10);
		setTimeout(() => {
			setForward(true);
		}, 1000);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	function renderStep(idx){
		switch(idx) {
			case 0:
				return <StepOne setStatus={setStatus} />;
			case 1:
				return <StepTwo setStatus={setStatus} />;
			case 2:
				return <StepThree setStatus={setStatus} />;
			case 3:
				return <StepFour setStatus={setStatus}/>;
		}
	}

	const handleStep = (step) => {
		
	};

	return (
		<Container noSearch hasStepper heading='Edit your Course' steps={steps} handleStep={handleStep} activeStep={activeStep}>
			{activeStep === steps.length ? (
			<React.Fragment>
				<Typography sx={{ mt: 2, mb: 1 }}>
					{"All steps completed - you're finished"}
				</Typography>
				<Button onClick={handleReset}>Reset</Button>
			</React.Fragment>
			) : (
			<motion.div style={{height: 'calc(100% - 70px)'}}>
				<SwitchTransition mode='out-in'>
					<CSSTransition
						key={activeStep}
						addEndListener={(node, done) => {
							node.addEventListener("transitionend", done, false);
						}}
						classNames="slide" >
						<motion.div style={stepContainerStyle} className={!forward ? 'back' : ''}>
							{renderStep(activeStep)}
						</motion.div>
					</CSSTransition>
				</SwitchTransition>
				<motion.div style={stepFooterStyle}>
					<Button variant="outline-secondary" disabled={activeStep === 0} onClick={handleBack} style={{width: 90, height: 40, fontSize: 16}}>
						<motion.div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<KeyboardArrowLeftIcon />
							<motion.span>Back </motion.span>
						</motion.div>
					</Button>
					<motion.span style={{color: status.success ? 'green' : 'red'}}>{status.message}</motion.span>
					<Button onClick={handleNext} disabled={!status.success} variant="outline-secondary" style={{width: 90, height: 40, fontSize: 16}}>
						<motion.div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							{submitting && <CircularProgress size={24} />}
							<motion.span>{activeStep === steps.length - 1 ? 'Save' : 'Next'}</motion.span>
							{activeStep < steps.length - 1 && <KeyboardArrowRightIcon />}
						</motion.div>
					</Button>
				</motion.div>
			</motion.div>
			)}
		</Container>
	);
}