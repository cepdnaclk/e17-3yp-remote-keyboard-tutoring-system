const ClassRoom = require('../models/ClassRoom');
const Course = require('../models/Course');
const Tutor = require('../models/Tutor');
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { verifyTutor, verify } = require('./verifyToken');
const { classValidation, joinValidation } = require('../validation/classValidation');
var crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len).toUpperCase();   // return required number of characters
}

router.post('/create', verifyTutor, async (req, res) => {
    const error = classValidation(req.body);
    if (error) return res.status(400).send({success: false, message: error.details[0].message});

    var auth = req.header('Authorization').split(' ');
    const tutorExists = await Tutor.findOne({ _id: auth[2] });
    if (!tutorExists) return res.status(401).send({success: false, message: 'Unauthorized Access'});

    // hashes the password
    const salt = await bcrypt.genSalt(10);  
    const hashPW = await bcrypt.hash(req.body.password, salt);

    // Create a new class
    const classToCreate = new ClassRoom({
        name: req.body.name,
        password: hashPW,
        host: auth[2],
        maxParticipants: req.body.maxParticipants,
        course: req.body.course,
    });

    try {
        const id = await classToCreate.save();

        await Course.findByIdAndUpdate(req.body.course, { $push: { classRooms: id } });

        return res.status(201).send({success: true, message: 'Class created successfully', ref: id});
    }
    catch (err) {
        return res.status(400).send({success: false, message: err.message});
    }
});

router.get('/info/:id', verify, async (req, res) => {
    const classToFind = await ClassRoom.findById(req.params.id);
    if (!classToFind) return res.status(404).send({success: false, message: 'Class not found'});

    const isHost = classToFind.host == req.header('Authorization').split(' ')[2];
    var hasSubscribed = false;

    const isStudent = await Student.findById(req.header('Authorization').split(' ')[2]);
    if (isStudent) {
        hasSubscribed = isStudent.subscribedClasses.includes(req.params.id);
    }

    if (!isHost && !hasSubscribed) return res.status(401).send({success: false, message: 'Unauthorized Access'});

    const course = await Course.findById(classToFind.course);
    if (!course) return res.status(404).send({success: false, message: 'Course not found'});

    return res.status(200).send({ success: true, class: classToFind });
});

router.post('/start/:id', verifyTutor, async (req, res) => {
    const classToFind = await ClassRoom.findById(req.params.id);
    if (!classToFind) return res.status(404).send({success: false, message: 'Class not found'});

    const course = await Course.findById(classToFind.course);
    if (!course) return res.status(404).send({success: false, message: 'Course not found'});

    if (classToFind.host != req.header('Authorization').split(' ')[2]) return res.status(401).send({success: false, message: 'Unauthorized Access'});
    
    if (classToFind.started) return res.status(400).send({success: false, message: 'Class already started'});

    try {
        classToFind.started = true;
        classToFind.joinCode = randomValueHex(10);
        classToFind.save();

        return res.status(200).send({ success: true, message: 'Class started successfully' });
    }
    catch (err) {
        return res.status(400).send({success: false, message: err.message});
    }
});

router.post('/end/:id', verifyTutor, async (req, res) => {
    const classToFind = await ClassRoom.findById(req.params.id);
    if (!classToFind) return res.status(404).send({success: false, message: 'Class not found'});

    const course = await Course.findById(classToFind.course);
    if (!course) return res.status(404).send({success: false, message: 'Course not found'});

    if (classToFind.host != req.header('Authorization').split(' ')[2]) return res.status(401).send({success: false, message: 'Unauthorized Access'});

    if (!classToFind.started) return res.status(400).send({success: false, message: 'Class not started'});

    try {
        classToFind.started = false;
        classToFind.joinCode = null;
        classToFind.save();

        return res.status(200).send({ success: true, message: 'Class ended successfully' });
    }
    catch (err) {
        return res.status(400).send({success: false, message: err.message});
    }
});

router.post('/allow/:id', verifyTutor, async (req, res) => {
    const classToFind = await ClassRoom.findById(req.params.id);
    if (!classToFind) return res.status(404).send({success: false, message: 'Class not found'});

    const course = await Course.findById(classToFind.course);
    if (!course) return res.status(404).send({success: false, message: 'Course not found'});

    if (classToFind.host != req.header('Authorization').split(' ')[2]) return res.status(401).send({success: false, message: 'Unauthorized Access'});

    const user = await User.findOne({ username: req.body.user });
    if (!user) return res.status(404).send({success: false, message: 'User not found'});
    if (user.role === 'student' && !course.enrollees.includes(user.ref)) return res.status(400).send({success: false, message: 'User not enrolled in course'});
    if (classToFind.allowedUsers.includes(user._id)) return res.status(400).send({success: false, message: 'User already in class'});

    try {
        classToFind.allowedUsers.push(user._id);
        classToFind.save();

        return res.status(200).send({ success: true, message: 'User added successfully' });
    }
    catch (err) {
        return res.status(400).send({success: false, message: err.message});
    }
});

router.post('/join', verify, async (req, res) => {
    const error = joinValidation(req.body);
    if (error) return res.status(400).send({success: false, message: error.details[0].message});

    const classToFind = await ClassRoom.findById(req.body.roomId);
    if (!classToFind) return res.status(404).send({success: false, message: 'Class not found'});

    const course = await Course.findById(classToFind.course);
    if (!course) return res.status(404).send({success: false, message: 'Course not found'});

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send({success: false, message: 'User not found'});

    if (!course.enrollees.includes(req.header('Authorization').split(' ')[2])) return res.status(403).send({success: false, message: 'Unauthorized Access'});

    if (!classToFind.allowedUsers.includes(user._id)) return res.status(400).send({success: false, message: 'User not allowed in class'});

    const validPassword = await bcrypt.compare(req.body.password, classToFind.password);
    if (!validPassword) return res.status(400).send({success: false, message: 'Invalid password'});

    if (classToFind.participants.length == classToFind.maxParticipants) return res.status(400).send({success: false, message: 'Class is full'});

    try {
        classToFind.participants.push(user._id);
        classToFind.save();

        return res.status(200).send({ success: true, message: 'Joined class successfully' });
    }
    catch (err) {
        return res.status(400).send({success: false, message: err.message});
    }
});

router.post('/subscribe/:id', verify, async (req, res) => {
    const classToFind = await ClassRoom.findById(req.params.id);
    if (!classToFind) return res.status(404).send({success: false, message: 'Class not found'});

    const course = await Course.findById(classToFind.course);
    if (!course) return res.status(404).send({success: false, message: 'Course not found'});

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send({success: false, message: 'User not found'});

    const auth = req.header('Authorization').split(' ');
    if (!course.enrollees.includes(user.ref)) return res.status(403).send({success: false, message: 'Unauthorized Access'});

    if (!classToFind.allowedUsers.includes(user._id)) return res.status(400).send({success: false, message: 'User not allowed in class'});

    if (user.role != 'student') return res.status(403).send({success: false, message: 'Unauthorized Access'});

    const student = await Student.findById(user.ref);
    if (!student) return res.status(404).send({success: false, message: 'Student not found'});

    if (student.subscribedClasses.includes(classToFind._id)) return res.status(400).send({success: false, message: 'User already subscribed'});

    try {
        student.subscribedClasses.push(classToFind._id);
        student.save();

        return res.status(200).send({ success: true, message: 'Subscribed successfully' });
    }
    catch (err) {
        return res.status(400).send({success: false, message: err.message});
    }
});

module.exports = router;