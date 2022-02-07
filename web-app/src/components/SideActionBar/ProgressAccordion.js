import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
      panelBody: {
        border: 'none',
        boxShadow: 'none'
      }
    },
}));

function ProgressAccordion() {
    const classes = useStyles();

    return (
        <Accordion defaultExpanded elevation={0} style={{backgroundColor: 'transparent', margin: `1rem`, width: '100%', padding: `0 1rem`}}>
            <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">
                <span>Progress</span>
            </AccordionSummary>
            <AccordionDetails className={classes.details} style={{padding: 0, display: 'block'}}>
                <span>
                    Will be updated soon.
                </span>
            </AccordionDetails>
        </Accordion>
    )
}

export default ProgressAccordion;