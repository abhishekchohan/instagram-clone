const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const isLogged = require('../middlewares/isLogged');

router.get('/allposts', isLogged, (req, res) => {
    Post.find()
        .sort({ postedTime: -1 })
        .populate("postedBy", "_id username dp")
        .populate("likes", "_id username")
        .populate('comments.by', "_id username")
        .exec()
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => console.log(err));
});

// This one is just to validate user authentification..
router.post('/', isLogged, (req, res) => {
    res.json({ isLogged: true, user: req.user })
});


router.get('/:postId/comments', isLogged, (req, res) => {
    Post.findById(req.params.postId, 'comments')
        .populate("comments.by", "username dp _id")
        .exec()
        .then(comments => {
            if (comments) {
                res.json({ comments });
            } else {
                res.json({ error: "no comments" });
            }
        })
        .catch(er => console.log(er))
})

router.get('/:postId/likes', isLogged, (req, res) => {
    Post.findById(req.params.postId, 'likes')
        .populate("likes", "username dp _id fullname")
        .exec()
        .then(likes => {
            if (likes) {
                res.json({ likes });
            } else {
                res.json({ error: "no comments" });
            }
        })
        .catch(er => console.log(er))
})


// This route is for Like button functionality..
router.post('/like', isLogged, (req, res) => {
    const { postId } = req.body;
    Post.findById(postId, 'likes')
        .then(post => {
            if (post.likes.find(likeid => likeid.equals(req.user._id))) {
                Post.updateOne({ _id: postId }, { $pull: { likes: req.user._id } }).exec();
            } else {
                Post.updateOne({ _id: postId }, { $push: { likes: req.user._id } }).exec();
            }
        })
        .catch(er => console.log(er))
    res.json({ message: "task completed." })
});


// This route add comment to the selected post..
router.post('/postcomment', isLogged, (req, res) => {
    const { postId, comment } = req.body;
    Post.findById(postId, 'comments')
        .then(post => {
            Post.updateOne({ _id: postId }, { $push: { comments: { by: req.user._id, comment } } })
                .exec()
                .catch(er => console.log(er));
        })
        .catch(er => console.log(er))
    res.json({ message: "task completed." })
});

//This route create new post.
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
        .then(result => {
            User.updateOne({ _id: req.user._id }, { $push: { posts: result._id } }).exec();
            res.json({ post: result, message: "Post created successfully." })
        })
        .catch(err => console.log(err))
})


// This route will provide specific user's all posts
router.get('/myposts', isLogged, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id username")
        .then(myposts => {
            res.json({ myposts })
        })
        .catch(err => console.log(err));
});

router.get('/:postId/delete', isLogged, (req, res) => {
    Post.findByIdAndDelete(req.params.postId)
        .then(result => {
            res.json({ result })
        })
        .catch(err => console.log(err));
});

module.exports = router;