const mongoose = require('mongoose');   // imports mongoose
const Schema = mongoose.Schema;         // defines the strcuture of documents inside a collection

const studentSchema = new Schema({
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
        default : null,
    },
    confirmed : {
        type : String,
        default : "false"
    },
    coursesEnrolled : [{
        type : Schema.Types.ObjectId,
        ref : 'Course',
        default : []
    }],
    subscribedClasses : [{
        type : Schema.Types.ObjectId,
        ref : 'ClassRoom',
        default : []
    }],
});

studentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.password;
        delete ret.__v;
    }
});

studentSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.password;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Student', studentSchema);