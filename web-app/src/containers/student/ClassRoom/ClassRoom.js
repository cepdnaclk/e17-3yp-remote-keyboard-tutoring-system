import React, {useEffect} from 'react';
import Container from '../../../components/Container/Container';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import Tooltip from '@material-ui/core/Tooltip';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useSelector, useDispatch } from 'react-redux';
import { io } from "socket.io-client";
import { Input } from "@material-ui/core";
import Messages from './Messages/Messages';
import OnlineUser from './OnlineUser/OnlineUser';
import { Scrollbars } from 'react-custom-scrollbars';
import { setSideNavClosed } from '../../../reducers/uiParamSlice';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import RaiseHandIcon from '@material-ui/icons/PanTool';
import SendIcon from '@material-ui/icons/Send';
import { SendOutlined } from '@ant-design/icons';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PeopleIcon from '@material-ui/icons/People';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import profileImage from "../../../assets/avatars/student/Asset 1.svg";

let socket;

const containerStyle = {
    display: 'grid',
    gridTemplateRows: '2fr 1fr',
    width: '100%',
    height: '100%',
    gridRowGap: '1rem',
};

const conferenceContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    backgroundColor: 'var(--list-icon)',
    overflow: 'hidden',
};

const sheetContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '15px 15px 0 0',
    background: 'var(--list-icon)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
};

const conferenceControlStyle = {
    position: 'absolute',
    bottom: 'calc(30% + 60px)',
    width: '60%',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
};

const videoStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    flex: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const engageStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--list-icon)',
    flex: '30%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0'
};

const chatStyle = {
    width: '100%',
    height: 'calc(100% - 100px)',
};

const participantStyle = {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 10px'
};

const chatBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    padding: '0 10px',
}

const { REACT_APP_API_URL } = process.env;

function ClassRoom(props) {
    const [showControls, setShowControls] = React.useState(false);
    const [showEngage, setShowEngage] = React.useState(false);
    const [muteAudio, setMuteAudio] = React.useState(false);
    const [videoOff, setVideoOff] = React.useState(false);
    const [micOff, setMicOff] = React.useState(false);
    const [engagePanel, setEngagePanel] = React.useState('participants');
    const [name, setName] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [users, setUsers] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [raiseHand, setRaiseHand] = React.useState(false);
    const [raisedUsers, setRaisedUsers] = React.useState({});
    const userData = useSelector(state => state.userData.data);

    const arr = Object.entries(users);
    const mapped = [];
    arr.forEach(([key, value]) => mapped.push(value));

    useEffect(() => {
        document.title = props.title || `forté | ${props.courseName}`;

        // Prompt when leaving the page.
        window.onbeforeunload = function () {return false;}
    }, [props.title]);

    useEffect(() => {
        const name = userData.username;
        const room = 'room';

        socket = io(`${REACT_APP_API_URL}`, { transports : ['websocket'] });
        setRoom(room);
        setName(name);

        socket.emit('join', {name, room}, () => {
            console.log('User just joined');
        });

        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
        });
        
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });

        socket.on('raiseHandBroadCast', (raisedUsers) => {
            setRaisedUsers(raisedUsers);
        })

        return () => {
            socket.emit('disconnected');
            socket.off();
        }
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
      }

    const handRaise = () => {
        setRaiseHand(!raiseHand);
        socket.emit('raiseHand', {raiseHand, name});
    }

    const handleMouseLeave = () => {
        setTimeout(() => {
            setShowControls(false);
        }, 5000);
    };

    const handleChange = (event, newValue) => {
        if (newValue)
            setEngagePanel(newValue);
    }

	return (
		<Container noHeader noPadding>
			<motion.div style={containerStyle}>
                <motion.div layout style={conferenceContainerStyle} onMouseMove={() => setShowControls(true)} onMouseLeave={handleMouseLeave}>
                    <motion.div style={videoStyle}>
                        <AnimatePresence>
                            {showControls && <motion.div style={conferenceControlStyle}
                                        initial={{opacity: 0, y: '25%'}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: '25%'}}
                                        onMouseMove={() => setShowControls(true)}>
                                {/* TODO: Volume Slider */}
                                <Button className='conference-control' variant='outline-primary' style={{borderRadius: '50%', width: 50, height: 50}}>
                                    <VolumeUpIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>
                                </Button>
                                {/* Video toggle button */}
                                <Tooltip title={videoOff ? 'Turn on video' : 'Turn off video'} placement='top'>
                                    <Button className='conference-control' variant='outline-primary' style={{borderRadius: '50%', width: 50, height: 50}}
                                        onClick={() => setVideoOff(!videoOff)}>
                                        {!videoOff && <VideocamIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>}
                                        {videoOff && <VideocamOffIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>}
                                    </Button>
                                </Tooltip>
                                {/* Mic toggle button */}
                                <Tooltip title={micOff ? 'Unute microphone' : 'Mute microphone'} placement='top'>
                                    <Button className='conference-control' variant='outline-primary' style={{borderRadius: '50%', width: 50, height: 50}}
                                        onClick={() => setMicOff(!micOff)}>
                                        {!micOff && <MicIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>}
                                        {micOff && <MicOffIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>}
                                    </Button>
                                </Tooltip>
                                {/* Leave room button */}
                                <Button className='conference-control' variant='danger' style={{width: '6rem', height: '2rem'}}>Leave</Button>
                                {/* Raise / Lower hand button */}
                                <Tooltip title={raiseHand ? 'Lower hand' : 'Raise hand'} placement='top'>
                                    <Button className='conference-control' variant='outline-primary' style={{borderRadius: '50%', width: 50, height: 50}}
                                        onClick={e => handRaise(e)}>
                                        <RaiseHandIcon style={{fontSize: '1.5rem', color: raiseHand ? 'var(--blue)' : 'var(--dark-gray)'}}/>
                                    </Button>
                                </Tooltip>
                                {/* Engage with others button */}
                                <Tooltip title='Engage with others' placement='top'>
                                    <Button className='conference-control' variant='outline-primary' style={{borderRadius: '50%', width: 50, height: 50}}
                                        onClick={() => setShowEngage(!showEngage)}>
                                        <PeopleIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>
                                    </Button>
                                </Tooltip>
                                {/* More options button */}
                                <Tooltip title='More options' placement='top'>
                                    <Button className='conference-control' variant='outline-primary' style={{borderRadius: '50%', width: 50, height: 50}}>
                                        <MoreHorizIcon style={{fontSize: '1.5rem', color: 'var(--dark-gray)'}}/>
                                    </Button>
                                </Tooltip>
                            </motion.div>}
                        </AnimatePresence>
                        {/* TODO (FUTURE IMPROVEMENT): Video streaming should be rendered here. */}
                        <h1>Test</h1>
                    </motion.div>
                    {showEngage && <motion.div style={engageStyle}
                        initial={{opacity: 0, x: '25%'}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: '25%'}}>
                         <ToggleButtonGroup
                            color="primary"
                            value={engagePanel}
                            exclusive
                            onChange={handleChange}
                        >
                            <ToggleButton value="participants">
                                <PeopleIcon style={{fontSize: '1.2rem', color: 'var(--dark-gray)'}}/>
                                <span>Participants</span>
                            </ToggleButton>
                            <ToggleButton value="chat">
                                <ChatBubbleIcon style={{fontSize: '1.2rem', color: 'var(--dark-gray)'}}/>
                                <span>Chat</span>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {/* Chat Container */}
                        {engagePanel === 'chat' && <motion.div style={chatStyle}
                            initial={{opacity: 0, x: '25%'}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: '25%'}}>
                            <Messages messages={messages} name={userData.username} />
                        </motion.div>}
                        {/* Participants Container */}
                        {engagePanel === 'participants' && <motion.div style={participantStyle}
                            initial={{opacity: 0, x: '-25%'}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: '-25%'}}>
                            {/* TODO: Implement Participants List */}
                            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                            renderView={props => <div {...props} className="view"/>}
                            autoHide autoHideTimeout={1000} 
                            autoHideDuration={200}>
                                <div style={{display:'flex', flexDirection:'column', height: '100%', padding: '20px 0'}}>
                                    <OnlineUser name={`${userData.firstName} ${userData.lastName}`} raised={raiseHand} profileImage={profileImage}/>
                                    {mapped.map(d => d.name !== userData.username && (
                                        <OnlineUser name={d.name} raised={raisedUsers[`${d.name}`]} profileImage={profileImage}/>
                                    ))}
                                </div>
                            </Scrollbars>
                        </motion.div>}
                        {engagePanel === 'chat' && <div style={{display:'flex', flexDirection: 'row', position: 'fixed', bottom: 20}}>
                            <Input
                                id="outlined-basic"
                                placeholder="Type a message..."
                                type="text"
                                value={message}
                                label="Outlined"
                                variant="outlined"
                                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                onChange={({ target: { value } }) => setMessage(value)}
                            />
                            <button style={{border: 0, backgroundColor: 'transparent', width: 50, height: 30, marginLeft: 5, marginBottom: 5, cursor: 'pointer'}}
                                    onClick={e => sendMessage(e)}>
                                <SendIcon style={{fontSize: '1.5rem', color: 'var(--blue)'}}/>
                            </button>
                        </div>}
                    </motion.div>}
                </motion.div>
                <motion.div style={sheetContainerStyle}>
                    <span>Real time sheet music will be displayed here</span>
                </motion.div>
            </motion.div>
		</Container>
	)
}

export default ClassRoom;