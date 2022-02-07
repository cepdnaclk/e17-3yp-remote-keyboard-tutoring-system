import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { IconButton, Tooltip, Menu, MenuItem } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { setSortBy, setFilterBy } from "../../reducers/sortCoursesSlice";

import FilterListIcon from '@material-ui/icons/FilterList';

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "3px",
    "& > span": {
      maxWidth: 20,
      width: "100%",
      backgroundColor: "#5F80F5"
    }
  }
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const headingStyle = {
	float: 'left',
	color: `var(--heading-color)`,
  fontSize: '1.6rem',
}

const TabIndicatorBar = ({ tutor, heading, tabLabels, scrolled, hasFilterButton, filterLabels, selected }) => {
    const [value, setValue] = React.useState(selected);
	const [selectedFilter, setSelectedFilter] = React.useState(0);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [blurred, setBlurred] = React.useState(true);
	const open = Boolean(anchorEl);
    const dispatch = useDispatch()

    const handleChange = (event, newValue) => {
        setValue(newValue);
		if (tutor) dispatch(setFilterBy(tabLabels[newValue]));
        else dispatch(setSortBy(tabLabels[newValue]));
    };

	const handleButtonClick = (event) => {
		setBlurred(false);
		setAnchorEl(event.currentTarget);
	};

	const handleFliterChange = (event) => {
		setSelectedFilter(event.target.value);
		if (tutor) dispatch(setSortBy(filterLabels[selectedFilter]));
		else dispatch(setFilterBy(filterLabels[selectedFilter]));
		setAnchorEl(null); 
		setBlurred(true);
	};

	const StyledTab = withStyles((theme) => ({
		root: {
			textTransform: "none",
			color: scrolled ? 'white' : "#95A0B0",
			fontWeight: theme.typography.fontWeightRegular,
			fontSize: theme.typography.pxToRem(15),
			marginRight: theme.spacing(1),
			minWidth: 72,
			'@media (min-width: 600px)': {
			  minWidth: 95
			},
			'@media (max-width: 950px)': {
			  minWidth: 30
			},
			"&:focus": {
			opacity: 1
			}
		},
		selected: {
			color: "#5F80F5",
			fontWeight: 600
		}
	}))((props) => <Tab disableRipple {...props} />);

    const renderTabs = () => {
        return tabLabels.map((label) => <StyledTab label={label} key={label} />);
    }

    return (
    <div className={`tab-indicator-bar ${scrolled ? 'scrolled' : ''}`}>
        {!scrolled && <h1 style={headingStyle}>{heading}</h1>}
        <StyledTabs value={value} onChange={handleChange} style={{float: 'right'}}>
            {renderTabs()}
            {hasFilterButton && <Tooltip title="Sort Options" placement="top">
				<IconButton onClick={handleButtonClick} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} 
					style={{width: '3rem', height: '3rem', alignSelf: 'center'}}>
              		<FilterListIcon style={{float: 'right', alignSelf: 'center', margin: '0 5px', color: !blurred ? '#5F80F5' : scrolled ? 'white' : '#95A0B0'}} />
				</IconButton>
            </Tooltip>}
			{hasFilterButton && <Menu anchorEl={anchorEl} open={open} onClose={() => {setAnchorEl(null); setBlurred(true)}} style={{transform: 'translateY(60px)'}}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}>
				{filterLabels.map((label, index) => <MenuItem key={label} onClick={handleFliterChange} value={index}>{label}</MenuItem>)}
			</Menu>}
        </StyledTabs>
    </div>
    );
}

export default TabIndicatorBar;