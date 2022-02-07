import React from "react";
import PropTypes from "prop-types";
import { Input } from 'antd';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { motion } from 'framer-motion';
import $ from 'jquery';

import TabIndicatorBar from "../TabIndicatorBar/TabIndicatorBar";
import { Scrollbars } from 'react-custom-scrollbars';

import searchIcon from '../../assets/icons/Search.svg';

function Container(props) {
    const [searchFocus, setSearchFocus] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [scrolled, setScrolled] = React.useState(false);

    const { selected, tutor, heading, children, tabLabels, filterLabels, searchPlaceholder, noSearch, hasStepper, activeStep, stepperDisabled, steps, noHeader, noPadding, zeroPadding, hasFilterButton } = props;

    setInterval(() => {
        var windowWidth = $(window).width();
        var sidebarWidth = $('.sidebar').width();
        var rightPanelWidth = $('.right-panel').width();
        $('.work-space-header').css('width', windowWidth - sidebarWidth - rightPanelWidth + 'px');
    }, 1);

    const searchStyle = {
        width: scrolled ? '45px' : '35%',
        height: 40,
        backgroundColor: scrolled && !searchFocus ? '#e4e4e4' : '#FFFDFD',
        borderRadius: 10,
    }

    const searchOnFocus = () => {
        $('.searchbox').css('width', '50%');
        setSearchFocus(true);
    }

    const searchOnBlur = () => {
        if (scrolled) $('.searchbox').css('width', '45px');
        else $('.searchbox').css('width', '35%');
        setSearchFocus(false);
    }

    const handleScroll = (e) => {
        if (!hasStepper)
            if (e.target.scrollTop > 400) {
                setScrolled(true);
            }
            else {
                setScrolled(false);
            }
    }

    return (
        <motion.div className="work-space">
            {!noHeader && <motion.div layout className={`work-space-header ${scrolled ? 'scrolled' : ''}`} style={{ height: hasStepper ? 250 : scrolled ? (tabLabels ? 100 : 80) : 170 }}>
                {!noSearch && <Input style={searchStyle} onFocus={searchOnFocus} onBlur={searchOnBlur} className={`searchbox ${scrolled ? 'scrolled' : ''}`}
                    prefix={<img className={`${searchFocus ? 'search-focus' : 'search-blur'}`} src={searchIcon} width='60%'></img>} 
                    placeholder={searchPlaceholder} allowClear bordered={false} spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off"  />}
                <TabIndicatorBar selected={selected} tutor={tutor} scrolled={scrolled} heading={heading} tabLabels={tabLabels} filterLabels={filterLabels} hasFilterButton={hasFilterButton} />
                {hasStepper && <Stepper activeStep={activeStep} style={{padding: '15px 0', backgroundColor: 'transparent'}} alternativeLabel disabled={stepperDisabled}>
                    {steps.map((label, index) => (
                        <Step key={label} color='var(--blue)' onClick={props.handleStep(index)} disabled={stepperDisabled}>
                            <StepButton color="inherit" >
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>}
            </motion.div>}
            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                        renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                        renderView={props => <div {...props} className="view"/>}
                        autoHide autoHideTimeout={1000} autoHideDuration={200} onScroll={handleScroll}>
                <div className="work-space-container" style={{padding: zeroPadding ? 0 : noPadding ? '1rem 1rem 0 1rem' : noHeader ? '0 3rem 0 3rem' : hasStepper ? '250px 3rem 0 3rem' : '200px 3rem 0 3rem'}}>
                    {props.children}
                </div>
            </Scrollbars>
        </motion.div>
    )
}

Container.defaultProps = {
    heading: '',
    children: null,
    tabLabels: [],
    searchPlaceholder: 'Search',
    noSearch: false,
    hasStepper: false
};

Container.propTypes = {
    heading: PropTypes.string,
    children: PropTypes.node,
    tabLabels: PropTypes.array,
    searchPlaceholder: PropTypes.string,
    noSearch: PropTypes.bool,
    hasStepper: PropTypes.bool
};

export default Container;