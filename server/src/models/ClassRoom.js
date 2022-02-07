const mongoose = require('mongoose');   // imports mongoose
const Schema = mongoose.Schema;         // defines the strcuture of documents inside a collection

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    joinCode: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    allowedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    host: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    raisedUsers: {
        type: Map,
        of: String
    },
    started: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('ClassRoom', schema);