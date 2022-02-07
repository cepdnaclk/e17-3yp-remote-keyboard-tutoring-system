// imports dependencies
const express = require('express'); 
const router = express.Router();   
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verify, verifyTutor } = require('./verifyToken');
const nodemailer = require('nodemailer');
const path = require('path');
const {resolve} = require('path');
const multer = require('multer');
fs = require('fs');

// TODO: Upload path should be like: ../uploads/avatars/0/a/3/d/9/ where 0a3d9 is the first five characters of the user's id
const uploadPath = resolve(__dirname, '../uploads/avatars');
const {registerValidation} = require('../validation/validation');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
});

// registers a tutor
router.post('/register', async (req, res) => {
    // validate before saving data
    const error = registerValidation(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});

    // checks if tutor is already in the database
    const usernameExist = await Tutor.findOne({username : req.body.username});
    if (usernameExist) return res.status(400).json({success: false, message: 'Username already exists'});

    const emailExist = await Tutor.findOne({email : req.body.email});
    if (emailExist) return res.status(400).json({success: false, message: 'Email already exists'});

    // hashes the password
    const salt = await bcrypt.genSalt(10);  
    const hashPW = await bcrypt.hash(req.body.password, salt);

    // creates a new tutor
    const tutor = new Tutor({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        username : req.body.username,
        password : hashPW,
        DOB : req.body.DOB,
        phone : req.body.phone,
        country : req.body.country,
        deviceID : req.body.deviceID
    });

    // creates a new user
    const user = new User({
        username : req.body.username,
        email : req.body.email,
        role : 'tutor',
        ref : tutor // Reference to the tutor
    });

    try {
        await user.save();
        await tutor.save();

        // ***** email confirmation should be sent here *****
        const emailToken = await jwt.sign({_id : tutor._id, role : "tutor"}, process.env.TOKEN_SECRET, {expiresIn : '1d'});

        // html data
        const htmlPath = path.join(__dirname, process.env.EMAIL_PATH);

        var html1 = await fs.readFileSync(path.join(htmlPath, 'confirm-email-1.html').replace(/\\/g, '\\'));
        var html2 = await fs.readFileSync(path.join(htmlPath, 'confirm-email-2.html').replace(/\\/g, '\\'));
        var html3 = await fs.readFileSync(path.join(htmlPath, 'confirm-email-3.html').replace(/\\/g, '\\'));
        const url = `http://localhost:3000/register?role=tutor&token=${emailToken}&user=${tutor.username}`;
        transporter.sendMail({
            to : tutor.email,
            subject : "Confirm your Email",
            html : html1 + url + html2 + url + html3
        }, function(err, data) {
            if(err){
                console.log('Error: ', err);
            }
            else{
                console.log('Email sent');
            }
        });

        res.status(201).send({success: true, message: 'Tutor account created successfully'});
    }
    catch(err) {
        res.status(400).send({success: true, message: err.message});
    }
})

// gest basic info of the tutor
router.get('/info/:id/:filename?', verify, (req, res) => {
    const id = req.params.id;
    const filename = req.params.filename;
    Tutor.findById(id)
        .then(result => {
            if (filename) res.sendFile(path.join(uploadPath, result.avatar));
            else res.send({success: true, data: result, message: 'Tutor info retrieved successfully'});
        })
        .catch(err => {
            res.send({success: false, message: err.message});
        })
})

// upload profile avatar
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

router.post('/avatar/:id', upload.single('avatar-upload'), verifyTutor, async (req, res) => {
    try {
        const id = req.params.id;
        const file = req.file;
        const avatar = req.body.avatar;

        if (file) {
            await Tutor.findByIdAndUpdate(id, {
                $set : {
                    avatar : file.filename
                }
            });
        }
        else {
            await Tutor.findByIdAndUpdate(id, {
                $set : {
                    avatar : `default:${avatar}`
                }
            });
        }

        res.send({success: true, avatar: avatar, message: 'Avatar uploaded successfully'});
    }
    catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
})

// get all the data about tutor's courses.
// the data can be requested with pagination.
// example request: /courses/all?page=1&limit=10&sort=latest.
router.get('/courses/all', verifyTutor, async (req, res) => {
    try {
        const auth = req.headers.authorization.split(' ');
        const _count = req.query.count;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        let sortBy = { dateCreated : -1 };

        if (req.query.sort === 'trendy') sortBy = { pointsOfInterest: -1 };
        else if (req.query.sort == 'best-rated') sortBy = { rating: -1 };

        if (page < 1 || limit < 1) return res.status(400).send({success: false, message: 'Invalid Page or Limit'});
    
        // if page or limit is not provided, return all the data
        if (!page || !limit) {
            const courses = await Course.find({ author: auth[2], isPublished: true }).sort(sortBy);
            return res.status(200).send({success: true, courses: courses});
        }
        // if page or limit is provided, return the data with pagination. alsp send the page number and limit of previous and next page.
        // example: {next: {page: 2, limit: 10}, previous: {page: 0, limit: 10}, courses: [{}, {}, {}]}
        else {
            const courses = await Course.find({ author: auth[2], isPublished: true }).skip((page - 1) * limit).limit(limit).sort(sortBy);
            const count = await Course.countDocuments({isPublished: true});
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

// email confirmation
router.get('/confirmation/:token', async(req, res) => {
    if(!req.params.token) return res.status(424).send({success: false, message: 'E-mail verification unsucessful'});
    try {
        const tutor =  jwt.verify(req.params.token, process.env.TOKEN_SECRET);
        const id = tutor._id;
        const role = student.role;

        if (role !="tutor") return res.send({success: false, message: 'E-mail verification unsucessful'});
        
        await Tutor.findByIdAndUpdate(id, {
            $set : {
                confirmed : "true"
            }
        })
    }
    catch (e) {
        return res.send({success: false, message: 'E-mail verification unsucessful'});
    }
    return res.status(201).send({success: true, message: 'E-mail verified'});
});

// get all the course data of a specific tutor.
// the data can be requested with pagination.
// example request: /tutor/courses?page=1&limit=10&sort=latest.
router.get('/courses', verifyTutor, async (req, res) => {
    try {
        const _count = req.query.count;
        var auth = req.header('Authorization');
        auth = auth.split(' ');

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        let sortBy = { dateCreated: -1 };
        let filterBy = true;

        if (req.query.sort === 'popular') sortBy = { pointsOfInterest: -1 };
        else if (req.query.sort == 'best-rated') sortBy = { rating: -1 };
        else if (req.query.sort == 'alphabetical') sortBy = { title: 1 };

        if (req.query.filter === 'not published') filterBy = false;

        if (page < 1 || limit < 1) return res.status(400).send({success: false, message: 'Invalid Page or Limit'});

        const tutor = await Tutor.findById(auth[2], 'courses');
    
        // if page or limit is not provided, return all the data
        if (!page || !limit) {
            const courses = await Course.find({ _id: {$in: tutor.courses} });
            return res.status(200).send({success: true, courses: courses});
        }
        // if page or limit is provided, return the data with pagination. alsp send the page number and limit of previous and next page.
        // example: {next: {page: 2, limit: 10}, previous: {page: 0, limit: 10}, courses: [{}, {}, {}]}
        else {
            const courses = await Course.find({ _id: {$in: tutor.courses} , isPublished: filterBy }).skip((page - 1) * limit).limit(limit).sort(sortBy);
            const count = await Course.countDocuments({ _id: {$in: tutor.courses} , isPublished: filterBy });
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

module.exports = router;