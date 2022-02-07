const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const bcrypt = require('bcryptjs');
const { loginValidation } = require('../validation/validation');
const { generateAccessToken, generateRefreshToken, setTokenCookie, refreshToken, revokeToken, authorize } = require('../services/auth');

router.post('/login', async (req, res) => {
    // cheks if the login request is valid
    const error = loginValidation(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});

    // checks if the user exists
    var criteria = (req.body.login.indexOf('@') === -1) ? {username: req.body.login} : {email: req.body.login};
    var user = await User.findOne(criteria);
    if (!user) return res.status(401).json({success: false, message: 'Invalid login or password'});

    const role = user.role;

    try {
        // assign the object reference of the requested user
        user = role == 'tutor' ? await Tutor.findById(user.ref).lean() : await Student.findById(user.ref).lean();
        user.role = role;
    }
    catch (err) {
        return res.status(400).json({success: false, message: err.message});
    }

    if (user.confirmed == 'false') {
        return res.status(403).json({success: false, message: 'Please confirm your email to login'});
    }

    // checks whether the password is correct
    const validPW = await bcrypt.compare(req.body.password, user.password);
    if (!validPW) return res.status(401).json({success: false, message: 'Invalid login or password'});

    // delete the user's password hash from the reference object
    user.password = undefined;
    // delete the confirmed flag from the reference object
    user.confirmed = undefined;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, req.ip);

    await refreshToken.save();

    setTokenCookie(res, refreshToken.token);
    res.json({success: true, message: 'Login successful', ref: user, accessToken : {token: accessToken, expiry: '15m'}});
})

router.post('/refreshToken', async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({success: false, message: 'Token is required'});

    const ipAddress = req.ip;

    refreshToken(token, ipAddress)
    .then(({accessToken, refreshToken, ref}) => {
        setTokenCookie(res, refreshToken);
        res.json({success: true, message: 'Refresh token successful', ref: ref, accessToken: {token: accessToken, expiry: (1000 * 60 * 15)}});
    })
    .catch(err => {
        res.status(400).json({success: false, message: err.message});
    })
})

router.post('/revokeToken', authorize(), async (req, res) => {
    // Accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({success: false, message: 'Token is required'});

    if (!req.user.ownsToken(token) && req.user.role !== 'admin') return res.status(403).json({success: false, message: 'You are not authorized to revoke this token'});

    revokeToken(token, ipAddress)
    .then(() => res.json({success: true, message: 'Token revoked'}))
    .catch(err => res.status(400).json({success: false, message: err.message}));
})


module.exports = router;