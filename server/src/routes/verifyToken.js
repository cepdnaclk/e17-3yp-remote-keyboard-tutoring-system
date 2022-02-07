const jwt = require('jsonwebtoken');

// Function to verify a user with a valid token.
const verify = (req, res, next) => {
    var auth = req.header('Authorization');
    // Authentication
    if(!auth) return res.status(401).send({status: false, message: 'Access denied'});

    auth = auth.split(' ');

    try {
        const verified = jwt.verify(auth[1], process.env.TOKEN_SECRET);
        // Authorization
        if (!verified || verified.user != auth[2]) return res.status(403).send({status: false, message: 'Access denied'});
        
        next();
    }
    catch (err){
        res.status(400).send({success: false, message: 'Invalid token'});
    }
}

// Function to verify a tutor with a valid token.
const verifyTutor = (req, res, next) => {
    var auth = req.header('Authorization');
    // Authentication
    if(!auth) return res.status(401).send({status: false, message: 'Access denied'});

    auth = auth.split(' ');

    try {
        const verified = jwt.verify(auth[1], process.env.TOKEN_SECRET);
        // Authorization and access control
        if (!verified || verified.user != auth[2] || verified.role !== 'tutor') return res.status(403).send({status: false, message: 'Access denied'});

        next();
    }
    catch (err) {
        res.status(400).send('invalid token');
    }
}

// Function to verify a student with a valid token.
const verifyStudent = (req, res, next) => {
    var auth = req.header('Authorization');
    // Authentication
    if(!auth) return res.status(401).send({status: false, message: 'Access denied'});

    auth = auth.split(' ');

    try {
        const verified = jwt.verify(auth[1], process.env.TOKEN_SECRET);
        // Authorization and access control
        if (!verified || verified.user != auth[2] || verified.role !== 'student') return res.status(403).send({status: false, message: 'Access denied'});

        next();
    }
    catch (err) {
        res.status(400).send('invalid token');
    }
}

module.exports = {
    verify,
    verifyTutor,
    verifyStudent
};