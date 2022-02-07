const mongoose = require('mongoose');   // imports mongoose
const Schema = mongoose.Schema;         // defines the strcuture of documents inside a collection

const courseSchema = new Schema({
    title : {
        type : String,
        required : true,
        max : 255,
        min : 8
    },
    description : {
        type : String,
        required : true,
        max : 32768,
        min : 3
    },
    difficulty : {
        type : String,
        enum : ['Beginner', 'Intermediate', 'Expert'],
        required : true
    },
    category : {
        type : String,
        required : false
    },
    searchTags : {
        type : [String],
        default : []
    },
    dateCreated : {
        type : Date,
        default : Date.now
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tutor',
        required : true,
    },
    syllabus : [{
        type : String,
        required : true,
    }],
    pointsOfInterest : {
        type : Number,
        default : 0
    },
    rating : {
        type : Number,
        default : 0
    },
    estimatedDuration : {
        type : Number,
        default : 0
    },
    coverImage : {
        type : String,
        default : 'default:0'
    },
    searchTags : [{
        type : String,
    }],
    prerequisites : [{
        type : String,
    }],
    price : {
        type : Number,
        default : 0
    },
    enrollees : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    }],
    classRooms : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ClassRoom'
    }]
})

module.exports = mongoose.model('Course', courseSchema);