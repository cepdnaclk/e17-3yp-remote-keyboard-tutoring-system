import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import Link from '@material-ui/core/Link';
import { CSSTransition } from "react-transition-group";
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Rating from '@material-ui/lab/Rating';
import { Button } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import Skeleton from '@material-ui/lab/Skeleton';
import { useHistory } from "react-router-dom";

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import LanguageIcon from '@material-ui/icons/Language';
import SignalCellular1BarIcon from '@material-ui/icons/SignalCellular1Bar';
import SignalCellular2BarIcon from '@material-ui/icons/SignalCellular2Bar';
import SignalCellular4BarIcon from '@material-ui/icons/SignalCellular4Bar';

const tileDescriptionStyle = {
    position: 'fixed',
    top: 350,
    background: 'white',
    width: '100%',
    left: 0,
    height: 'calc(100% - 350px)',
    overflowX: 'hidden',
    zIndex: 99999999999999
}

const tileDescriptionContainerStyle = {
    width: '100%',
    minHeight: '100%',
    background: 'var(--container-gradient)',
    padding: '3rem'
}

const container = {
    hidden: { opacity: 0 },
    show: {  opacity: 1 }
}

function getImageLightness(imageSrc,half,callback) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);

        var imageData = ctx.getImageData(0,half ? canvas.height/2 : 0 ,canvas.width,canvas.height/2);
        var data = imageData.data;
        var r,g,b,avg;

        for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width*this.height/2));
        callback(brightness);
    }
}

// TODO: Display tutor's profile picture
function Tile(props) {
    const { title, 
            difficulty, 
            handleButtonClick, 
            description, 
            prerequisites, 
            numberOfLessons, 
            coverImage, 
            facilitatorName, 
            facilitatorUsername, 
            facilitatorPicture, 
            facilitatorCourses, 
            editable, 
            rating, 
            enrollees, 
            syllabus,
            leftBtnText,
            handleLeftBtnClick,
            altBtnText,
            onEditClick} = props;

    const [pictureHover, setPictureHover] = React.useState(false);
    const [tileHover, setTileHover] = React.useState(false);
    const [changePadding, setChangePadding] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [hasDarkBg, setHasDarkBg] = React.useState(false);
    const [bottomHasDarkBg, setBottomHasDarkBg] = React.useState(false);

    const history = useHistory();

    useEffect(() => {
        getImageLightness(coverImage, false, (brightness) => {
            setHasDarkBg(brightness < 128);
        });
        getImageLightness(coverImage, true, (brightness) => {
            setBottomHasDarkBg(brightness < 128);
        });
    }, [coverImage]);

    useEffect(() => {
        if (tileHover) {
            setChangePadding(true);
        } else {
            setTimeout(() => {
                setChangePadding(false);
            }, 300);
        }
    }, [tileHover]);

    useEffect(() => {
        if (!open) setTileHover(false);
    }, [open]);

    const openHandler = () => {
        setOpen(true);
    };

    const closeHandler = () => {
        setOpen(false);
    };

    return (
        <>
            <motion.div layout className={`tile ${open ? 'open' : ''}`}
                    style={{backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', padding: changePadding ? '30px 30px 5px 30px' : '30px'}}
                    whileHover={!open && { boxShadow: ` 0px 0px 3.6px rgba(0, 0, 0, 0.024),
                                                    0px 0px 10px rgba(0, 0, 0, 0.035),
                                                    0px 0px 24.1px rgba(0, 0, 0, 0.046),
                                                    0px 0px 80px rgba(0, 0, 0, 0.07)`, transition: { duration: 0.3 } }}
                    onMouseEnter={() => !open && setTileHover(true)} 
                    onMouseLeave={() => !open && setTileHover(false)} 
                    transition={{ duration: 0.2 }}>
                {open && <motion.div className='overlay' variants={container} initial='hidden' animate='show'></motion.div>}
                <motion.div className='tile-content'>
                    <motion.div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
                        <motion.div className={`tile-header ${open ? 'open' : ''}`}>
                            <motion.h2 layout style={{color: open || hasDarkBg ? 'white' : 'black'}}>{title}</motion.h2>
                            <motion.h4 layout style={{color: hasDarkBg ? 'white' : 'black'}}>{numberOfLessons} Lessons {open ? '| 2h classes' : ''}</motion.h4>
                            {open && <span style={{color: 'white'}}><b>{enrollees}</b> students already enrolled</span>}
                            {open && <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'white', padding: '10px 0'}}>
                                <b style={{paddingRight: 5}}>{rating}</b>
                                <Rating name="read-only" value={rating} precision={0.5} readOnly />
                            </motion.div>}
                            {open && <Button style={
                                        {position: 'absolute', 
                                        bottom: 30, 
                                        width: editable ? '8rem' : '10rem', 
                                        height: editable ? '3rem' : '4rem', 
                                        marginTop: 30, 
                                        fontSize: '1.1em', 
                                        padding: 10}} onClick={handleButtonClick} >
                                {editable ? 'Classes' : altBtnText && altBtnText !== '' ? `${altBtnText}` : <span>Enroll<br/>Starts Oct 15</span>}
                            </Button>}
                        </motion.div>
                        {open && <Link style={{transition: 'box-shadow 0.3s ease'}} onClick={closeHandler}><CancelIcon className='close-btn' style={{color: 'white'}}/></Link>}
                    </motion.div>
                    <motion.div className="tile-footer" onMouseLeave={() => setPictureHover(false)} style={{marginBottom: open ? 20 : 0, justifyContent: 'flex-end'}}>
                        {editable && <motion.div style={{display: 'flex', flexDirection: 'column'}}>
                            <Tooltip title="Edit course" placement='top'>
                                <Fab color="secondary" aria-label="edit" color='primary' onClick={onEditClick} style={{marginLeft: 'auto'}}>
                                    <EditIcon />
                                </Fab>
                            </Tooltip>
                            {open && <span style={{color: 'white'}}>You are previewing this course</span>}
                        </motion.div>}
                        {!editable && <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CSSTransition in={open || pictureHover} unmountOnExit timeout={300} classNames='facilitator-info-slide'>
                                <motion.div className="facilitator-info" onMouseLeave={() => setPictureHover(false) }>
                                    <Link className='facilitator-name' onClick={() => history.push(`/${facilitatorUsername}`)} style={{color: open || bottomHasDarkBg ? 'white' : 'black'}} >{facilitatorName}</Link>
                                    <motion.span style={{color: open || bottomHasDarkBg ? 'white' : 'black'}} >has {facilitatorCourses} more courses</motion.span>
                                </motion.div>
                            </CSSTransition>
                            {facilitatorPicture && <motion.div className='profile-image-container' style={{width: '4rem', height: '4rem'}}>
                                <motion.img src={facilitatorPicture} alt="profile" className='profile-image' onMouseEnter={() => setPictureHover(true)}/>
                            </motion.div>}
                            {!facilitatorPicture && <Skeleton className='profile-image-container' style={{width: '4rem', height: '4rem'}} variant="circular"></Skeleton>}
                        </div>}
                    </motion.div>
                    <CSSTransition in={!open && tileHover} unmountOnExit timeout={300} classNames='up-arrow'>
                        <Link style={{alignSelf: 'center'}} onClick={openHandler} ><KeyboardArrowUpIcon fontSize='large'/></Link>
                    </CSSTransition>
                </motion.div>
            </motion.div>
            {open && <motion.div style={tileDescriptionStyle} layout>
                <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                            renderView={props => <div {...props} className="view"/>}
                            autoHide autoHideTimeout={1000} 
                            autoHideDuration={200}>
                    <motion.div style={tileDescriptionContainerStyle}>
                        <motion.div style={{display: 'flex', flexDirection: 'column', float: 'right'}}>
                            <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <LanguageIcon />
                                <span style={{fontSize: 16, marginLeft: 10}}>English</span>
                            </motion.div>
                            <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                {difficulty === 'Beginner' && <SignalCellular1BarIcon />}
                                {difficulty === 'Intermediate' && <SignalCellular2BarIcon />}
                                {difficulty === 'Expert' && <SignalCellular4BarIcon />}
                                {difficulty === 'Beginner' && <span style={{fontSize: 16, marginLeft: 10, paddingTop: 10}}>Beginner Level</span>}
                                {difficulty === 'Intermediate' && <span style={{fontSize: 16, marginLeft: 10, paddingTop: 10}}>Intermediate Level</span>}
                                {difficulty === 'Expert' && <span style={{fontSize: 16, marginLeft: 10, paddingTop: 10}}>Expert Level</span>}
                            </motion.div>
                        </motion.div>
                        {leftBtnText && <Button variant='outline-secondary' size='md' style={{fontSize: 15}} onClick={handleLeftBtnClick}>{leftBtnText}</Button>}
                        <motion.div style={{paddingTop: 80}}>
                            <h1>About this Course</h1>
                            <div style={{marginLeft: 30}} dangerouslySetInnerHTML={{__html: description}} />
                        </motion.div>
                        {prerequisites[0] !== '' && <motion.div style={{marginTop: 30}}>
                            <h1>Prerequisites</h1>
                            <ul>
                                {prerequisites.length > 0 && prerequisites.map((prerequisite, index) => {
                                    return (
                                        <li style={{marginLeft: 30}}>{prerequisite}</li>
                                    )
                                })}
                            </ul>
                        </motion.div>}
                        <motion.div style={{marginTop: 30}}>
                            <h1>What you'll learn from this Course</h1>
                            {syllabus.map((item, index) => {
                                return (
                                    <motion.div style={{padding: '10px 0', display: 'grid', gridTemplateColumns: '1fr 6fr', gridGap: '10px', alignItems: 'center'}} key={index}>
                                        <h2 style={{margin: 0}}>Week {index + 1}</h2>
                                        <p style={{margin: 0, fontWeight: 500, fontSize: 16}}>{item}</p>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>
                </Scrollbars>
            </motion.div>}
        </>
    )
}

function TileList(props) {
    return (
        <motion.div className="tile-list">
            {props.children}
        </motion.div>
    )
};

export default TileList;

export {
    Tile
}