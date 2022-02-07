import React, { useEffect } from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import AvatarUploader from '../AvatarUploader';
import { Button } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import StudentApp from "../../containers/student/StudentApp";
import TutorApp from "../../containers/tutor/TutorApp";
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import { Scrollbars } from 'react-custom-scrollbars';
import { setAvatar } from "../../reducers/userDataSlice";

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import avatar1 from "../../assets/avatars/student/Asset 1.svg";
import avatar2 from "../../assets/avatars/student/Asset 3.svg";
import avatar3 from "../../assets/avatars/student/Asset 4.svg";
import avatar4 from "../../assets/avatars/student/Asset 5.svg";
import avatar5 from "../../assets/avatars/student/Asset 6.svg";
import avatar6 from "../../assets/avatars/student/Asset 7.svg";
import avatar7 from "../../assets/avatars/student/Asset 8.svg";
import avatar8 from "../../assets/avatars/student/Asset 9.svg";
import avatar9 from "../../assets/avatars/student/Asset 10.svg";
import avatar10 from "../../assets/avatars/student/Asset 11.svg";
import avatar11 from "../../assets/avatars/student/Asset 12.svg";
import avatar12 from "../../assets/avatars/student/Asset 13.svg";
import avatar13 from "../../assets/avatars/student/Asset 14.svg";
import avatar14 from "../../assets/avatars/student/Asset 15.svg";
import avatar15 from "../../assets/avatars/student/Asset 16.svg";
import _avatar1 from "../../assets/avatars/tutor/Asset 1.svg";
import _avatar2 from "../../assets/avatars/tutor/Asset 2.svg";
import _avatar3 from "../../assets/avatars/tutor/Asset 3.svg";
import _avatar4 from "../../assets/avatars/tutor/Asset 4.svg";
import _avatar5 from "../../assets/avatars/tutor/Asset 5.svg";
import _avatar6 from "../../assets/avatars/tutor/Asset 6.svg";
import _avatar7 from "../../assets/avatars/tutor/Asset 7.svg";
import _avatar8 from "../../assets/avatars/tutor/Asset 8.svg";
import _avatar9 from "../../assets/avatars/tutor/Asset 9.svg";
import _avatar10 from "../../assets/avatars/tutor/Asset 10.svg";
import _avatar11 from "../../assets/avatars/tutor/Asset 11.svg";
import _avatar12 from "../../assets/avatars/tutor/Asset 12.svg";
import _avatar13 from "../../assets/avatars/tutor/Asset 13.svg";
import _avatar14 from "../../assets/avatars/tutor/Asset 14.svg";
import _avatar15 from "../../assets/avatars/tutor/Asset 15.svg";
import _avatar16 from "../../assets/avatars/tutor/Asset 16.svg";
import _avatar17 from "../../assets/avatars/tutor/Asset 17.svg";
import _avatar18 from "../../assets/avatars/tutor/Asset 18.svg";
import _avatar19 from "../../assets/avatars/tutor/Asset 19.svg";
import _avatar20 from "../../assets/avatars/tutor/Asset 20.svg";
import { defaultAvatarSelected } from "../../reducers/avatarUploadSlice";

const studentAvatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15];
const tutorAvatars = [_avatar1, _avatar2, _avatar3, _avatar4, _avatar5, _avatar6, _avatar7, _avatar8, _avatar9, _avatar10, _avatar11, _avatar12, _avatar13, 
    _avatar14, _avatar15, _avatar16, _avatar17, _avatar18, _avatar19, _avatar20];

const avatarContainerStyle = {
    width: '100%',
    height: '100vh',
    background: 'var(--container-gradient-medium)',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}

const container = {
    hidden: { opacity: 0 },
    show: {  opacity: 1 }
}

const item = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.8 }
    },
    show: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
}

const outline = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3 }
    },
    show: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
}

const avatarListContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    rowGap: 30,
    columnGap: 30,
    padding: '2rem',
    justifyContent: 'center',
    maxHeight: '50vh',
}

const containerStyle = {
    backgroundColor: 'var(--bg-light-gray)', 
    borderRadius: '20px', 
    width: 600, 
    height: '52%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const avatarStyle = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    position: 'relative',
    cursor: 'pointer',
    background: 'white'
}

const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30
};

const continueStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: '3rem',
}

function Avatar({ avatar, isSelected, onClick }) {
    return (
      <motion.div layout onClick={onClick} style={avatarStyle}>
        <motion.img layout src={avatar} alt="avatar" style={avatarStyle} />
        {isSelected && (
            <motion.div
            layoutId="outline"
            className="outline"
            initial={false}
            transition={spring}
            variants={outline}
            />
        )}
      </motion.div>
    );
}

export default function Setup() {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData.data);
    const avatarPicture = useSelector(state => state.avatarUpload.avatarPictureFormData);

    const [loaded, setLoaded] = React.useState(true);
    const [selected, setSelected] = React.useState(0);
    const [one, setOne] = React.useState(false);
    const [two, setTwo] = React.useState(false);
    const [three, setThree] = React.useState(false);
    const [four, setFour] = React.useState(false);
    const [five, setFive] = React.useState(false);
    const [six, setSix] = React.useState(false);
    const [closing, setClosing] = React.useState(false);
    const [close, setClose] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    useEffect(() => {
        if (!closing)
            setTimeout(() => {
                setOne(true);
            }, 1000);
    }, [closing]);

    useEffect(() => {
        if (avatarPicture)
            setSelected(null);
    }, [avatarPicture]);

    useEffect(() => {
        if (!closing)
            setTimeout(() => {
                setTwo(true);
            }, 2000);
        else {
            setTimeout(() => {
                setLoaded(false);
            }, 300);
            setTimeout(() => {
                setClose(true);
            }, 350);
        }
    }, [one, closing]);

    useEffect(() => {
        if (!closing)
            setTimeout(() => {
                setThree(true);
            }, 2500);
        else
            setTimeout(() => {
                setOne(false);
            }, 250);
    }, [two, closing]);

    useEffect(() => {
        if (!closing)
            setTimeout(() => {
                setFour(true);
            }, 2800);
        else
            setTimeout(() => {
                setTwo(false);
            }, 200);
    }, [three, closing]);

    useEffect(() => {
        if (!closing)
            setTimeout(() => {
                setFive(true);
            }, 3100);
        else
            setTimeout(() => {
                setThree(false);
            }, 150);
    }, [four, closing]);

    useEffect(() => {
        if (!closing) {
            setTimeout(() => {
                setSix(true);
            }, 3400);
        }
        else {
            setTimeout(() => {
                setFour(false);
            }, 100);
        }
    }, [five, closing]);

    const handleContinue = async () => {
        setUploading(true);

        if (selected) {
            await axios.post(`/${userData.role}/avatar/${userData.id}`, {avatar: selected}, {
                headers: {'Authorization': 'Bearer ' + userData.accessToken.token + ' ' + userData.id},
            })
            .then(response => {
                const data = response.data;

                if (response.status >= 500) return Promise.reject("Server error! Please try again");

                if (!data.success) {
                    const err = data.message;
                    return Promise.reject(err);
                }
            })
            .catch(err => {
                const ignore = err;
            });
        }

        await axios.get(`/${userData.role}/info/${userData.id}`, {headers: {'Authorization': `Bearer ${userData.accessToken.token} ${userData.id}`}})
        .then(response => {
            const data = response.data;

            if (response.status >= 500) return Promise.reject("Server error! Please try again");

            if (!data.success) {
                const err = data.message;
                return Promise.reject(err);
            }

            dispatch(setAvatar(data.data.avatar));
        })
        .catch(err => {
            const ignore = err;
        });

        setClosing(true);
        setTimeout(() => {
            setSix(false);
            setFive(false);
        }, 50);
    }

    if (close)
        return (<Route path="*" component={userData.role === 'student' ? StudentApp : TutorApp} exact />);
    else
        return (
            loaded && <motion.div
                style={avatarContainerStyle}
                variants={container}
                initial="hidden"
                animate='show'>
                {one && <motion.h1 layout style={{fontSize: 24}} variants={item}>Welcome {userData.firstName}</motion.h1>}
                {two && <motion.h1 style={{fontWeight: 600}} layout variants={item}>Choose the avatar that suits you best</motion.h1>}
                {three && <AnimateSharedLayout>
                    <motion.div layout variants={item} style={containerStyle}>
                        <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                                renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                                renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                                renderView={props => <div {...props} className="view"/>}
                                autoHide autoHideTimeout={1000} autoHideDuration={200}>
                            <motion.div layout variants={item} style={avatarListContainerStyle}>
                                {(userData.role === 'student' ? studentAvatars : tutorAvatars).map((avatar, i) => <Avatar
                                                            key={avatar}
                                                            variants={item}
                                                            avatar={avatar}
                                                            isSelected={selected === i}
                                                            onClick={() => {
                                                                setSelected(i);
                                                                dispatch(defaultAvatarSelected(i));
                                                            }}/>)}
                            </motion.div>
                        </Scrollbars>
                    </motion.div>
                </AnimateSharedLayout>}
                {four && <motion.h3 layout style={{marginTop: 30, marginBottom: 20}} variants={item}>Or upload a picture of you</motion.h3>}
                {five && 
                <motion.div layout variants={item}>
                    <AvatarUploader
                        size={100}
                        fileType={"image/*"}
                        uploadURL={`/${userData.role}/avatar/${userData.id}`}
                        customHeaders={{'Authorization': 'Bearer ' + userData.accessToken.token + ' ' + userData.id}}
                        name='avatar-upload'/>
                </motion.div>}
                {six &&
                <motion.div layout variants={outline}>
                    <Button style={continueStyle} variant="outline-secondary" onClick={handleContinue} disabled={uploading} >
                        <motion.span style={{fontWeight: 500, display: 'flex', alignItems: 'center'}}>
                            {!uploading && <span>Continue</span>}
                            {!uploading && <KeyboardArrowRightIcon />}
                            {uploading && <CircularProgress size={24} />}
                        </motion.span>
                    </Button>
                </motion.div>}
            </motion.div>
        );
}