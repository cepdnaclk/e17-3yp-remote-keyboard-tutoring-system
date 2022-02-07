import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { InputLabel, Select, MenuItem, Chip, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { setStepOne } from '../../../reducers/createCourseSlice';

const formGroup1 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 5fr 1fr',
    gridColumnGap: '20px',
}

const formGroup2 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 5fr',
    gridColumnGap: '10px',
}

const formGroup3 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 2fr 3fr',
    gridColumnGap: '10px',
}

const formContentStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
}

const searchTags = [
    'Contemporary & Modern',
    'Classical',
    'Christian',
    'Jazz & Latin',
    'Christmas & Holidays',
	'Step by Step',
	'Beginner & Intermediate',
	'Music for Everyone',
	'Music for Adults',
	'Music for Teens',
	'Music for Kids',
	'Piano & Keyboard',
	'Master Piano'
]

const categories = [
	'Music Theory',
	'Keyboard Instrument',
	'Piano Chords',
	'Music History',
	'Playing Music by Ear',
	'Piano for Kids',
	'Piano for Beginners',
	'Piano for Experts',
	'Certificate Course',
	'Improvisation',
	'Other'
]

const ChipArray = ({ tags, onChange, value }) => {
	const [selectedIndex, setSelectedIndex] = useState(value);

	const handleClick = (index) => {
		setSelectedIndex(index);
		onChange && onChange(index);
	};

	return (
		<div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
			{tags.map((tag, index) => {
				return (
					<Chip variant='outlined' key={index} label={tag} 
						style={{
							backgroundColor: selectedIndex === index ? 'var(--blue)' : 'inherit', 
							color: selectedIndex === index ? 'white' : 'inherit',
							margin: '0.5em 0'
						}} 
						onClick={() => handleClick(index)} />
				)
			})}
		</div>
	)
};

const StepOne = ({ setStatus }) => {
	const dispatch = useDispatch();
	const [courseName, setCourseName] = useState(useSelector(state => state.createCourse.courseName));
	const [difficulty, setDifficulty] = useState(useSelector(state => state.createCourse.courseDifficulty));
	const [category, setCategory] = useState(useSelector(state => state.createCourse.courseCategory));
	const [selectedTags, setSelectedTags] = useState(useSelector(state => state.createCourse.searchTags));
	const [inputTag, setInputTag] = useState('');

	// Step-1 Validation
	useEffect(() => {
		dispatch(setStepOne({ courseName: courseName, difficulty: difficulty, category: category, searchTags: selectedTags }));
		setStatus({ success: false, error: false });
		if (courseName.trim().length < 25 || difficulty === null || category === null) setStatus({ success: false, message: 'Please fill in the required fields' });
		else setStatus({ success: true, message: 'You can proceed to the next step' });
	} , [courseName, difficulty, category, selectedTags]);

	const handleTagsChange = (event, selected) => {
		if (inputTag) searchTags.push(inputTag);
		setSelectedTags(selected);
		setInputTag('');
	};

	const handleCategoryChange = (selected) => {
		setCategory(selected);
	};

	const handleDifficultyChange = (selected) => {
		setDifficulty(selected);
	};

	const handleCourseNameChange = (event) => {
		if (event.target.value.length <= 60)
			setCourseName(event.target.value);
	};

	const filterOptions = createFilterOptions({
        matchFrom: 'start',
        limit: 500,
    });

	return (
		<div style={formContentStyle}>
			<div style={formGroup1}>
				<InputLabel>Course Name<span style={{color: 'red'}}>*</span></InputLabel>
				<TextField
					name="courseName"
					value={courseName}
					placeholder="I will teach ..."
					onChange={handleCourseNameChange}
					helperText={courseName.length < 25 ? 'Please enter at least 25 characters' : 'Tip: Make sure that your course name is attractive and meaningful'}
				/>
				<InputLabel>{courseName.length} / 60 max</InputLabel>
			</div>

			<div style={formGroup3}>
				<InputLabel>Difficulty<span style={{color: 'red'}}>*</span></InputLabel>
				<ChipArray tags={['Beginner', 'Intermediate', 'Expert']} onChange={handleDifficultyChange} value={difficulty} />
			</div>

			<div style={formGroup2}>
				<InputLabel>Category<span style={{color: 'red'}}>*</span></InputLabel>
				<ChipArray tags={categories} onChange={handleCategoryChange} value={category} />
			</div>

			<div style={formGroup2}>
				<InputLabel>Search Tags</InputLabel>
				<Autocomplete
					multiple
					options={searchTags.sort()}
					value={selectedTags}
					getOptionDisabled={(option) => (selectedTags.length === 5 || selectedTags.includes(option) ? true : false ? true : false)}
					freeSolo
					filterOptions={(options, params) => {
						const filtered = filterOptions(options, params);
						
						const { inputValue } = params;
						const isExisting = options.some((option) => inputValue === option);
						if (inputValue !== '' && !isExisting) {
							filtered.push(inputValue);
							setInputTag(inputValue);
						}

						return filtered;
					}}
					autoHighlight
					selectOnFocus
					onChange={handleTagsChange}
					style={{paddingRight: 30}}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							label="Add up to 5 Search Tags"
							placeholder={selectedTags.length === 5 ? "You can't add more" : "Add Search Tags"}
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default StepOne;