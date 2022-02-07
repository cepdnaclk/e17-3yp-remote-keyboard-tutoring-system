import React, { useEffect } from 'react';
import Container from '../../../components/Container/Container';

function Sheets(props) {
    useEffect(() => {
      document.title = props.title || "forté | Sheets";
  }, [props.title]);

  return (
    <Container heading="Sheets" searchPlaceholder='Search Sheets'>
        
    </Container>
  )
}

export default Sheets;