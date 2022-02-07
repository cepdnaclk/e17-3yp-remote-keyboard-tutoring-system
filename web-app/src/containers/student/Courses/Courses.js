import React, { useEffect } from 'react';
import Container from '../../../components/Container/Container';
import TileList, {Tile} from '../../../components/TileList/TileList';
import { Pagination } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from '@material-ui/lab/Skeleton';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { setCoursesEnrolled } from '../../../reducers/userDataSlice';
import DividerWithText from '../../../components/DividerWithText/DividerWithText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Recaptcha from 'react-recaptcha';

import avatar1 from "../../../assets/avatars/tutor/Asset 1.svg";
import avatar2 from "../../../assets/avatars/tutor/Asset 2.svg";
import avatar3 from "../../../assets/avatars/tutor/Asset 3.svg";
import avatar4 from "../../../assets/avatars/tutor/Asset 4.svg";
import avatar5 from "../../../assets/avatars/tutor/Asset 5.svg";
import avatar6 from "../../../assets/avatars/tutor/Asset 6.svg";
import avatar7 from "../../../assets/avatars/tutor/Asset 7.svg";
import avatar8 from "../../../assets/avatars/tutor/Asset 8.svg";
import avatar9 from "../../../assets/avatars/tutor/Asset 9.svg";
import avatar10 from "../../../assets/avatars/tutor/Asset 10.svg";
import avatar11 from "../../../assets/avatars/tutor/Asset 11.svg";
import avatar12 from "../../../assets/avatars/tutor/Asset 12.svg";
import avatar14 from "../../../assets/avatars/tutor/Asset 14.svg";
import avatar15 from "../../../assets/avatars/tutor/Asset 15.svg";
import avatar13 from "../../../assets/avatars/tutor/Asset 13.svg";
import avatar16 from "../../../assets/avatars/tutor/Asset 16.svg";
import avatar17 from "../../../assets/avatars/tutor/Asset 17.svg";
import avatar18 from "../../../assets/avatars/tutor/Asset 18.svg";
import avatar19 from "../../../assets/avatars/tutor/Asset 19.svg";
import avatar20 from "../../../assets/avatars/tutor/Asset 20.svg";

// Default Background
import bg2 from '../../../components/TileList/Default Backgrounds/bg2.jpg';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15, avatar16, avatar17, avatar18, avatar19, avatar20];

const tabLabels = ["New", "Trendy", "Best-Rated", "Enrolled"];

const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const { REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY } = process.env;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Courses(props) {
	const dispatch = useDispatch();
	const sort = useSelector(state => state.sortCourses.sortBy).toLowerCase();
	const userData = useSelector(state => state.userData.data);

	const [total, setTotal] = React.useState(null);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(10);
	const [courseData, setCourseData] = React.useState([]);
	const [tutorAvatars, setTutorAvatars] = React.useState({});
	const [courseCovers, setCourseCovers] = React.useState({});
	const [showModal, setShowModal] = React.useState(false);
	const [verifyUsername, setVerifyUsername] = React.useState('');
	const [enrollCourseID, setEnrollCourseID] = React.useState('');
	const [loading, setEnrolling] = React.useState(false);
	const [enrollError, setEnrollError] = React.useState(false);
	const [alertMessage, setAlertMessage] = React.useState('');
	const [dataChanged, setDataChanged] = React.useState(false);
	const [unenroll, setLoading] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('');
	const [modalContent, setModalContent] = React.useState(null);
	const [modalActions, setModalActions] = React.useState(null);
	const [showEnroll, setShowEnroll] = React.useState(false);
	const [classes, setClasses] = React.useState([]);

	useEffect(() => {
		document.title = props.title || 'Courses';

		// const script = document.createElement("script");
		// script.src = "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
		// script.async = true;
		// script.defer = true;
		// document.body.appendChild(script);
	}, [props.title]);

	useEffect(() => {
		setCourseData(null);

		axios.get(`/course/all?page=${currentPage}&limit=${pageSize}&sort=${sort !== 'enrolled' && sort}&filter=${sort === 'enrolled' && sort}&count=true`, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
		.then(res => res.data)
		.then(res => {
			setCourseData(res.courses);
			setTotal(res.count);
		})
	}, [sort, currentPage, pageSize, dataChanged]);

	useEffect(() => {
		var temp = {};
		var temp2 = {};
		if (courseData)
			courseData.forEach(async course => {
				const requestOptions = {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`,
					},
				};
				if (!temp[course.author.id]) {
					if (!course.author.avatar.includes('default:')) {
						await fetch(`/tutor/info/${course.author.id}/${course.author.avatar}`, requestOptions)
						.then(response => response.blob())
						.then(blob => {
							temp[course.author.id] = URL.createObjectURL(blob);
						});
					}
				}
				if (!temp2[course._id]) {
					if (!course.coverImage.includes('default:')) {
						await fetch(`/course/info/${course._id}/${course.coverImage}`, requestOptions)
						.then(response => response.blob())
						.then(blob => {
							temp2[course._id] = URL.createObjectURL(blob);
						});
					}
				}
			});
		setTutorAvatars(temp);
		setCourseCovers(temp2);
	}, [courseData, dataChanged]);

	useEffect(() => {
		setTimeout(() => {
			if (setAlertMessage) setAlertMessage('');
		}, 4000);
	}, [alertMessage]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (current, size) => {
		setPageSize(size);
	};

	const capitalizeFirstLetter = (string) => {
		if (!string) return string;
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const handleEnroll = (course) => {
		setModalTitle('Verify Captcha');
		setModalContent(null);
		setShowEnroll(true);
		setShowModal(true);
		setEnrollCourseID(course._id);
		if (course.enrollees.includes(userData.id)) setLoading(true);
	};

	const tryEnroll = (e) => {
		setEnrolling(true);

		if (verifyUsername === userData.username)
			axios.post(`/course/${unenroll ? 'unenroll' : 'enroll'}/${enrollCourseID}`, {}, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
			.then(response => {
                const data = response.data;

                if (response.status >= 500) return Promise.reject("Server error! Please try again");

                if (!data.success) {
                    const err = data.message;
                    return Promise.reject(err);
                }

				setEnrolling(false);
				setShowModal(false);
				setEnrollError(false);
				dispatch(setCoursesEnrolled(data.ref.coursesEnrolled));
				setDataChanged(!dataChanged);
				setAlertMessage(`Successfully ${unenroll ? 'unenrolled' : 'enrolled'}!`);
            })
            .catch(err => {
				setEnrolling(false);
				setShowModal(false);
                setEnrollError(true);
				setAlertMessage(`Could not ${unenroll ? 'unenroll from' : 'enroll to'} the course`);
            });
		else {
			setEnrolling(false);
			setShowModal(false);
			setEnrollError(true);
			setAlertMessage('Could not enroll to the course');
			setAlertMessage(`Could not ${unenroll ? 'unenroll from' : 'enroll to'} the course`);
		}
		setShowEnroll(false);
		setVerifyUsername('');
		setEnrollCourseID('');
		setLoading(false);
		setModalTitle('');
		setModalContent(null);
		setModalActions(null);
	};

	const viewSubscribedClasses = async (course) => {
		setLoading(true);
		setModalTitle('Subscribed Classes');
		const _classes = [];
		userData.subscribedClasses && userData.subscribedClasses.forEach(classID => {
			course.classRooms.forEach(courseClassId => {
				if (courseClassId === classID) _classes.push(classID);
			});
		});

		const temp = [];
		if (_classes.length) {
			await Promise.all(_classes.map(async classID => {
				await axios.get(`/class/info/${classID}`, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
				.then(res => {
					const data = res.data;
					if (res.status >= 500) return Promise.reject("Server error! Please try again");
					if (!data.success) return Promise.reject(data.message);
					temp.push(data.class);
				})
				.catch(err => {
					return Promise.reject(err);
				});
			}));
		}
		setClasses(temp);

		const content = (
			<div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
				<p style={{margin: 0}}>You haven't subscribed to any of the classes in this course yet. Please ask your tutor to invite you to a class.</p>
				<DividerWithText>OR</DividerWithText>
				<p style={{margin: 0}}>Send a <Link>Request</Link> to your tutor.</p>
			</div>
		);
		const actions = (
			<>
				<Button variant='outline-primary' style={{width: '11rem', height: '3rem', marginRight: 10}} disabled={loading} onClick={() => setShowModal(false)}>Cancel</Button>
			</>
		);
		setModalContent(_classes.length ? null : content);
		setModalActions(_classes.length ? null : actions);
		setShowModal(true);
		setLoading(false);
	};

	const handleClose = () => {
		setModalTitle('');
		setModalContent(null);
		setModalActions(null);
		setShowEnroll(false);
		setShowModal(false);
		setEnrollError(false);
		setEnrollCourseID('');
		setVerifyUsername('');
		setLoading(false);
		setClasses([]);
		setAlertMessage('');
		setEnrolling(false);
	};

	return (
		<Container selected={tabLabels.findIndex(item => sort === item.toLowerCase())} 
					heading={sort === 'enrolled' ? 'Enrolled Courses' : 'All Courses'} tabLabels={tabLabels} searchPlaceholder='Seach Courses'>
			<Dialog
					open={showModal}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					style={{zIndex: '999999999999999999999'}}
					onClose={handleClose}
				>
				<DialogTitle id="alert-dialog-title">
					<h3>{modalTitle}</h3>
				</DialogTitle>
				<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{!showEnroll && modalContent}
					{showEnroll && <>
						{/* <Recaptcha
									render="explicit"
									size="normal"
									verifyCallback={verifyCallback}
									onloadCallback={callback}
									sitekey={REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
								/> */}
						<span>{`Before ${unenroll ? 'unenrolling from' : 'enrolling in'} this course, please verify that you are human.`}</span>
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20}}>
							<span>Type your username here to verify</span>
							<TextField value={verifyUsername} disabled={loading} onChange={(e) => setVerifyUsername(e.target.value)} />
						</div>
					</>}
					{classes.length > 0 && <div>
						{classes.map(classData => {
							return (
								<div key={classData._id} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20}}>
									<span>{classData.name}</span>
								</div>
							);
						})}
					</div>}
				</DialogContentText>
				</DialogContent>
				<DialogActions style={{padding: 30}}>
					{!showEnroll && modalActions}
					{showEnroll && <>
						<Button variant='outline-primary' style={{width: '11rem', height: '3rem', marginRight: 10}} disabled={loading} onClick={handleClose}>Cancel</Button>
						<Button style={{width: '11rem', height: '3rem', marginLeft: 10}} disabled={loading || verifyUsername ===''} onClick={tryEnroll}>Verify</Button>
					</>}
				</DialogActions>
			</Dialog>
			<TileList>
				{!courseData && temp.map((t, k) => {
					return (
						<Skeleton className='tile' variant="rect" height={350} width='100%' style={{borderRadius: 10}} />
					)
				})}
				{courseData && courseData.map((course, key) => {
					return (
						<Tile key={key} title={course.title}
										altBtnText={userData.coursesEnrolled.includes(course._id) ? 'Unenroll' : ''}
										handleButtonClick={() => handleEnroll(course)}
										leftBtnText={userData.coursesEnrolled.includes(course._id) && 
										<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
											{loading && <CircularProgress size={22} />}
											<span style={{paddingLeft: 5}}>View Subscribed Classes</span>
										</div>}
										handleLeftBtnClick={() => viewSubscribedClasses(course)}
										description={course.description} 
										numberOfLessons={course.syllabus.length} 
										rating={course.rating}
										pointsOfInterest={course.pointsOfInterest}
										enrollees={course.enrollees.length}
										difficulty={course.difficulty}
										syllabus={course.syllabus}
										prerequisites={course.prerequisites}
										facilitatorName={capitalizeFirstLetter(course.author.firstName) + ' ' + capitalizeFirstLetter(course.author.lastName)}
										facilitatorUsername={course.author.username}
										facilitatorCourses={course.author.numberOfCourses - 1} 
										coverImage={courseCovers[course._id] || bg2}
										facilitatorPicture={tutorAvatars[course.author.id] || avatars[parseInt(course.author.avatar.split(':')[1])]}/>
					)
				})}
			</TileList>
			<Snackbar open={alertMessage !== ''} style={{ top: '-670px', zIndex: '9999999999999999999999999999' }}>
				<Alert severity={enrollError ? 'error' : "success"} sx={{ width: '100%'}}>
					{alertMessage}
				</Alert>
			</Snackbar>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<Pagination defaultCurrent={1} total={total} showSizeChanger onChange={handlePageChange} onShowSizeChange={handlePageSizeChange} style={{marginBottom: 35}} />
			</div>
		</Container>
	)
}

export default Courses;