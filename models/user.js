const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requied: true
    },
    email: {
        type: String,
        requied: true
    },
    password: {
        type: String,
        requied: true
    },
    dob: {
        type: Date,
        default: Date.now()
    },
    fullname: {
        type: String,
        required: true
    }
})

mongoose.model('User', userSchema);