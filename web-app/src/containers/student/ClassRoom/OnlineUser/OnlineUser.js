import React from 'react';
import RaiseHandIcon from '@material-ui/icons/PanTool';

import './OnlineUser.css';

const OnlineUser = ({ name, raised, profileImage } ) => {
    return (
		<div style={{display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '0 10px', alignItems: 'center', gridColumnGap: 20, width: '100%'}}>
			<div style={{width: '2.5rem', height: '2.5rem'}} className='profile-image-container'>
				<img src={profileImage} alt="profile" className='profile-image'/>
			</div>
			<span style={{fontSize: 14}}>{name}</span>
			{raised && <RaiseHandIcon style={{fontSize: '1.5rem', color: 'var(--blue)', justifySelf: 'center'}}/>}
		</div>
    )
}

export default OnlineUser;