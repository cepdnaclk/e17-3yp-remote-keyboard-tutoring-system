import React from 'react';
import Menu from './Menu'
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import { withRouter } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import Hamburger from 'hamburger-react';

class SideNavBar extends React.Component {
    constructor(props) {
        super(props);

        // Initial state of the component
        this.state = {
            open: !this.props.isClosed && window.innerWidth > 1280
        };
    }

    componentDidMount() {
        if (this.props.isClosed) this.setState({open: false});

        if (!this.state.open) $('.nav-item a').css('margin-left', '0px');
        else $('.nav-item a').css('margin-left', '8%');

        window.addEventListener('resize', () => {
            this.setState({
                open: !this.props.isClosed && window.innerWidth > 1280
            });
            setTimeout(() => {
                if (!this.state.open) $('.nav-item a').css('margin-left', '0px');
                else $('.nav-item a').css('margin-left', '8%');
                var windowWidth = $(window).width();
                var sidebarWidth = $('.sidebar').width();
                var rightPanelWidth = $('.right-panel').width();
                $('.work-space-header').css('width', windowWidth - sidebarWidth - rightPanelWidth + 'px');
            }, 1);
        }, false);

        setTimeout(() => {
            if (this.props.isClosed) {
                this.setState({open: false});
                $('.nav-item a').css('margin-left', '0px');
                var windowWidth = $(window).width();
                var sidebarWidth = $('.sidebar').width();
                var rightPanelWidth = $('.right-panel').width();
                $('.work-space-header').css('width', windowWidth - sidebarWidth - rightPanelWidth + 'px');
            }
        }, 100);
    }

    render() {
        const {brandName, actionButtonName, action, onAction, hideAction} = this.props;
        const {open} = this.state;

        const joinBtnStyle = {
            height: 40,
            alignSelf: 'center',
            marginTop: '1.8em',
        }

        const premiumBtnStyle = {
            width: 110,
            height: 40,
            alignSelf: 'center',
            position: 'absolute',
            bottom: '3em'
        }

        const toggleHandler = () => {
            this.setState(prevState => ({open: !prevState.open}));
            if (open) $('.nav-item a').css('margin-left', '0px');
            else $('.nav-item a').css('margin-left', '8%');
            setInterval(() => {
                var windowWidth = $(window).width();
                var sidebarWidth = $('.sidebar').width();
                var rightPanelWidth = $('.right-panel').width();
                $('.work-space-header').css('width', windowWidth - sidebarWidth - rightPanelWidth + 'px');
            }, 1);
        }

        const actionHandler = () => {
            this.props.history.push(action);
        }

        return (
            <motion.div layout className={`sidebar ${open ? 'active' : ''}`}>
                <motion.div className="logo-content">
                    <a className="logo-name" href="/">{brandName}</a>
                    <div className="menu">
                        <Hamburger rounded size={25} onToggle={toggleHandler} toggled={open}/>
                    </div>
                </motion.div>
                <AnimatePresence>
                    {!hideAction && <motion.div style={{alignSelf: 'center'}}
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.5}}>
                        <Button onClick={action ? actionHandler : onAction} color="primary" style={joinBtnStyle} className={open ? '' : 'hide'}>{actionButtonName}</Button>
                    </motion.div>}
                </AnimatePresence>
                <Menu>
                    {this.props.children}
                </Menu>
                <Button color="primary" style={premiumBtnStyle} className={open ? '' : 'hide'}>Try Premium</Button>
            </motion.div>
        )
    }
}

export default withRouter(SideNavBar);