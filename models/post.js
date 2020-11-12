const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    postedTime: {
        type: Date,
        default: Date.now
    },
    comments: [{
        by: {
            type: ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
        }
    }]
})

mongoose.model("Post", postSchema);