import React, { useEffect } from 'react';
import { Router, Route } from 'react-router';
import { spring, AnimatedSwitch } from 'react-router-transition';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import SideActionBar from '../../components/SideActionBar/SideActionBar';
import axios from "axios";
import { motion } from "framer-motion";
import { useIdleTimer } from 'react-idle-timer';
import { Button } from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '../../components/SideNavBar/MenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { trySilentRefresh } from "../../utils/authUtils";
import { setAccessToken } from "../../reducers/userDataSlice";
import { useHistory } from 'react-router-dom';
import Home from './Home/Home';
import Courses from './Courses/Courses';
import CreateCourse from './CreateCourse/CreateCourse';
import EditCourse from './EditCourse/EditCourse';
import Settings from './Settings/Settings';
import Help from './Help/Help';
import Profile from '../../components/Profile/Profile';
import Page404 from '../../components/Page404/Page404';

import homeIcon from '../../assets/icons/home.svg';
import coursesIcon from '../../assets/icons/courses.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import helpIcon from '../../assets/icons/help.svg';

import avatar1 from "../../assets/avatars/tutor/Asset 1.svg";
import avatar2 from "../../assets/avatars/tutor/Asset 2.svg";
import avatar3 from "../../assets/avatars/tutor/Asset 3.svg";
import avatar4 from "../../assets/avatars/tutor/Asset 4.svg";
import avatar5 from "../../assets/avatars/tutor/Asset 5.svg";
import avatar6 from "../../assets/avatars/tutor/Asset 6.svg";
import avatar7 from "../../assets/avatars/tutor/Asset 7.svg";
import avatar8 from "../../assets/avatars/tutor/Asset 8.svg";
import avatar9 from "../../assets/avatars/tutor/Asset 9.svg";
import avatar10 from "../../assets/avatars/tutor/Asset 10.svg";
import avatar11 from "../../assets/avatars/tutor/Asset 11.svg";
import avatar12 from "../../assets/avatars/tutor/Asset 12.svg";
import avatar13 from "../../assets/avatars/tutor/Asset 13.svg";
import avatar14 from "../../assets/avatars/tutor/Asset 14.svg";
import avatar15 from "../../assets/avatars/tutor/Asset 15.svg";
import avatar16 from "../../assets/avatars/tutor/Asset 16.svg";
import avatar17 from "../../assets/avatars/tutor/Asset 17.svg";
import avatar18 from "../../assets/avatars/tutor/Asset 18.svg";
import avatar19 from "../../assets/avatars/tutor/Asset 19.svg";
import avatar20 from "../../assets/avatars/tutor/Asset 20.svg";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15, avatar16, avatar17, avatar18, avatar19, avatar20];

// we need to map the `scale` prop we define below
// to the transform style property
function mapStyles(styles) {
	return {
	  opacity: styles.opacity,
	  transform: `translateY(${ styles.translateY }px)`,
	};
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
	return spring(val, {
	  stiffness: 400,
	  damping: 90,
	});
}

// child matches will...
const bounceTransition = {
	// start in a transparent, upscaled state
	atEnter: {
	  opacity: 0,
	  translateY: -50,
	},
	// leave in a transparent, downscaled state
	atLeave: {
	  opacity: bounce(1),
	  translateY: 0,
	},
	// and rest at an opaque, normally-scaled state
	atActive: {
	  opacity: bounce(1),
	  translateY: 0,
	},
};

const container = {
    hidden: { scale: 1.5, opacity: 0 },
    show: {  scale: 1, opacity: 1 }
}


// TODO: Put a loading backdrop while dynamic content loads
function TutorApp() {
	// Set idle timout to 15 minutes.
	const timeout = 1000 * 60 * 15;
	const userData = useSelector(state => state.userData.data);
	const dispatch = useDispatch();
	const history = useHistory();

	const [profileImage, setProfileImage] = React.useState(null);
	const [timedOut, setTimedOut] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);
	const [remainingTime, setRemainingTime] = React.useState(timeout);
	const [loggedOut, setLoggedOut] = React.useState(false);

	const handleOnIdle = () => {
		if (timedOut) {
			localStorage.setItem('loggedOut', 'You have been logged out due to inactivity. Please log in again.');
			handleLogOut();
		}
		else {
			setShowModal(true);
			reset();
			setTimedOut(true);
		}
	};

	const handleOnActive = () => {
		if (!showModal) setTimedOut(false);
	};

	const handleOnAction = () => {
		if (!showModal) setTimedOut(false);
	};

	const {reset, getRemainingTime} = useIdleTimer({
		timeout: timeout,
		onIdle: handleOnIdle,
		onActive: handleOnActive,
		onAction: handleOnAction,
		debounce: 500
	});

	useEffect(() => {
		setRemainingTime(getRemainingTime);

		setInterval(() => {
			setRemainingTime(getRemainingTime());
		}, 1000);

		// Silence refresh.
		setInterval(async () => {
			const res = await trySilentRefresh().then((data) => {
				if (data) {
					dispatch(setAccessToken(data.accessToken));
					return true;
				}
				return false;
			});

			if (!res) {
				localStorage.setItem('loggedOut', 'Your session has been expired! Please log in again.');
				handleLogOut();
			}
		}, userData.accessToken.expiry);
	}, []);

	useEffect(() => {
		if (profileImage === null) {
			if (userData.avatar.includes('default:')) setProfileImage(avatars[parseInt(userData.avatar.split(':')[1])]);
			else {
				const requestOptions = {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`,
					},
				};
				fetch(`/${userData.role}/info/${userData.id}/${userData.avatar}`, requestOptions)
				.then(response => response.blob())
				.then(blob => {
					setProfileImage(URL.createObjectURL(blob));
				})
				.catch(err => {
					const ignore = err;
				});
			}
		}
	}, [profileImage, userData.avatar]);

	useEffect(() => {
		if (loggedOut) window.location.href = '/login';
	}, [loggedOut]);

	const handleLogOut = () => {
		axios.post('/auth/revokeToken', {}, {headers: {'Authorization': `Bearer ${userData.accessToken.token}`}})
		.then(() => {
			setShowModal(false);
			setLoggedOut(true);
		});
	};

	const handleStay = () => {
		setShowModal(false);
		reset();
	};

	return (
		<Router history={history}>
			<motion.div className="container"
						variants={container}
						initial='hidden'
						animate='show'>
				<Dialog
					open={showModal}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					style={{zIndex: '999999999999999999999'}}
				>
					<DialogTitle id="alert-dialog-title">
						<h3>You've been idle!</h3>
					</DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You are about to be logged out in {remainingTime > 1000 * 60 ? Math.floor(1 + remainingTime / (1000 * 60)) : Math.floor(1 + remainingTime / 1000)} {remainingTime > 1000 * 60 ? 'minutes' : 'seconds'} due to inactivity. Do you want to stay logged in?
					</DialogContentText>
					</DialogContent>
					<DialogActions style={{padding: 30}}>
						<Button variant='outline-primary' onClick={handleLogOut} style={{width: '11rem', height: '3rem', marginRight: 10}}>Log Out</Button>
						<Button onClick={handleStay} style={{width: '11rem', height: '3rem', marginLeft: 10}}>Stay</Button>
					</DialogActions>
				</Dialog>
				<SideNavBar brandName="forté" actionButtonName='Create a Course' action='/courses/create' hideAction={window.location.pathname==='/courses'} >
					<MenuItem icon={homeIcon} itemName="Home" selected={window.location.pathname==='/'} to={'/'} />
                    <MenuItem icon={coursesIcon} itemName="Courses" selected={window.location.pathname==='/courses'} to={'/courses'} />
                    <MenuItem icon={settingsIcon} itemName="Settings" selected={window.location.pathname==='/settings'} to={'/settings'} />
                    <MenuItem icon={helpIcon} itemName="Help" selected={window.location.pathname==='/help'} to={'/help'} />
				</SideNavBar>
				<AnimatedSwitch atEnter={bounceTransition.atEnter}
								atLeave={bounceTransition.atLeave}
								atActive={bounceTransition.atActive}
								mapStyles={mapStyles}
								className="switch-wrapper">
					<Route path="/" exact component={Home} />
					<Route path="/courses" exact component={Courses} />
					<Route path="/courses/create" component={CreateCourse} />
					<Route path="/courses/edit/:id" component={EditCourse} />
					<Route path="/courses/*" component={Page404} />
					<Route path="/settings" exact component={Settings} />
					<Route path="/settings/*" component={Page404} />
					<Route path="/help" exact component={Help} />
					<Route path="/help/*" component={Page404} />
					<Route path="/:username" component={Profile} />
				</AnimatedSwitch>
				<SideActionBar 
						userName={`${userData.firstName} ${userData.lastName}`} 
						userImage={profileImage} 
						handleLogout={handleLogOut} 
						onViewProfile={() => history.push(`/${userData.username}`)} />
			</motion.div>
		</Router>
	)
}

export default TutorApp;