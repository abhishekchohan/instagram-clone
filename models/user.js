const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

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
    },
    dp: {
        type: String,
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }],
    posts: [{
        type: ObjectId,
        ref: "Post"
    }],
    favPosts: [{
        type: ObjectId,
        ref: "Post"
    }]
})

mongoose.model('User', userSchema);