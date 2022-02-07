import React, {useEffect} from 'react';
import Container from '../Container/Container';

import NotFound from '../../assets/images/no_data.svg'

function Page404(props) {
	return (
		<Container zeroPadding noHeader>
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <h1 style={{fontWeight: 800, fontSize: 52}}>Oops!</h1>
                <p style={{color: 'var(--dark-gray)'}}>We couldn't find the page you're looking for.</p>
                <p style={{color: 'var(--dark-gray)'}}>Maybe this page does not exist🤔</p>
                <img src={NotFound} style={{width: '15rem', height: '15rem', marginTop: 50}} />
            </div>
		</Container>
	)
}

export default Page404;