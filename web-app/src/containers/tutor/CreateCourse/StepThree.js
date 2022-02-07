import React, { useState, useEffect } from 'react';
import { TextField, Tooltip } from '@material-ui/core';
import { IconButton, InputLabel } from '@material-ui/core'
import Editor from '../../../components/QuillTextEditor/Editor';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setStepThree } from '../../../reducers/createCourseSlice';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircle';

const formGroup = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingBottom: 30
}

const formGroup2 = {
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '6fr 1fr',
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

const StepThree = ({ setStatus }) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState(useSelector(state => state.createCourse.courseDescription));
    const [limitDescription, setLimitDescription] = useState('');
    const [originalText, setOriginalText] = useState(useSelector(state => state.createCourse.originalText));
    const [requirements, setRequirements] = useState(useSelector(state => state.createCourse.coursePrerequisites) || ['']);

    useEffect(() => {
        setStatus({ success: false, message: '' });
        dispatch(setStepThree({ description: description, prerequisites: requirements, originalText: originalText }));
        if (originalText.length < 150) setStatus({ success: false, message: 'Description must be at least 150 characters' });
        else setStatus({ success: true, message: 'You can proceed to the next step' });
    }, [description, requirements]);

    const handleAdd = (index) => {
        const newRequirements = [...requirements];
        if (index !== requirements.length - 1)
        newRequirements.splice(index + 1, 0, '');
        else newRequirements.push('');
        setRequirements([...newRequirements]);
    }

    const handleDelete = (index) => {
        if (requirements.length > 1) {
            const newRequirements = [...requirements];
            newRequirements.splice(index, 1);
            setRequirements([...newRequirements]);
        }
    }

    const handleDescriptionChange = (content, delta, source, editor) => {
        if (editor.getText(content).length <= 2501) {
            setDescription(content);
            setLimitDescription(content);
            setOriginalText(editor.getText(content));
        }
        else {
            setDescription(limitDescription);
            setOriginalText(editor.getText(limitDescription));
        }
    }

    const handleRequirementChange = (event, index) => {
        const newRequirements = [...requirements];
        newRequirements[index] = event.target.value;
        setRequirements([...newRequirements]);
    }

    return (
        <motion.div style={formContentStyle}>
            <motion.div style={formGroup}>
                <InputLabel style={{paddingBottom: 20, fontSize: 18}}>Description<span style={{color: 'red'}}>*</span></InputLabel>
                <Editor value={description} onChange={handleDescriptionChange} style={{height: '15rem'}}/>
                <div style={{paddingTop: 10}}>
                    <span style={{float: 'right'}}>{`${originalText.length - 1} / 2500 max`}</span>
                </div>
            </motion.div>

            <motion.div style={formGroup}>
                <InputLabel style={{paddingBottom: 20, fontSize: 18}}>Prerequisites</InputLabel>
                <AnimatePresence>
                    {requirements.map((requirement, index) => (
                        <motion.div key={index} style={formGroup2}
                            initial={{opacity: 0, scale: '0.9', transition: {duration: 0.1}}}
                            animate={{opacity: 1, scale: 1, transition: {duration: 0.15}}}
                            exit={{opacity: 0, scale: '0.9', transition: {duration: 0.1}}}>
                            <TextField
                                name="lesson"
                                label = {"Requirement " + (index + 1)}
                                variant="outlined"
                                value={requirement}
                                onChange={(e) => handleRequirementChange(e, index)}
                                autoComplete="off"
                            />

                            <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
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
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

export default StepThree;