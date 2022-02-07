import React, { useEffect, useState } from 'react';
import { TextField, IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setCourseTopics } from '../../../reducers/createCourseSlice';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircle';

const formGroup3 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 6fr 1fr',
    gridColumnGap: '10px',
    paddingTop: 10
}

const formContentStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 100
}

const StepTwo = ({ setStatus }) => {
    const dispatch = useDispatch();
    const [topics, setTopics] = useState(useSelector(state => state.createCourse.courseTopics));

    // Step-2 validation
    useEffect(() => {
        setStatus({ success: false, message: '' });
        dispatch(setCourseTopics(topics));
        let all = true;
        topics.forEach(topic => {
            if (topic === '') {
                setStatus({ success: false, message: 'Topics cannot be empty' });
                all = false;
            }
        });
        if (all) setStatus({ success: true, message: 'You can proceed to the next step' });
    }, [topics]);

    const handleChange = (index, event) =>{
        const newTopics = [...topics];
        newTopics[index] = event.target.value;
        setTopics([...newTopics]);
    }

    const handleAdd = (index) => {
        const newTopics = [...topics];
        if (index !== topics.length - 1)
        newTopics.splice(index + 1, 0, '');
        else newTopics.push('');
        setTopics([...newTopics]);
    }

    const handleDelete = (index) => {
        if (topics.length > 3) {
            const newTopics = [...topics];
            newTopics.splice(index, 1);
            setTopics([...newTopics]);
        }
    }

    return (
        <motion.div style={formContentStyle}>
            <AnimatePresence>
                {topics.map((topic, index) => (
                    <motion.div key={index} style={formGroup3}
                            initial={{opacity: 0, scale: '0.9', transition: {duration: 0.1}}}
                            animate={{opacity: 1, scale: 1, transition: {duration: 0.15}}}
                            exit={{opacity: 0, scale: '0.9', transition: {duration: 0.1}}}>
                        <h2 style={{margin: 0}}>Week {index + 1}</h2>
                        <TextField
                            name="lesson"
                            label = {"Topic for week " + (index + 1)}
                            variant="outlined"
                            autoComplete="off"
                            value={topic}
                            onChange={(event) => handleChange(index, event)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') handleAdd(index);
                            }}
                        />

                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Tooltip title="Remove lesson" aria-label="delete">
                                <IconButton style={{width: 50, height: 50}} label="delete" onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Add lesson below" aria-label="add">
                                <IconButton style={{width: 50, height: 50}} label="add" onClick={() => handleAdd(index)}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}

export default StepTwo;
