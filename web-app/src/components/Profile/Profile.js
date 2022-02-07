import React, {useEffect} from 'react';
import Container from '../Container/Container';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import axios from 'axios';
import Skeleton from '@material-ui/lab/Skeleton';
import { motion } from 'framer-motion';
import CircularProgress from '@material-ui/core/CircularProgress';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import CakeIcon from '@material-ui/icons/Cake';
import DateRangeIcon from '@material-ui/icons/DateRange';

import cover1 from '../../assets/images/Cover 1.jpg';
import NotFound from '../../assets/images/no_data.svg'

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

import s_avatar1 from "../../assets/avatars/student/Asset 1.svg";
import s_avatar2 from "../../assets/avatars/student/Asset 3.svg";
import s_avatar3 from "../../assets/avatars/student/Asset 4.svg";
import s_avatar4 from "../../assets/avatars/student/Asset 5.svg";
import s_avatar5 from "../../assets/avatars/student/Asset 6.svg";
import s_avatar6 from "../../assets/avatars/student/Asset 7.svg";
import s_avatar7 from "../../assets/avatars/student/Asset 8.svg";
import s_avatar8 from "../../assets/avatars/student/Asset 9.svg";
import s_avatar9 from "../../assets/avatars/student/Asset 10.svg";
import s_avatar10 from "../../assets/avatars/student/Asset 11.svg";
import s_avatar11 from "../../assets/avatars/student/Asset 12.svg";
import s_avatar12 from "../../assets/avatars/student/Asset 13.svg";
import s_avatar13 from "../../assets/avatars/student/Asset 14.svg";
import s_avatar14 from "../../assets/avatars/student/Asset 15.svg";
import s_avatar15 from "../../assets/avatars/student/Asset 16.svg";

const tutorAvatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15, avatar16, avatar17, avatar18, avatar19, avatar20];
const studentAvatars = [s_avatar1, s_avatar2, s_avatar3, s_avatar4, s_avatar5, s_avatar6, s_avatar7, s_avatar8, s_avatar9, s_avatar10, s_avatar11, s_avatar12, s_avatar13, s_avatar14, s_avatar15];

const profileNameStyle = {
    display: 'flex', 
    flexDirection: 'column', 
    marginLeft: 20,
};

const profileImageStyle = {
    width: '10rem', 
    height: '10rem', 
    borderRadius: '50%', 
    border: `var(--blue) solid 3px`,
    cursor: 'pointer',
    backgroundColor: 'white',
};

const basicInfoBarStyle = {
    width: '100%',
    height: '6rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '0 4rem'
};

const convert2DOB = (date) => {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dateArr = date.split('-');
    return months[Number(dateArr[1]) - 1] + ' ' + dateArr[2].split('T')[0] + ', ' + dateArr[0];
};

const convert2Joined = (date) => {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dateArr = date.split('-');
    return months[Number(dateArr[1]) - 1] + ' ' + dateArr[0];
};

function Profile(props) {
    const userData = useSelector(state => state.userData.data);
    const [searchData, setSearchData] = React.useState(null);
    const [profileImage, setProfileImage] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { username } = useParams();

    useEffect(async () => {
        setLoading(true);
        if (userData.username === username) setSearchData(userData);
        else {
            await axios.get(`/user/info?username=${username}`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`
                }
            })
            .then(res => {
                const data = res.data;
                if (data.success) setSearchData(data.data);
            })
            .catch(err => {
                const mute = err;
            });
        }
        setLoading(false);
    }, [username]);

    useEffect(() => {
        if (searchData) {
            setLoading(true);
            document.title = props.title || `forté | ${searchData.firstName + ' ' + searchData.lastName}`;

            if (searchData.avatar.includes('default:')) setProfileImage([studentAvatars, tutorAvatars][searchData.role === 'student' ? 0 : 1][parseInt(searchData.avatar.split(':')[1])]);
            else {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`,
                    },
                };
                fetch(`/${searchData.role}/info/${searchData._id}/${searchData.avatar}`, requestOptions)
                .then(response => response.blob())
                .then(blob => {
                    setProfileImage(URL.createObjectURL(blob));
                })
                .catch(err => {
                    const ignore = err;
                });
            }

            setLoading(false);
        }
    }, [searchData]);

	return (
		<Container zeroPadding noHeader>
            {!searchData && loading && <div style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <CircularProgress size={32} />
            </div>}
            {searchData && <>
                <motion.div style={{backgroundImage: `url('${cover1}')`, backgroundPosition: 'center', backgroundSize: 'cover', width: '100%', height: '35vh'}}>
                    <div className='user-profile-header'>
                        {!loading && <motion.img src={profileImage} style={profileImageStyle} whileTap={{scale: 0.95, transition: {duration: 0.2}}}/>}
                        {loading && <Skeleton variant="circle" width={'10rem'} height={'10rem'} />}
                        {!loading && <div style={profileNameStyle}>
                            <h2 style={{margin: 0}}>{`${searchData.firstName} ${searchData.lastName}`}</h2>
                            <h3 style={{color: 'var(--dark-gray)'}}>{`@${searchData.username}`}</h3>
                        </div>}
                        {loading && <div style={profileNameStyle}>
                            <Skeleton variant="rectangular" width={200} height={30} style={{marginBottom: 10}} />
                            <Skeleton variant="rectangular" width={100} height={30} />
                        </div>}
                    </div>
                </motion.div>
                <div style={basicInfoBarStyle}>
                    <div style={{display: 'flex', flexDirection: 'row', paddingTop: 20, alignItems: 'center'}}>
                        <LocationOnIcon />
                        {loading && <Skeleton variant="rectangular" width={50} height={20} />}
                        {!loading && <span style={{marginLeft: 10, fontSize: 15}}>{`From ${searchData.country}`}</span>}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', paddingTop: 20, alignItems: 'center'}}>
                        <CakeIcon />
                        {loading && <Skeleton variant="rectangular" width={50} height={20} />}
                        {!loading && <span style={{marginLeft: 10, fontSize: 15}}>{`Born ${convert2DOB(searchData.DOB)}`}</span>}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', paddingTop: 20, alignItems: 'center'}}>
                        <DateRangeIcon />
                        {loading && <Skeleton variant="rectangular" width={50} height={20} />}
                        {!loading && <span style={{marginLeft: 10, fontSize: 15}}>{`Joined ${convert2Joined(searchData.date)}`}</span>}
                    </div>
                </div>
            </>}
            {!searchData && !loading && <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <h1 style={{fontWeight: 800, fontSize: 52}}>Oops!</h1>
                <p style={{color: 'var(--dark-gray)'}}>We couldn't find the page you're looking for.</p>
                <p style={{color: 'var(--dark-gray)'}}>Maybe this page does not exist🤔</p>
                <img src={NotFound} style={{width: '15rem', height: '15rem', marginTop: 50}} />
            </div>}
		</Container>
	)
}

export default Profile;