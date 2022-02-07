import React, { useState, useEffect } from 'react';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { InputLabel } from '@material-ui/core';
import Switch from 'react-ios-switch';
import UploadImage from './Components/UploadImage';
import { useDispatch, useSelector } from 'react-redux';
import { setStepFour } from '../../../reducers/createCourseSlice';

const formGroup1 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr',
    gridColumnGap: '10px'
}

const formGroup2 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '2fr 3fr 3fr',
	gridColumnGap: '20px',
    marginTop: "30px"
}

const formContentStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: 'space-around',
    paddingBottom: 100
}

const StepFour= ({ setStatus }) => {
	const dispatch = useDispatch();
	const [cover, setCover] = useState(useSelector(state => state.createCourse.courseCover));
	const [price, setPrice] = useState(useSelector(state => state.createCourse.coursePrice));
	const [isPublished, setIsPublished] = useState(useSelector(state => state.createCourse.isPublished));

	useEffect(() => {
		setStatus({ success: true, message: '' });
		dispatch(setStepFour({ courseCover: cover, coursePrice: price, isPublished: isPublished }));
	}, [cover, price, isPublished]);

    const handleImageChange = (e) => {
		setCover(e.target.result);
	}

    return (
		<div style={formContentStyle}>
			<div style={formGroup1}>
				<UploadImage image={cover} onChange={handleImageChange} />
			</div>
			<div style={formGroup2}>
				<InputLabel>Price for the Course</InputLabel>
				<CurrencyTextField
					label="Amount"
					variant="outlined"
					value={price}
					currencySymbol="$"
					minimumValue="0"
					outputFormat="string"
					decimalCharacter="."
					digitGroupSeparator=","
					onChange={(event, value) => setPrice(value)}
				/>
				<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
					<InputLabel>Publish Now<span>*</span></InputLabel>
					<Switch
						checked={isPublished}
						onChange={setIsPublished}
						onColor="#5F80F5"
					/>
				</div>
			</div>
			<InputLabel style={{width: '100%', paddingTop: 50}}>*You can either publish your course now or later.</InputLabel>
		</div>
    )
}

export default StepFour;