/*
    Generalization model for the Student and Tutor entities.
*/

const mongoose = require('mongoose');   // imports mongoose
const Schema = mongoose.Schema;         // defines the strcuture of documents inside a collection

const userSchema = Schema({
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
    // Role of the user
    role : {
        type: String,
        required: true,
        enum: ['student', 'tutor', 'admin']
    },
    // Reference to the user's data in the particular database
    ref : {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);