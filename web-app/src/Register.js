import React, { useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Button } from 'react-bootstrap';
import DividerWithText from './components/DividerWithText/DividerWithText';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TextField, Input, InputAdornment, IconButton } from "@material-ui/core";
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import { LocalizationProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import MuiPhoneNumber from 'material-ui-phone-number';
import countryList from "react-select-country-list";
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import 'antd/dist/antd.css';

import placeholder from './assets/images/placeholder.svg';
import GoogleLogo from './assets/logos/Googlec Logo.png';
import ErrorIcon from '@material-ui/icons/Error';
import EmailVerification from './assets/images/email-id-verification.png';

const {REACT_APP_GOOGLE_CLIENT_ID} = process.env;

const containerStyle = {
    background: 'white',
    borderRadius: '8px',
    width: '70%',
    height: '635px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0.2px 0.2px 2.7px rgba(0, 0, 0, 0.037),
    0.6px 0.5px 6.9px rgba(0, 0, 0, 0.053),
    1.2px 1.1px 14.2px rgba(0, 0, 0, 0.067),
    2.6px 2.2px 29.2px rgba(0, 0, 0, 0.083),
    7px 6px 80px rgba(0, 0, 0, 0.12)`
}

const frontContainerStyle = {
    width: '100%',
    height: '100%',
    flex: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--container-gradient-light)',
    padding: '50px',
}

const registerContainerStyle = {
    width: '100%',
    height: '100%',
    flex: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '50px 40px 30px 40px',
}

const logoStyle = {
    fontWeight: 800,
    fontSize: '40px',
    color: 'var(--blue)',
}

const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
}

const descriptionStyle = {
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--list-sub-heading-color)',
}

const rightHeaderStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
}

const linkStyle = {
    color: 'var(--blue)',
    fontWeight: 550,
    margin: '10px 0 10px 0'
}

const rightHeaderTitleStyle = {
    fontSize: '36px',
    fontWeight: 600,
    marginBottom: 10,
    color: 'var(--heading-color)',
}

const rightHeaderSubStyle = {
    color: 'var(--list-sub-heading-color)',
    fontSize: '16px',
}

const formContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
}

const formContentStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'hidden',
    marginBottom: 10
}

const formStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
}

const formFooterStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 50px',
}

const formGroup = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '20px',
}

const btnTextStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
}

const steps = ['Your Role', 'Basic Information', 'Finish'];

function Register(props) {
    useEffect(() => {
        document.title = props.title || "forté | Register";
    }, [props.title]);

    const countries = countryList().getData();

    const params = new URLSearchParams(props.location.search);

    const [showPassword, setShowPassword] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [role, setRole] = React.useState('Student');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [country, setCountry] = React.useState(countryList().getLabel('us'));
    const [dob, setDOB] = React.useState(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [forward, setForward] = React.useState(true);
    const [error, setError] = React.useState('');

    const [validUsername, setValidUsername] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState(false);
    const [validPassword, setValidPassword] = React.useState(false);
    const [validConfirmPassword, setValidConfirmPassword] = React.useState(false);
    const [verified, setVerified] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('token') && params.get('role')) {
            const requestOptions = {
                method: 'GET',
            };
            fetch(`/${params.get('role').toLowerCase()}/confirmation/${params.get('token')}`, requestOptions)
            .then(async response => {
                const data = await response.json();
    
                if (response.status >= 500) return Promise.reject("Server error! Please try again");
    
                if (!data.success) {
                    const err = data.message;
                    return Promise.reject(err);
                }

                setVerified(true);
                setActiveStep(3);
            })
            .catch(err => {
                setSubmitting(false);
                setError(err);
            });
        }
    }, []);

    useEffect(() => {
        setInterval(() => {
            if (document.querySelector("input[type='tel']"))
                document.querySelector("input[type='tel']").placeholder='Date of Birth';
        }, 100);
        if (activeStep === 3) setBtnDisabled(false);
    }, [activeStep]);

    useEffect(() => {
        if (activeStep === 0) setBtnDisabled(false);
        else if (activeStep === 3) setBtnDisabled(false);
        else if (validUsername && validEmail && validPassword && validConfirmPassword && firstName && lastName && dob) setBtnDisabled(false);
        else setBtnDisabled(true);
    }, [validUsername, validEmail, validPassword, firstName, lastName, passwordConfirm, dob, activeStep]);

    // TODO: Add a google login handler
    const handleGoogleSignup = () => {
    
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleStep = (step) => () => {
        if (step < activeStep) {
            setForward(false);
            setTimeout(() => {
                setActiveStep(step);
            }, 10);
            setTimeout(() => {
                setForward(true);
            }, 1000);
        }
    };

    const handleContinue = () => {
        if (activeStep < steps.length) {
            setActiveStep(activeStep + 1);
            setForward(true);
        }
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const trySubmit = () => {
        setSubmitting(true);

        const requestOptions = {
            method: 'POST',
            mode: 'cors', // Enable cross-origin resource sharing
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username, 
                password: password, 
                email: email, 
                firstName: firstName, 
                lastName: lastName, 
                phone: phone, 
                country: country, 
                DOB: dob })
        };
        fetch(`/${role.toLowerCase()}/register`, requestOptions)
        .then(async response => {
            const data = await response.json();

            if (response.status >= 500) return Promise.reject("Server error! Please try again");

            if (!data.success) {
                const err = data.message;
                return Promise.reject(err);
            }

            handleContinue();
        })
        .catch(err => {
            setSubmitting(false);
            setError(err);
        });

        setSubmitting(false);
    }

    const menu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setRole('Student')}>
            <span>Student</span>
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setRole('Tutor')}>
            <span href="#">Tutor</span>
          </Menu.Item>
        </Menu>
    );

    const countryMenu = (
        <Menu>
            {countries.map((obj, key) => (
                <Menu.Item key={key} onClick={() => setCountry(obj.label)}>
                    <span>{obj.label}</span>
                </Menu.Item>
            ))}
        </Menu>
    );

    const renderInput = (props) => (
        <Input
          placeholder="Date of Birth"
          style={{alignSelf: 'flex-end'}}
          type="text"
          inputRef={props.inputRef}
          inputProps={props.inputProps}
          value={props.value}
          onClick={props.onClick}
          onChange={props.onChange}
          endAdornment={props.InputProps?.endAdornment}
        />
    );

    const hideEmail = function(email) {
        return email.replace(/(.{2})(.*)(?=@)/,
          function(gp1, gp2, gp3) { 
            for(let i = 0; i < gp3.length; i++) { 
              gp2+= "*"; 
            } return gp2; 
          });
    };

    const redirect = () => {
        if (verified) window.location.href = `/login?user=${params.get('user')}`;
    };

    const step1 = (
        <>
            <div style={formContentStyle}>
                <h1>
                    I am a &nbsp;
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {role} <DownOutlined style={{fontSize: '15px', fontWeight: 600}} />
                        </a>
                    </Dropdown>
                </h1>
                <h2>who wants to {role === 'Student' ? 'learn' : 'teach'} piano</h2>
            </div>
            <div style={formFooterStyle}>
                <Button style={{height: 50, marginBottom: 15}} color="primary" disabled={btnDisabled} onClick={handleContinue}>Continue</Button>
                <DividerWithText>OR</DividerWithText>
                <Button style={{height: 50}} variant="outline-primary" onClick={handleGoogleSignup} >
                    <img style={{width: 20, position: 'absolute', marginLeft: '-60px'}} src={GoogleLogo}></img>
                    <span>Continue with Google</span>
                </Button>
            </div>
        </>
    );

    const step2 = (
        <>
            <div style={formContentStyle}>
                <div style={formGroup}>
                    <TextField id="username" label="Username*" variant="standard" value={username} onChange={(e) => {
                        setUsername(e.target.value.trim());
                        if (e.target.value.length < 6) {
                            setError('Username must be at least 6 characters');
                            setValidUsername(false);
                        }
                        else {
                            setError('');
                            setValidUsername(true);
                        }
                    }} />
                    <TextField id="email" label="Email Address*" variant="standard" value={email} onChange={(e) => setEmail(e.target.value)} onChange={(e) => {
                        setEmail(e.target.value.trim());
                        if (!validateEmail(e.target.value)) {
                            setError('Invalid email address');
                            setValidEmail(false);
                        }
                        else {
                            setError('');
                            setValidEmail(true);
                        }
                    }} />
                </div>
                <div style={formGroup}>
                    <TextField id="first-name" label="First Name*" variant="standard" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }} />
                    <TextField id="last-name" label="Last Name*" variant="standard" value={lastName} onChange={(e) => setLastName(e.target.value)} 
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}/>
                </div>
                <div style={formGroup}>
                    {/* <TextField id="phone" label="Phone" variant="standard" value={phone} onChange={(e) => setPhone(e.target.value)} /> */}
                    <MuiPhoneNumber defaultCountry={countryList().getValue(country).toLowerCase()} onChange={(value) => setPhone(value)} value={phone} />
                    <LocalizationProvider dateAdapter={DateFnsUtils}>
                        <DatePicker
                            label="Date of Birth*"
                            value={dob}
                            onChange={setDOB}
                            renderInput={renderInput}
                        />
                    </LocalizationProvider>
                </div>
                <div style={formGroup}>
                    <TextField id="password" label="Password*" variant="standard" type={showPassword ? "text" : "password"} value={password} onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length < 8) {
                            setError('Password must be at least 8 characters long');
                            setValidPassword(false);
                        }
                        else if (!/.*[a-z].*/.test(e.target.value)) {
                            setError('Password must contain at least one lowercase letter (a - z)');
                            setValidPassword(false);
                        }
                        else if (!/.*[A-Z].*/.test(e.target.value)) {
                            setError('Password must contain at least one uppercase letter (A - Z)');
                            setValidPassword(false);
                        }
                        else if (!/.*[0-9].*/.test(e.target.value)) {
                            setError('Password must contain at least one number (0 - 9)');
                            setValidPassword(false);
                        }
                        else if (!/.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~].*/.test(e.target.value)) {
                            setError('Password must contain at least one special character');
                            setValidPassword(false);
                        }
                        else if (e.target.value.toLowerCase().includes(username.toLowerCase()) || e.target.value.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
                            setError('Password must not contain your username or email address');
                            setValidPassword(false);
                        }
                        else {
                            setError('');
                            setValidPassword(true);
                        }
                        if (passwordConfirm && passwordConfirm !== password) setValidConfirmPassword(false);
                    }} 
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}/>
                    <TextField id="confirm-password" label="Confirm Password*" variant="standard" type='password' value={passwordConfirm} 
                        onChange={(e) => {
                            setPasswordConfirm(e.target.value);
                            if (password !== e.target.value) {
                                setError('Passwords do not match.');
                                setValidConfirmPassword(false);
                            }
                            else {
                                setError('');
                                setValidConfirmPassword(true);
                            }
                        }} />
                </div>
            </div>
            {(error) && <div style={{width: '100%', display: 'flex', flexDirection: 'row', marginBottom: 15}}>
                    <ErrorIcon color='error' fontSize='small' style={{marginRight: 5}} />
                    <span style={{color: 'red'}}>{error}</span>
                </div>}
            <div style={formFooterStyle}>
                <Button style={{height: 50, marginBottom: 15}} color="primary" disabled={btnDisabled} onClick={trySubmit}>
                    <span style={btnTextStyle}>
                        {submitting && <CircularProgress size={12} color='white' />}
                        {submitting ? 'Validating...' : 'Continue'}
                    </span>        
                </Button>
            </div>
        </>
    );

    const step3 = (
        <>
            <div style={formContentStyle}>
                <h2>You're almost there</h2>
                <p>We sent an email to <b>{hideEmail(email)}</b></p>
                <p>Just click on the link in that email to complete your registration. If you don't see it, you may need to <b>check your spam</b> folder.</p>
                <p>Still can't find the email? <Link href='#'>Resend email verification.</Link></p>
                <p>Need help? <Link href='#'>Contact Us</Link></p>
            </div>
            <div style={formFooterStyle}>
                <Button style={{height: 50, marginBottom: 15}} color="primary" disabled onClick={handleContinue}>Continue</Button>
            </div>
        </>
    );

    const verificationSuccessful = (
        <>
            <div style={formContentStyle}>
                <h2>Your email has been verified!</h2>
                <img src={EmailVerification} width='50%' />
                <h4>Please continue to log in</h4>
            </div>
            <div style={formFooterStyle}>
                <Button style={{height: 50, marginBottom: 15}} color="primary" disabled={btnDisabled} onClick={redirect}>Continue</Button>
            </div>
        </>
    );

    const stepsList = [step1, step2, step3, verificationSuccessful];

    const handleNext = () => {
        return stepsList[activeStep];
    };

    return (
        <div style={containerStyle}>
            <div style={frontContainerStyle}>
                <div style={{width: '100%', display: 'flex', flexDirection: 'row', flex: '50%'}}>
                    <div style={headerStyle}>
                        <Link href='/' style={{textDecoration: 'none', width: '50%'}}><span style={logoStyle}>forté</span></Link>
                        <span style={descriptionStyle}>Learn or Teach Piano</span>
                        <span style={descriptionStyle} className='adjective'></span>
                    </div>
                    {(activeStep < 2) && <Dropdown overlay={countryMenu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{height: 20, width: 50, fontSize: 16, marginTop: 15}}>
                            {countryList().getValue(country)} <DownOutlined />
                        </a>
                    </Dropdown>}
                </div>
                <img src={placeholder} alt="placeholder" width='100%' />
            </div>
            <div style={registerContainerStyle}>
                <div style={rightHeaderStyle}>
                    <h1 style={rightHeaderTitleStyle}>Register to forté.</h1>
                    {(activeStep < 2) && <span style={rightHeaderSubStyle}>Already registered? <Link href='/login' underline='none' style={linkStyle}>Log in</Link></span>}
                    <Stepper activeStep={activeStep} style={{padding: '24 10 10 0 !important'}} alternativeLabel disabled={activeStep >= 2}>
                        {steps.map((label, index) => (
                            <Step key={label} color='var(--blue)' onClick={(activeStep < 2) && handleStep(index)} disabled={activeStep >= 2}>
                                <StepButton color="inherit" >
                                    {label}
                                </StepButton>
                            </Step>
                            ))}
                    </Stepper>
                </div>
                <form noValidate style={formStyle}>
                    <SwitchTransition mode='out-in'>
                        <CSSTransition
                            key={activeStep}
                            addEndListener={(node, done) => {
                                node.addEventListener("transitionend", done, false);
                            }}
                            classNames="fade" >
                            <div style={formContainerStyle} className={!forward ? 'back' : ''}>
                                {handleNext()}
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                </form>
            </div>
        </div>
    )
}

export default Register;