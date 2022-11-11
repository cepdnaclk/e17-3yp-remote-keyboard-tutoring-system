import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import StudentApp from "./containers/student/StudentApp";
import TutorApp from "./containers/tutor/TutorApp";
import Login from "./Login";
import Register from "./Register";
import Setup from "./components/Setup/Setup";
import { trySilentRefresh } from "./utils/authUtils";
import { useDispatch } from "react-redux";
import { setUserData } from "./reducers/userDataSlice";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const containerStyle = {
    width: '100%',
    height: '100vh',
    background: 'var(--container-gradient-dark)',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function App() {
    const dispatch = useDispatch();

    const [render, setRender] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const silentRefresh = () => {
        // Check -> https://github.com/cepdnaclk/e17-3yp-remote-keyboard-tutoring-system/tree/main/Research/Stateless%20Authentication#strategy---2-proceeding-with-redux-states
        setIsLoading(true);
        trySilentRefresh().then(data => { 
            if (data) {
                dispatch(setUserData({
                    id: data.user._id,
                    username: data.user.username,
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    role: data.user.role,
                    avatar: data.user.avatar,
                    accessToken: data.accessToken,
                    DOB: data.user.DOB,
                    phone: data.user.phone,
                    country: data.user.country,
                    date: data.user.date,
                    coursesEnrolled: data.user.role === 'student' ? data.user.coursesEnrolled : null,
                    subscribedClasses: data.user.role === 'student' ? data.user.subscribedClasses : null,
                }));

                if (data.user.avatar) {
                    if (data.user.role === 'student') setRender(<Route path="*" component={StudentApp} exact />);
                    else if (data.user.role === 'tutor') setRender(<Route path="*" component={TutorApp} exact />);
                }
                else setRender(<Setup />);
            }
            else if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                setOpen(true);
                setMessage('Your session has expired. Please login again.');
                window.location.pathname = '/login';
                setRender(
                    <React.Fragment>
                        <div style={containerStyle}>
                            <Route path="/" component={Login} exact />
                        </div>
                    </React.Fragment>
                );
            }
        });
        setTimeout(() => setIsLoading(false), 1000);
    };

    React.useEffect(() => {
        if (localStorage.getItem('loggedOut')) {
            setTimeout(() => {
                setOpen(true);
                setMessage(localStorage.getItem('loggedOut'));
                localStorage.removeItem('loggedOut');
            }, 1000);
        }

        silentRefresh();
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    return (
        <Router>
            <Switch>
                {render}
                <React.Fragment>
                    <div style={containerStyle}>
                        <Snackbar open={open} onClose={handleClose} style={{ top: '-670px' }}>
                            <Alert severity="info" sx={{ width: '100%'}} onClose={handleClose}>
                                {message}
                            </Alert>
                        </Snackbar>
                        {isLoading && <CircularProgress />}
                        {!isLoading && <Route exact path="/"> <Redirect to="/login" /> </Route>}
                        {!isLoading && <Route path="/login" component={Login} />}
                        {!isLoading && <Route path="/register" component={Register} />}
                    </div>
                </React.Fragment>
            </Switch>
        </Router>
    )
}