import React from 'react';
import PropTypes from 'prop-types';

import ProfileAccordion from './ProfileAccordion';
import ProgressAccordion from './ProgressAccordion';
import NotificationAccordion from './NotificationAccordion';
import UpcomingAccordion from './UpcomingAccordion';

class SideActionBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
			<div className="right-panel">
				<ProfileAccordion {...this.props} />
				<ProgressAccordion />
				<UpcomingAccordion />
				<NotificationAccordion />
			</div>
        )
    }
}

SideActionBar.propTypes = {
	userName: PropTypes.string,
	userImage: PropTypes.string
};

export default SideActionBar;