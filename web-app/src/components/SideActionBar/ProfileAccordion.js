import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { CSSTransition } from "react-transition-group";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useDispatch } from "react-redux";
import Skeleton from '@material-ui/lab/Skeleton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FaceIcon from '@material-ui/icons/Face';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
      margin: 0,
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
      panelBody: {
        border: 'none',
        boxShadow: 'none'
      }
    },
  }));

const listItemStyle = {
	margin: `5px 0`,
	borderRadius: `10px`,
};

const dividerStyle = {
	margin: `5px 0`
};

const listIconStyle = {
	borderRadius: '50%',
	width: '40px',
	height: '40px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: `var(--list-icon)`,
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

const listItemHeadingStyle = {
	fontSize: '0.95rem',
	fontWeight: 500,
    flex: 'auto'
};

const listHeadingStyle = {
	fontSize: '1.1rem',
	fontWeight: 600,
};

const listItemSubHeadingStyle = {
	fontSize: '0.8rem',
	fontWeight: 400,
	color: 'var(--list-sub-heading-color)',
};

const listItemHeadnigContainerStyle = {
	display: 'flex',
	flexDirection: 'column',
};

const listRadioGroupStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
};

const listRadioStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: '0 2rem',
    borderRadius: '10px',
};

const BlueRadio = withStyles({
    root: {
      color: `var(--blue)`,
      '&$checked': {
        color: `var(--blue)`,
      },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

function ProfileAccordion({userName, userImage, handleLogout, onGiveFeedBackClick, onViewProfile, onLanguageAndRegionClick, onThemeChange}) {
    const classes = useStyles();

    const [activeMenu, setActiveMenu] = React.useState('main');
    const [darkMode, setDarkMode] = React.useState('off');

    const handleDarkModeChange = (event) => {
        setDarkMode(event.target.value);
    };

    const handleViewProfileClick = () => {
        setActiveMenu('main');
        onViewProfile();
    };

    return (
        <Accordion elevation={0} style={{backgroundColor: 'transparent', margin: `1rem`, width: '100%', padding: `0 1rem`}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1c-content" id="panel1c-header">
                <div className='profile-accordion'>
                    {userImage && <div className='profile-image-container'>
                        <img src={userImage} alt="profile" className='profile-image'/>
                    </div>}
                    {!userImage && <Skeleton className='profile-image-container' variant="circular"></Skeleton>}
                    <span style={{fontSize: 16, fontWeight: 500}}>{userName}</span>
                </div>
            </AccordionSummary>
            <AccordionDetails className={classes.details} style={{padding: 0, display: 'block'}}>
                <List>
                    <Divider style={dividerStyle} />
                    <CSSTransition in={activeMenu==='main'} unmountOnExit timeout={300} classNames='profile-menu-primary'>
                        <div>
                            <ListItem style={listItemStyle} button>
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <FeedbackIcon />
                                    </div>
                                </ListItemIcon>
                                <div style={listItemHeadnigContainerStyle}>
                                    <span style={listItemHeadingStyle}>Give Feedback</span>
                                    <span style={listItemSubHeadingStyle}>Help us improve our system.</span>
                                </div>
                            </ListItem>
                            <Divider style={dividerStyle} />
                            <ListItem style={listItemStyle} button onClick={() => setActiveMenu('manage-profile')}>
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <SettingsIcon />
                                    </div>
                                </ListItemIcon>
                                <span style={listItemHeadingStyle}>Manage Profile</span>
                                <ListItemIcon>
                                    <NavigateNextIcon style={{marginLeft: '2.5em', order: 2}} />
                                </ListItemIcon>
                            </ListItem>
                            <ListItem style={listItemStyle} button onClick={() => setActiveMenu('change-theme')}>
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <Brightness4Icon />
                                    </div>
                                </ListItemIcon>
                                <span style={listItemHeadingStyle}>Change Theme</span>
                                <ListItemIcon>
                                    <NavigateNextIcon style={{marginLeft: '2.5em', order: 2}} />
                                </ListItemIcon>
                            </ListItem>
                            <ListItem style={listItemStyle} button onClick={handleLogout} >
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <ExitToAppIcon />
                                    </div>
                                </ListItemIcon>
                                <span style={listItemHeadingStyle}>Log Out</span>
                            </ListItem>
                        </div>
                    </CSSTransition>
                    <CSSTransition in={activeMenu==='manage-profile'} unmountOnExit timeout={300} classNames='profile-menu-secondary'>
                        <div>
                            <ListItem style={listItemStyle}>
                                <ListItemIcon onClick={() => setActiveMenu('main')}>
                                    <div style={listHeadingIconStyle} className='list-heading-icon'>
                                        <ArrowBackIcon />
                                    </div>
                                </ListItemIcon>
                                <span style={listHeadingStyle}>Manage Profile</span>
                            </ListItem>
                            <ListItem style={listItemStyle} button onClick={handleViewProfileClick}>
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <FaceIcon />
                                    </div>
                                </ListItemIcon>
                                <span style={listItemHeadingStyle}>Your Profile</span>
                            </ListItem>
                            <ListItem style={listItemStyle} button>
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <LanguageIcon />
                                    </div>
                                </ListItemIcon>
                                <span style={listItemHeadingStyle}>Language and Region</span>
                            </ListItem>
                        </div>
                    </CSSTransition>
                    <CSSTransition in={activeMenu==='change-theme'} unmountOnExit timeout={300} classNames='profile-menu-secondary'>
                        <div>
                            <ListItem style={listItemStyle}>
                                <ListItemIcon onClick={() => setActiveMenu('main')}>
                                    <div style={listHeadingIconStyle} className='list-heading-icon'>
                                        <ArrowBackIcon />
                                    </div>
                                </ListItemIcon>
                                <span style={listHeadingStyle}>Change Theme</span>
                            </ListItem>
                            <ListItem style={listItemStyle}>
                                <ListItemIcon>
                                    <div style={listIconStyle}>
                                        <Brightness4Icon />
                                    </div>
                                </ListItemIcon>
                                <div style={listItemHeadnigContainerStyle}>
                                    <span style={listItemHeadingStyle}>Dark Mode</span>
                                    <span style={listItemSubHeadingStyle}>Adjust the appearance to reduce glare and give your eyes a break.</span>
                                </div>
                            </ListItem>
                            <FormControl component="fieldset" style={{width: '100%'}} onChange={handleDarkModeChange}>
                                <RadioGroup style={listRadioGroupStyle} aria-label="dark-mode" value={darkMode}>
                                    <FormControlLabel className='from-control-radio' style={listRadioStyle} value="off" control={<BlueRadio />} label={<span style={{fontWeight: 500}}>Off</span>} labelPlacement='start' />
                                    <FormControlLabel className='from-control-radio' style={listRadioStyle} value="on" control={<BlueRadio />} label={<span style={{fontWeight: 500}}>On</span>} labelPlacement='start' />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </CSSTransition>
                </List>
            </AccordionDetails>
        </Accordion>
    )
}

export default ProfileAccordion;