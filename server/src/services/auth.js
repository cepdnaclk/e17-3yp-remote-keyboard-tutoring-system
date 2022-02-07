const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');
const RefreshToken = require('../models/RefreshToken');
const randomToken = require('rand-token');

// Create a new object from the monogoose model
const generateRefreshToken = (userId, ipAddress) => {
    return new RefreshToken({
        user: userId,
        token: randomToken.uid(256),
        expiresAt: new Date(Date.now() + (1 * 24 * 60 * 60 * 1000)),
        createdByIP: ipAddress
    });
};

// Generate a new JWT access token
const generateAccessToken = (user) => {
    return jwt.sign({
        user: user._id,
        role: user.role,
        expiresIn: '15m'
    }, process.env.TOKEN_SECRET);
};

// Validate a refresh token
const getRefreshToken = async (token) => {
    const refreshToken = await RefreshToken.findOne({ token: token });

    if (!refreshToken || !refreshToken.isActive) throw new Error('Refresh token is not valid');
    return refreshToken;
};

const getRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const refreshTokens = await RefreshToken.find({ user: userId });
    return refreshTokens;
};

const refreshToken = async (token, ipAddress) => {
    const refreshToken = await getRefreshToken(token);

    if (!refreshToken) throw new Error('Refresh token is not valid');

    var user = await Student.findById(refreshToken.user).lean();

    if (!user) {
        user = await Tutor.findById(refreshToken.user).lean();
        user.role = 'tutor';
    }
    else user.role = 'student';

    // Replace the old refresh token with a new one.
    const newRefreshToken = generateRefreshToken(refreshToken.user, ipAddress);
    refreshToken.revokedAt = Date.now();
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    const accessToken = generateAccessToken(user);

    return {
        accessToken: accessToken,
        refreshToken: newRefreshToken.token,
        ref: user
    };
};

const revokeToken = async (token, ipAddress) => {
    const refreshToken = await getRefreshToken(token);

    // Revoke the refresh token.
    refreshToken.revokedAt = Date.now();
    refreshToken.revokedByIP = ipAddress;
    await refreshToken.save();
};

const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + (1 * 24 * 60 * 60 * 1000))
    };
    res.cookie('refreshToken', token, cookieOptions);
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];

    return async (req, res, next) => {
        var auth = req.header('Authorization');
        if(!auth) return res.status(401).send({status: false, message: 'Access denied'});

        auth = auth.split(' ');

        try {
            const verified = jwt.verify(auth[1], process.env.TOKEN_SECRET);

            if (!verified) return res.status(401).send({success: false, message: 'Access denied'});

            var user = await Tutor.findById(verified.user).lean() || await Student.findById(verified.user).lean();

            if (!user || (roles.length && !roles.includes(verified.role))) return res.status(401).send({success: false, message: 'Access denied'});

            req.user = user;
            req.user.role = verified.role;
            const refreshTokens = await RefreshToken.find({ user: user._id });
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        } catch (err) {
            return res.status(401).send({success: false, message: err.message});
        }
    };
};

module.exports = {
    generateRefreshToken,
    generateAccessToken,
    getRefreshToken,
    getRefreshTokens,
    refreshToken,
    revokeToken,
    setTokenCookie,
    authorize
};