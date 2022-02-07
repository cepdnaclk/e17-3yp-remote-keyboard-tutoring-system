const express = require('express');
const router = express.Router();   
const { verify } = require('./verifyToken');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

router.get('/info', verify, async (req, res) => {
    const { username, id } = req.query;
    const findBy = username ? { username: username } : { ref: id };
    const user = await User.findOne(findBy);
    if(!user) return res.status(404).send({success: false, message: 'User not found'});
    
    if(user.role === 'tutor') {
        const tutor = await Tutor.findById(user.ref).lean();
        tutor.role = 'tutor';
        tutor.password = undefined;
        tutor.confirmed = undefined;
        return res.send({success: true, data: tutor});
    }
    else if(user.role === 'student'){
        const student = await Student.findById(user.ref).lean();
        student.role = 'student';
        student.password = undefined;
        student.confirmed = undefined;
        return res.send({success: true, data: student});
    }
    else return res.status(404).send({success: false, message: 'User not found'});
});

module.exports = router;