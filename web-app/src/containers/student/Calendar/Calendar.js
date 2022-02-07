import React, {useEffect} from 'react';
import Container from '../../../components/Container/Container';


function Calendar(props) {
    useEffect(() => {
        document.title = props.title || "forté | Calendar";
    }, [props.title]);

	return (
		<Container heading="Calendar" noSearch>
			
		</Container>
	)
}

export default Calendar;