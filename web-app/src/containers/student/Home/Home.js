import React, {useEffect} from 'react';
import Container from '../../../components/Container/Container';


function Home(props) {
    useEffect(() => {
        document.title = props.title || "forté | Home";
    }, [props.title]);

	return (
		<Container heading="Home" searchPlaceholder='Search forté'>
			
		</Container>
	)
}

export default Home;