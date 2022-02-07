import React, { useEffect } from 'react';
import Container from '../../../components/Container/Container';
import TileList, {Tile} from '../../../components/TileList/TileList';
import { useSelector, useDispatch } from 'react-redux';
import { Pagination } from 'antd';
import Skeleton from '@material-ui/lab/Skeleton';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { Button } from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { setCourse } from '../../../reducers/createCourseSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { motion, AnimatePresence } from 'framer-motion';
import { InputLabel, TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { CSSTransition } from "react-transition-group";
import { Scrollbars } from 'react-custom-scrollbars';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// Default Background
import bg2 from '../../../components/TileList/Default Backgrounds/bg2.jpg';

import avatar1 from "../../../assets/avatars/student/Asset 1.svg";
import avatar2 from "../../../assets/avatars/student/Asset 3.svg";
import avatar3 from "../../../assets/avatars/student/Asset 4.svg";
import avatar4 from "../../../assets/avatars/student/Asset 5.svg";
import avatar5 from "../../../assets/avatars/student/Asset 6.svg";
import avatar6 from "../../../assets/avatars/student/Asset 7.svg";
import avatar7 from "../../../assets/avatars/student/Asset 8.svg";
import avatar8 from "../../../assets/avatars/student/Asset 9.svg";
import avatar9 from "../../../assets/avatars/student/Asset 10.svg";
import avatar10 from "../../../assets/avatars/student/Asset 11.svg";
import avatar11 from "../../../assets/avatars/student/Asset 12.svg";
import avatar12 from "../../../assets/avatars/student/Asset 13.svg";
import avatar13 from "../../../assets/avatars/student/Asset 14.svg";
import avatar14 from "../../../assets/avatars/student/Asset 15.svg";
import avatar15 from "../../../assets/avatars/student/Asset 16.svg";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15];

const tabLabels = ["Published", "Not Published"];
const filterLabels = ["Latest", "Alphabetical", "Popular", "Best-Rated", "Most-Reviewed"];
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

const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const addButtonStyle = {
	position: 'fixed',
	bottom: '25px',
	right: '25px',
	zIndex: '1000',
};

const listHeadingIconStyle = {
	borderRadius: '50%',
	width: '40px',
	height: '40px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Courses(props) {
	const dispatch = useDispatch();
	const sort = useSelector(state => state.sortCourses.sortBy).toLowerCase();
	const filter = useSelector(state => state.sortCourses.filterBy).toLowerCase();
	const userData = useSelector(state => state.userData.data);
	const history = useHistory();

	const [total, setTotal] = React.useState(null);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(10);
	const [courseData, setCourseData] = React.useState([]);
	const [alert, setAlert] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const [severity, setSeverity] = React.useState('success');
	const [courseCovers, setCourseCovers] = React.useState({});
	const [showModal, setShowModal] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('');
	const [modalContent, setModalContent] = React.useState(null);
	const [modalActions, setModalActions] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [showCreateClass, setShowCreateClass] = React.useState(false);
	const [classRoomName, setClassRoomName] = React.useState('');
	const [classRoomPassword, setClassRoomPassword] = React.useState('');
	const [classRoomConfirmPassword, setClassRoomConfirmPassword] = React.useState('');
	const [classRoomMaxStudents, setClassRoomMaxStudents] = React.useState(25);
	const [courseId, setCourseId] = React.useState(null);
	const [error, setError] = React.useState('');
	const [showManageClasses, setShowManageClasses] = React.useState(false);
	const [classes, setClasses] = React.useState([]);
	const [activeMenu, setActiveMenu] = React.useState('classes');
	const [showEnrolled, setShowEnrolled] = React.useState(false);
	const [allowUsername, setAllowUsername] = React.useState('');

    useEffect(() => {
		document.title = props.title || "forté | Courses";

		if (localStorage.getItem('courseCreated')) {
            setTimeout(() => {
                setAlert(true);
                setMessage(localStorage.getItem('courseCreated'));
                localStorage.removeItem('courseCreated');
            }, 1000);
        }
		else if (localStorage.getItem('courseEdited')) {
            setTimeout(() => {
                setAlert(true);
                setMessage(localStorage.getItem('courseEdited'));
                localStorage.removeItem('courseEdited');
            }, 1000);
        }
	}, [props.title]);

	useEffect(() => {
		if (alert)
			setTimeout(() => {
				setAlert(false);
				setMessage('');
				setSeverity('success');
			}, 3000);
	}, [alert]);

	useEffect(() => {
		setCourseData(null);

		axios.get(`/tutor/courses?page=${currentPage}&limit=${pageSize}&sort=${sort}&filter=${filter}&count=true`, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
		.then(res => res.data)
		.then(res => {
			setCourseData(res.courses);
			setTotal(res.count);
		});
	}, [sort, filter, currentPage, pageSize, alert]);

	useEffect(() => {
		var temp = {};
		if (courseData)
			courseData.forEach(async course => {
				const requestOptions = {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`,
					},
				};
				if (!temp[course._id]) {
					if (!course.coverImage.includes('default:')) {
						await fetch(`/course/info/${course._id}/${course.coverImage}`, requestOptions)
						.then(response => response.blob())
						.then(blob => {
							temp[course._id] = URL.createObjectURL(blob);
						});
					}
				}
			});
		setCourseCovers(temp);
	}, [courseData]);

	useEffect(() => {
		if (showCreateClass) {
			if (classRoomName === '')
				setError('Class name is required');
			else if (classRoomPassword === '')
				setError('Password is required');
			else if (classRoomPassword.length < 6)
				setError('Password must be at least 6 characters');
			else if (classRoomConfirmPassword === '')
				setError('Confirm password is required');
			else if (classRoomPassword !== classRoomConfirmPassword)
				setError('Passwords do not match');
			else
				setError('');
		}
	}, [showCreateClass, classRoomName, classRoomPassword, classRoomConfirmPassword, classRoomMaxStudents]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (current, size) => {
		setPageSize(size);
	};

	const handleCreateClass = (course) => {
		handleClose();
		setShowCreateClass(true);
		setModalTitle('Create a Classroom');
		setModalContent(null);
		setModalActions(null);
		setCourseId(course._id);
		setShowModal(true);
	};

	const tryCreateClass = async () => {
		setLoading(true);
		await axios.post('/class/create', {
			name: classRoomName,
			password: classRoomPassword,
			maxParticipants: classRoomMaxStudents,
			host: userData.id,
			course: courseId
		}, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
		.then(res => res.data)
		.then(res => {
			if (res.success) {
				setAlert(true);
				setMessage('Classroom created successfully');
				setShowModal(false);
				setShowCreateClass(false);
				setClassRoomName('');
				setClassRoomPassword('');
				setClassRoomConfirmPassword('');
				setClassRoomMaxStudents(25);
				setCourseId(null);
				setError('');
			}
			else
				setError(res.message);
		});
		setLoading(false);
	};

	const manageClasses = async (course) => {
		handleClose();
		setLoading(true);
		setShowManageClasses(true);
		setModalTitle('Manage Your Classes');
		const _classes = course.classRooms;
		var temp = [];

		if (_classes.length) {
			setShowModal(true);
			await Promise.all(_classes.map(async classRoom => {
				await axios.get(`/class/info/${classRoom}`, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
				.then(res => res.data)
				.then(res => {
					if (res.success) temp.push(res.class);
				});
			}));
			setClasses(temp);
		}

		const content = (
			<div>
				<p>You haven't added any classrooms for this course.</p>
				<Divider />
				<Button style={{float: 'right', marginTop: 15, fontSize: 15}} onClick={() => handleCreateClass(course)} variant='outline-secondary' size='md' >Create a Classroom</Button>
			</div>
		);
		const actions = (
			<Button style={{float: 'right', marginTop: 15, fontSize: 15}} onClick={() => handleCreateClass(course)} variant='outline-secondary' size='md' >Create a Classroom</Button>
		);
		setModalActions(_classes.length !== 0 ? actions : null);
		setModalContent(_classes.length === 0 ? content : null);
		setShowModal(true);
		setLoading(false);
	};

	const viewEnrolledStudents = async (course) => {
		handleClose();
		setLoading(true);
		setShowEnrolled(true);
		setModalTitle('Enrolled Students');
		let enrolledStudents = [];
		let profileImages = {};
		await Promise.all(course.enrollees.map(async student => {
			await axios.get(`/user/info?id=${student}`, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
			.then(res => res.data)
			.then(res => {
				enrolledStudents.push(res.data);
				const _student = res.data;
				if (_student.avatar.includes('default:')) profileImages[student] = avatars[_student.avatar.split(':')[1]];
				else {
					fetch(`/student/info/${student}/${_student.avatar}`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`,
						},
					})
					.then(response => response.blob())
					.then(blob => {
						profileImages[student] = URL.createObjectURL(blob);
					});
				}
			});
		}));

		const content = (
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<div style={{width: 300, height: 300}}>
					<Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
											renderTrackVertical={props => <div {...props} className="track-vertical"/>}
											renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
											renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
											renderView={props => <div {...props} className="view"/>}
											autoHide autoHideTimeout={1000} 
											autoHideDuration={200}>
						<>
							{enrolledStudents.length > 0 && enrolledStudents.map(student => (
								<div style={{display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', gridColumnGap: 10, alignItems: 'center', width: '100%', padding: '20px 0'}}>
									<div style={{width: '2.5rem', height: '2.5rem'}} className='profile-image-container'>
										<img src={profileImages[student._id]} alt="profile" className='profile-image'/>
									</div>
									<div key={student._id} style={{display: 'flex', flexDirection: 'column'}}>
										<Link style={{color: 'black'}} onClick={() => history.push(`/${student.username}`)}>{`${student.firstName} ${student.lastName}`}</Link>
										<p style={{color: 'var(--dark-gray)', fontSize: 14, margin: 0}}>{student.username}</p>
									</div>
									<MoreHorizIcon style={{color: 'var(--dark-gray)', cursor: 'pointer'}}/>
								</div>
							))}
						</>
					</Scrollbars>
				</div>
				{enrolledStudents.length === 0 && <p style={{color: 'var(--dark-gray)', fontSize: 14, margin: 0}}>No students have been enrolled yet.</p>}
			</div>
		);
		setModalContent(content);
		setModalActions(null);
		setShowModal(true);
		setLoading(false);
	};

	const handleEditClick = (course) => {
		dispatch(setCourse({
			courseName: course.title,
			courseDescription: course.description,
			coursePrice: course.price,
			courseDifficulty: level.indexOf(course.difficulty),
			courseCategory: categories.indexOf(course.category),
			searchTags: course.searchTags,
			courseTopics: course.syllabus,
			coursePrerequisites: course.prerequisites,
			courseCover: courseCovers[course._id],
			isPublished: course.isPublished,
		}));
		history.push(`/courses/edit/${course._id}`);
	};

	const handleClose = () => {
		setShowModal(false);
		setModalTitle(null);
		setModalContent(null);
		setModalActions(null);
		setShowCreateClass(false);
		setClassRoomName('');
		setClassRoomPassword('');
		setClassRoomConfirmPassword('');
		setClassRoomMaxStudents(25);
		setCourseId(null);
		setError('');
		setClasses([]);
		setShowManageClasses(false);
		setShowEnrolled(false);
		setActiveMenu('classes');
		setAllowUsername('');
	};

	const handleClassClick = (classRoom) => {
		setActiveMenu(classRoom._id);
	};

	const tryAllowUser = async (classRoom) => {
		setLoading(true);
		await axios.post(`/class/allow/${classRoom._id}`, { user: allowUsername }, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
		.then(res => {
			const data = res.data;
			if (data.success) {
				setLoading(false);
				setMessage(data.message);
				setAlert(true);
			}
			else {
				setLoading(false);
				setMessage('Could not add user to the classroom');
				setSeverity('error');
				setAlert(true);
			}
		})
		.catch(err => {
			const mute = err;
			setLoading(false);
			setMessage('Could not add user to the classroom');
			setSeverity('error');
			setAlert(true);
		});
		setAllowUsername('');
	};

	return (
		<Container tutor selected={tabLabels.findIndex(item => filter === item.toLowerCase())}
				heading="Manage Your Courses" tabLabels={tabLabels} filterLabels={filterLabels} searchPlaceholder='Seach Courses' hasFilterButton>
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
					<motion.div style={{padding: '0 20px'}} layout>
						{!showEnrolled && loading && <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<CircularProgress size={32} />
						</div>}
						{!showCreateClass && modalContent}
						{showCreateClass && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{display: 'grid', gridTemplateColumns: '2fr 4fr', gridColumnGap: 20, width: '100%', padding: '10px 0'}}>
							<InputLabel style={{alignSelf: 'center'}}>Classroom name</InputLabel>
							<TextField
								name="classRoomName"
								value={classRoomName}
								onChange={e => setClassRoomName(e.target.value)}
								disabled={loading}
							/>
						</div>
						<div style={{display: 'grid', gridTemplateColumns: '2fr 4fr', gridColumnGap: 20, width: '100%', padding: '10px 0'}}>
							<InputLabel style={{alignSelf: 'center'}}>Password</InputLabel>
							<TextField
								name="classRoomPassword"
								value={classRoomPassword}
								onChange={e => setClassRoomPassword(e.target.value)}
								type='password'
								autoComplete='new-password'
								disabled={loading}
							/>
						</div>
						<div style={{display: 'grid', gridTemplateColumns: '2fr 4fr', gridColumnGap: 20, width: '100%', padding: '10px 0'}}>
							<InputLabel style={{alignSelf: 'center'}}>Confirm password</InputLabel>
							<TextField
								name="classRoomConfirmPassword"
								value={classRoomConfirmPassword}
								onChange={e => setClassRoomConfirmPassword(e.target.value)}
								type='password'
								autoComplete='new-password'
								disabled={loading}
							/>
						</div>
						<div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 3fr', gridColumnGap: 20, width: '100%', padding: '10px 0'}}>
							<InputLabel style={{alignSelf: 'center'}}>Maximum participants</InputLabel>
							<TextField
								name="classRoomMaxStudents"
								value={classRoomMaxStudents}
								inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
								onChange={e => setClassRoomMaxStudents(e.target.value)}
								type='number'
								disabled={loading}
							/>
						</div>
					</div>}
					{showManageClasses && !loading && classes.length > 0 && <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<List>
							<CSSTransition in={activeMenu==='classes'} unmountOnExit timeout={300} classNames="classes-menu-primary">
								<div style={{width: 300, height: 300}}>
									<span style={{color: 'black', paddingLeft: 16, marginBottom: 16}}>Your classes</span>
									<Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
										renderTrackVertical={props => <div {...props} className="track-vertical"/>}
										renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
										renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
										renderView={props => <div {...props} className="view"/>}
										autoHide autoHideTimeout={1000} 
										autoHideDuration={200}>
										{classes
										.sort((a, b) => a.name.localeCompare(b.name))
										.map((classRoom, index) => (
											<ListItem style={{margin: '5px 0', borderRadius: 10, display: 'grid', gridTemplateColumns: '3fr 1fr'}} 
													key={index} button onClick={() => handleClassClick(classRoom)}>
												<span>{classRoom.name}</span>
												<ListItemIcon style={{display: 'flex', justifyContent: 'center'}}>
													<NavigateNextIcon style={{marginRight: 10}} />
												</ListItemIcon>
											</ListItem>
										))}
									</Scrollbars>
								</div>
							</CSSTransition>
							{classes.map(classRoom => (
								<CSSTransition style={{width: '109%'}} in={activeMenu===classRoom._id} unmountOnExit timeout={300} classNames="classes-menu-secondary">
									<>
										<ListItem style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
											<ListItemIcon onClick={() => setActiveMenu('classes')}>
												<div style={listHeadingIconStyle} className='list-heading-icon'>
													<ArrowBackIcon />
												</div>
											</ListItemIcon>
											<span style={{fontSize: '0.95rem', fontWeight: 500, flex: 'auto'}}>{classRoom.name}</span>
										</ListItem>
										<ListItem style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
											<div style={{display: 'grid', width: '100%', gridTemplateColumns: '2fr 3fr 1fr', gridColumnGap: 20, alignItems: 'center'}}>
												<InputLabel style={{alignSelf: 'center'}}>Allow Participant</InputLabel>
												<TextField
													name="classRoomName"
													disabled={loading}
													style={{alignSelf: 'center !important'}}
													value={allowUsername}
													onChange={e => setAllowUsername(e.target.value)}
												/>
												<IconButton style={{width: 50, height: 50}} disabled={allowUsername===''} onClick={() => tryAllowUser(classRoom)}>
													{!loading && <AddIcon />}
													{loading && <CircularProgress size={22} />}
												</IconButton>
											</div>
											<div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50}}>
												<Button>Start Class</Button>
												<Button variant='danger'>Delete Class</Button>
											</div>
										</ListItem>
									</>
								</CSSTransition>
							))}
						</List>
					</div>}
					</motion.div>
				</DialogContentText>
				</DialogContent>
				<DialogActions style={{padding: modalActions || showCreateClass ? 30 : 5}}>
					{!showCreateClass && modalActions}
					{showCreateClass && <>
						<p style={{color: 'red', alignSelf: 'center', margin: 0, paddingRight: 20}}>{error}</p>
						<Button style={{width: '11rem', height: '3rem', marginLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} 
								disabled={error !== '' || loading} onClick={tryCreateClass}>
							{loading && <CircularProgress size={22} />}
							<span style={{paddingLeft: 5}}>Create</span>
						</Button>
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
						<Tile key={key} editable
										onEditClick={() => handleEditClick(course)}
										handleButtonClick={() => manageClasses(course)}
										leftBtnText={(<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
											{loading && showEnrolled && <CircularProgress size={22} />}
											<span style={{paddingLeft: 5}}>View Enrolled Students</span>
										</div>)}
										handleLeftBtnClick={() => viewEnrolledStudents(course)}
										title={course.title} 
										description={course.description} 
										numberOfLessons={course.syllabus.length} 
										rating={course.rating}
										pointsOfInterest={course.pointsOfInterest}
										enrollees={course.enrollees.length}
										difficulty={course.difficulty}
										syllabus={course.syllabus}
										prerequisites={course.prerequisites}
										coverImage={courseCovers[course._id] || bg2} />
				)})}
			</TileList>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<Pagination defaultCurrent={1} total={total} showSizeChanger onChange={handlePageChange} onShowSizeChange={handlePageSizeChange} style={{marginBottom: 35}} />
			</div>
			<Tooltip title="Create a Course">
				<Fab color="secondary" aria-label="add" style={addButtonStyle} color='primary' onClick={() => history.push('/courses/create')}>
					<AddIcon />
				</Fab>
			</Tooltip>
			<Snackbar open={alert} style={{ top: '-670px', zIndex: 999999999999999999 }}>
				<Alert severity={severity} sx={{ width: '100%'}}>
					{message}
				</Alert>
			</Snackbar>
		</Container>
	)
}

export default Courses;