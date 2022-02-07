const express = require('express');
const { verify, verifyTutor, verifyStudent } = require('./verifyToken');
const router = express.Router();
const Course = require('../models/Course');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');
const {resolve, join} = require('path');
const multer = require('multer');
var fs = require('fs');
const { courseCreateValidation } = require('../validation/courseValidation');

// TODO: Upload path should be like: ../uploads/courses/0/9/a/2/B/ where 09a2B is the first five characters of the course id.
// TODO: Add upload cover image route.
const uploadPath = resolve(__dirname, '../uploads/courses');

router.post('/create', verifyTutor, async (req, res) => {
    // validate before saving the data
    const error = courseCreateValidation(req.body);
    if (error) return res.status(400).send({success: false, message: error.details[0].message});

    // authenticate the user
    var auth = req.header('Authorization');
    auth = auth.split(' ');
    const tutorExists = await Tutor.findOne({ _id: auth[2] });
    if (!tutorExists) return res.status(401).send({success: false, message: 'Unauthorized Access'});

    // create a new course
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        difficulty: req.body.difficulty,
        category: req.body.category,
        searchTags: req.body.searchTags,
        syllabus: req.body.syllabus,
        prerequisites: req.body.prerequisites,
        author: tutorExists,
        isPublished: req.body.isPublished,
    });

    try {
        const id = await course.save();

        await Tutor.findByIdAndUpdate(auth[2], { $push: { courses: id } });

        res.status(201).send({success: true, ref: id, message: 'Course Created Successfully'});
    }
    catch (err) {
        console.log(err);
        res.status(400).send({success: false, message: err.message});
    }
})

router.post('/edit/:id', verifyTutor, async (req, res) => {
    // validate before saving the data
    const error = courseCreateValidation(req.body);
    if (error) return res.status(400).send({success: false, message: error.details[0].message});

    const id = req.params.id;

    // create a new course
    const update = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        difficulty: req.body.difficulty,
        category: req.body.category,
        searchTags: req.body.searchTags,
        syllabus: req.body.syllabus,
        prerequisites: req.body.prerequisites,
        isPublished: req.body.isPublished,
    };

    try {
        await Course.findByIdAndUpdate(id, update);

        res.status(201).send({success: true, message: 'Course Created Successfully'});
    }
    catch (err) {
        console.log(err);
        res.status(400).send({success: false, message: err.message});
    }
})

// get data of a specific course
router.get('/info/:id/:coverImage?', verify, async (req, res) => {
    const id = req.params.id;
    const filename = req.params.coverImage;
    Course.findById(id)
    .then(result => {
        if (filename) res.sendFile(join(uploadPath, result.coverImage));
        else res.send({success: true, data: result, message: 'Cover image sent successfully'});
    })
    .catch(err => {
        console.log(err);
        res.send({success: false, message: err.message});
    })
})

// upload course cover image
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        return cb(null, uploadPath)
    },
    filename: function(req, file, cb) {
      cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
    }
});

const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        fs.readdir(uploadPath, (err, files) => {
            files.forEach(_file => {
                return _file.split('_')[3] === file.originalname ? cb(null, false) : cb(null, true);
            });
        });
    }
});

router.post('/coverImage/:id', upload.single('cover-upload'), verifyTutor, async (req, res) => {
    try {
        const id = req.params.id;
        const file = req.file;

        await Course.findByIdAndUpdate(id, {
            $set : {
                coverImage : file.filename
            }
        })

        res.send({success: true, message: 'Cover image uploaded successfully'});
    }
    catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
})

// get all the data about courses.
// the data can be requested with pagination.
// example request: /course/all?page=1&limit=10&sort=latest.
router.get('/all', verify, async (req, res) => {
    try {
        const _count = req.query.count;
        var auth = req.header('Authorization');
        auth = auth.split(' ');

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        let sortBy = { dateCreated: -1 };
        let filterBy = { isPublished: true };

        if (req.query.sort === 'trendy') sortBy = { pointsOfInterest: -1 };
        else if (req.query.sort == 'best-rated') sortBy = { rating: -1 };
        else if (req.query.sort == 'alphabetical') sortBy = { title: 1 };

        if (req.query.filter === 'enrolled') filterBy = { isPublished: true, enrollees: auth[2] };

        if (page < 1 || limit < 1) return res.status(400).send({success: false, message: 'Invalid Page or Limit'});
    
        // if page or limit is not provided, return all the data
        if (!page || !limit) {
            const courses = await Course.find(filterBy).sort(sortBy);
            await Promise.all(courses.map(async course => {
                course.author = await Tutor.findById(course.author, '_id username firstName lastName avatar courses');
                return course;
            }));
            return res.status(200).send({success: true, courses: courses});
        }
        // if page or limit is provided, return the data with pagination. alsp send the page number and limit of previous and next page.
        // example: {next: {page: 2, limit: 10}, previous: {page: 0, limit: 10}, courses: [{}, {}, {}]}
        else {
            const courses = await Course.find(filterBy).skip((page - 1) * limit).limit(limit).sort(sortBy);
            await Promise.all(courses.map(async course => {
                course.author = await Tutor.findById(course.author, '_id username firstName lastName avatar courses');
                return course;
            }));
            const count = await Course.countDocuments(filterBy);
            let next = {page: page + 1, limit: limit};
            let previous = {page: page - 1, limit: limit};
            if (courses.length < limit) next = null;
            else if (count - (page * limit) < limit) next.limit = count - (page * limit);
            if (page == 1 || (page - 1) * limit > count) previous = null;
            let result = {success: true, courses: courses, next: next, previous: previous};
            if (_count) result.count = count;
            res.status(200).send(result);
        }
    }
    catch (err) {
        res.status(400).send({success: false, message: err.message});
    }
})

router.post('/enroll/:courseID', verifyStudent, async (req, res) => {
    try {
        const courseID = req.params.courseID;
        var auth = req.header('Authorization');
        auth = auth.split(' ');
        const studentID = auth[2];

        const course = await Course.findById(courseID);
        if (!course) return res.status(400).send({success: false, message: 'Course not found'});

        if (course.enrollees.includes(studentID)) return res.status(400).send({success: false, message: 'You are already enrolled in this course'});

        await Course.findByIdAndUpdate(courseID, {
            $push: {
                enrollees: studentID
            }
        });

        const ref = await Student.findByIdAndUpdate(studentID, {
            $push: {
                coursesEnrolled: courseID
            }
        }, { new: true });

        res.status(200).send({success: true, ref: ref, message: 'Enrolled Successfully'});
    }
    catch (err) {
        res.status(400).send({success: false, message: err.message});
    }
})

router.post('/unenroll/:courseID', verifyStudent, async (req, res) => {
    try {
        const courseID = req.params.courseID;
        var auth = req.header('Authorization');
        auth = auth.split(' ');
        const studentID = auth[2];

        const course = await Course.findById(courseID);
        if (!course) return res.status(400).send({success: false, message: 'Course not found'});

        if (!course.enrollees.includes(studentID)) return res.status(400).send({success: false, message: 'You are not enrolled in this course'});

        await Course.findByIdAndUpdate(courseID, {
            $pull: {
                enrollees: studentID
            }
        });

        const ref = await Student.findByIdAndUpdate(studentID, {
            $pull: {
                coursesEnrolled: courseID
            }
        }, { new: true });

        res.status(200).send({success: true, ref: ref, message: 'Unenrolled Successfully'});
    }
    catch (err) {
        res.status(400).send({success: false, message: err.message});
    }
})

module.exports = router;