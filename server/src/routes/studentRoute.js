// imports dependencies
const express = require('express'); 
const router = express.Router();   
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation } = require('../validation/validation');
const { verify, verifyStudent } = require('./verifyToken');
const nodemailer = require('nodemailer');
const path = require('path');
const { resolve } = require('path');
const multer = require('multer');
fs = require('fs');

const uploadPath = resolve(__dirname, '../uploads/avatars');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

// registers a student
router.post('/register', async (req, res) => {

    //res.send('working');
    // validate before saving data
    const error = registerValidation(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});

    // checks if student is already in the database
    const usernameExist = await User.findOne({username : req.body.username});
    if (usernameExist) return res.status(400).json({success: false, message: 'Username already exists'});

    const emailExist = await User.findOne({email : req.body.email});
    if (emailExist) return res.status(400).json({success: false, message: 'Email already exists'});

    // hashes the password
    const salt = await bcrypt.genSalt(10);  
    const hashPW = await bcrypt.hash(req.body.password, salt);

    // creates a new student
    const student = new Student({
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
        role : 'student',
        ref : student // Reference to the student
    });

    try {
        await user.save();
        await student.save();

        // ***** email confirmation should be sent here *****
        const emailToken = await jwt.sign({_id : student._id, role : "student"}, process.env.TOKEN_SECRET, {expiresIn : '1d'});
        
        // html data
        const htmlPath = path.join(__dirname, process.env.EMAIL_PATH);

        var html1 = await fs.readFileSync(path.join(htmlPath, 'confirm-email-1.html').replace(/\\/g, '\\'));
        var html2 = await fs.readFileSync(path.join(htmlPath, 'confirm-email-2.html').replace(/\\/g, '\\'));
        var html3 = await fs.readFileSync(path.join(htmlPath, 'confirm-email-3.html').replace(/\\/g, '\\'));
        const url = `http://localhost:3000/register?role=student&token=${emailToken}&user=${student.username}`;
        transporter.sendMail({
            to : student.email,
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

        res.status(201).send({success: true, message: 'Student account created successfully'});
    }
    catch(err) {
        res.status(500).send({success: false, message: err.message});
    }
})

// gest basic info of the student
router.get('/info/:id/:filename?', verify, (req, res) => {
    const id = req.params.id;
    // filename is optional. if provided, the avatar file is returned
    const filename = req.params.filename;

    Student.findById(id)
        .then(result => {
            if (filename) res.sendFile(path.join(uploadPath, result.avatar));
            else res.send({success: true, data: result, message: 'Student info retrieved successfully'});
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

router.post('/avatar/:id', upload.single('avatar-upload'), verifyStudent, async (req, res) => {
    try {
        const id = req.params.id;
        const file = req.file;
        const avatar = req.body.avatar;

        if (file) {
            await Student.findByIdAndUpdate(id, {
                $set : {
                    avatar : file.filename
                }
            });
        }
        else {
            await Student.findByIdAndUpdate(id, {
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

// email confirmation
router.get('/confirmation/:token', async (req, res) => {
    if(!req.params.token) return res.status(424).send({success: false, message: 'E-mail verification unsucessful'});
    try {
        const student =  jwt.verify(req.params.token, process.env.TOKEN_SECRET);
        const id = student._id;
        const role = student.role;

        if (role !="student") return res.send({success: false, message: 'E-mail verification unsucessful'});
        
        await Student.findByIdAndUpdate(id, {
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

module.exports = router;
