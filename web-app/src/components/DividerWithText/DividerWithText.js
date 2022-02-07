import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        alignItems: "center",
        padding: '15px 0'
    },

    border: {
        borderBottom: "2px solid lightgray",
        width: "100%"
    },

    content: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        fontWeight: 400,
        fontSize: 14,
    }
}));

const DividerWithText = ({ children }) => {
    const classes = useStyles();

    return (
    <div className={classes.container}>
        <div className={classes.border} />
        <span className={classes.content}>{children}</span>
        <div className={classes.border} />
    </div>
    );
};

export default DividerWithText;