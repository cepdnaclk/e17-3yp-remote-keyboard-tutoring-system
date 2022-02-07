import React, { useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Button } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import DividerWithText from './components/DividerWithText/DividerWithText';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import GoogleLogo from './assets/logos/Googlec Logo.png';
import ErrorIcon from '@material-ui/icons/Error';

const {REACT_APP_GOOGLE_CLIENT_ID} = process.env;

const containerStyle = {
    background: 'white',
    borderRadius: '8px',
    width: '400px',
    height: '635px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    boxShadow: `0.2px 0.2px 2.7px rgba(0, 0, 0, 0.037),
                0.6px 0.5px 6.9px rgba(0, 0, 0, 0.053),
                1.2px 1.1px 14.2px rgba(0, 0, 0, 0.067),
                2.6px 2.2px 29.2px rgba(0, 0, 0, 0.083),
                7px 6px 80px rgba(0, 0, 0, 0.12)`
}

const headerStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
}

const logoStyle = {
    fontWeight: 'bold',
    fontSize: '36px',
    color: 'var(--blue)',
    textDecoration: 'none',
    marginBottom: '10px',
}

const formStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
}

const subheadingStyle = {
    fontSize: '28px',
    fontWeight: 400,
    color: 'var(--heading-color)',
}

const textFieldStyle = {
    width: '100%',
    margin: '20px 0',
    outline: 'none',
}

const useStyles = makeStyles({
    cssLabel: {
      color : 'rgba(0, 0, 0, 0.4)',
    },

    cssLabelError: {
      color : 'red !important',
    },

    textField: {
        height: '35px',
    },

    cssOutlinedInput: {
      '&$cssFocused $notchedOutline': {
        borderColor: `var(--blue) !important`,
      }
    },
    
    cssOutlinedInputError: {
      '&$cssFocused $notchedOutline': {
        borderColor: `red !important`,
      }
    },

    cssFocused: {},

    notchedOutline: {
      borderColor: 'rgba(0, 0, 0, 0.4) !important',
    },
    
    notchedOutlineError: {
      borderColor: 'red !important',
    },
});

const linkStyle = {
    color: 'var(--blue)',
    fontWeight: 550,
    margin: '10px 0 10px 0'
}

const btnTextStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
}

export default function Login(props) {
    useEffect(() => {
        document.title = props.title || "forté | Login";
    }, [props.title]);

    const [login, setLogin] = React.useState(['', '']);
    const [showPassword, setShowPassword] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(true);
    const [inputDisabled, setInputDisabled] = React.useState(false);
    const [loggingIn, setLoggingIn] = React.useState(false);
    const [error, setError] = React.useState('');

    const dispatch = useDispatch();

    const classes = useStyles();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('user')) setLogin([params.get('user'), '']);
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const sendLogin = () => {
        setLoggingIn(true);

        axios.post('/auth/login', { login: login[0], password: login[1] }, { withCredentials: true })
        .then(async response => {

            setInputDisabled(true);
            setBtnDisabled(true);

            window.location.href = '/';
        })
        .catch(err => {
            const status = err.response.status;
            if (status >= 500) setError("Server error! Please try again");

            if (status !== 200) setError("Invalid username or password");

            setLoggingIn(false);
            setLogin([login[0], '']);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (login[0].indexOf('@') === -1)  sendLogin();
        else {
            if (validateEmail(login[0])) sendLogin();
            else setError("Invalid email address");
        }
    };

    // TODO: Add a google login handler
    const handleGoogleLogin = () => {
        
    };

    const usernameChange = (e) => {
        setLogin([e.target.value.trim(), login[1]]);
        setError('');
    };

    const passwordChange = (e) => {
        setLogin([login[0], e.target.value]);
        setError('');
    };

    useEffect(() => {
        if (login[0] === '' || login[1] === '') {
            setBtnDisabled(true);
        } else {
            setBtnDisabled(false);
        }
    }, [login]);

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <Link href='/' style={logoStyle}>forté</Link>
                <h1 style={subheadingStyle}>Log in</h1>
                <span>Log into the forté Tutoring System.</span>
            </header>
            <form style={formStyle} noValidate autoComplete='off' onSubmit={handleSubmit} >
                <TextField style={textFieldStyle} className={classes.textField} autoComplete="off" autoCorrect="off" autoCapitalize="off"
                        disabled={inputDisabled}
                        spellCheck={false} label="Username or email address" variant='outlined' onChange={usernameChange}
                            InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused,
                            },
                            }}
                            InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline,
                            }}} />
                <TextField style={textFieldStyle} className={classes.textField} label="Password" type={showPassword ? "text" : "password"} variant='outlined'
                        disabled={inputDisabled}
                        onChange={passwordChange}
                        value={login[1]}
                        InputLabelProps={{
                            classes: {
                            root: error ? classes.cssLabelError : classes.cssLabel,
                            focused: classes.cssFocused,
                            },
                        }}
                        InputProps={{
                            classes: {
                            root: error ? classes.cssOutlinedInputError : classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: error ? classes.notchedOutlineError : classes.notchedOutline,
                            },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            )}} />
                <Link href='#' underline='none' style={linkStyle}>Forgot Password?</Link>
                {(error) && <div style={{width: '100%', display: 'flex', flexDirection: 'row', marginBottom: 5}}>
                    <ErrorIcon color='error' fontSize='small' style={{marginRight: 5}} />
                    <span style={{color: 'red'}}>{error}</span>
                </div>}
                <Button style={{height: 50, marginBottom: 15}} type='submit' color="primary" disabled={btnDisabled} >
                    <span style={btnTextStyle}>
                        {loggingIn && <CircularProgress size={12} style={{color:'white'}} />}
                        {loggingIn ? 'Logging in...' : 'Continue'}
                    </span>
                </Button>
                <span style={{fontWeight: 400}}>Don't have an account? <Link href='/register' underline='none' style={linkStyle}>Register</Link></span>
                <DividerWithText>OR</DividerWithText>
                <Button style={{height: 50}} variant="outline-primary" onClick={handleGoogleLogin} >
                    <img style={{width: 20, position: 'absolute', marginLeft: '-60px'}} src={GoogleLogo}></img>
                    <span>Continue with Google</span>
                </Button>
            </form>
        </div>
    )
}