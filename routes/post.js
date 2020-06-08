const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const isLogged = require('../middlewares/isLogged');

router.get('/allposts', isLogged, (req, res) => {
    Post.find()
        .sort({ postedTime: -1 })
        .populate("postedBy", "_id username")
        .populate("likes", "_id, username")
        .exec()
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => console.log(err));
});

router.post('/', isLogged, (req, res) => {
    res.json({ isLogged: true })
});


router.post('/createpost', isLogged, (req, res) => {
    const { caption, url } = req.body;
    if (!caption || !url) {
        return res.status(422).json({ error: "Please enter required post data." })
    }
    req.user.password = undefined;
    req.user.__v = undefined;
    const post = new Post({
        caption,
        url,
        postedBy: req.user
    })
    post.save()
        .then(result => res.json({ post: result, message: "Post created successfully." }))
        .catch(err => console.log(err))
})

router.get('/myposts', isLogged, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id username")
        .then(myposts => {
            res.json({ myposts })
        })
        .catch(err => console.log(err));
});

module.exports = router;