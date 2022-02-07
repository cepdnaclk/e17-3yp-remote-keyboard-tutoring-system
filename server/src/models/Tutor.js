const mongoose = require('mongoose');   // imports mongoose
const Schema = mongoose.Schema;         // defines the strcuture of documents inside a collection

const tutorSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        max : 255,
        min : 3
    },
    lastName : {
        type : String,
        required : true,
        max : 255,
        min : 3
    },
    email : {
        type : String,
        required : true,
        max : 255,
        min : 6
    },
    username : {
        type : String,
        required : true,
        max : 64,
        min : 6
    },
    password : {
        type : String,
        required : true,
        max : 1024,
        min : 72
    },
    DOB : {
        type : Date,
        required : true
    },
    phone : {
        type : String,
        required : false,
        max : 15,
        min : 10
    },
    country : {
        type : String,
        required : true,
        max : 255,
        min : 5
    },
    deviceID : {
        type : String,
        required : false,
        min : 5
    },
    date : {
        type : Date,
        default : Date.now
    },
    avatar : {
        type : String,
        default: null
    },
    confirmed : {
        type : String,
        default : "false"
    },
    courses : [{
        type : Schema.Types.ObjectId,
        ref : 'Course'
    }],
});

tutorSchema.set('toJSON', {
    versionKey: false,
    getters: true,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.password;
        delete ret.__v;
    }
});

tutorSchema.set('toObject', {
    versionKey: false,
    getters: true,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.password;
        delete ret.__v;
    }
});

tutorSchema.virtual('numberOfCourses').get(function () {
    return this.courses.length;
});

module.exports = mongoose.model('Tutor', tutorSchema);