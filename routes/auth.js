const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const isLogged = require('../middlewares/isLogged');

router.post('/user/:username', isLogged, (req, res) => {
    User.findOne({ username: req.params.username })
        .populate("posts", "url _id")
        .exec()
        .then((foundUser) => {
            if (!foundUser) {
                return res.status(422).json({ error: "Invalid Username" })
            } else {
                foundUser.password = undefined;
                res.json({ user: foundUser })
            }
        })
        .catch(er => console.log(er))
});

router.post('/updateUser', isLogged, (req, res) => {
    const { username, email, fullname } = req.body.data;
    if (!email || !username || !fullname) {
        return res.status(422).json({ error: "PLease enter all fields." })
    }
    User.updateOne({ _id: req.body.id }, { username, email, fullname }).exec()
        .then((result) => {
            if (!result) {
                return res.status(422).json({ error: "Invalid Username" })
            } else {
                User.findById({ _id: req.body.id })
                    .populate("posts", "url _id")
                    .exec()
                    .then(foundUser => {
                        if (foundUser) {
                            foundUser.password = undefined;
                            res.json({ user: foundUser })
                        }
                    })
                    .catch(er => console.log(er))
            }
        })
        .catch(er => console.log(er))
});


router.post('/updateProfilePhoto', isLogged, (req, res) => {
    User.findOne({ username: req.body.username })
        .then((foundUser) => {
            if (!foundUser) {
                return res.status(422).json({ error: "Invalid Username" })
            } else {
                User.updateOne({ username: req.body.username }, { dp: req.body.dp }).exec();
            }
        })
        .catch(er => console.log(er));

    res.json({ message: "task completed." });
});

router.post('/user/:username/follow', isLogged, (req, res) => {
    User.findOne({ username: req.params.username })
        .then((foundUser) => {
            if (!foundUser) {
                return res.status(422).json({ error: "Invalid Username" })
            } else {
                if (foundUser.followers.find(followerId => followerId.equals(req.user._id))) {
                    User.updateOne({ username: req.params.username }, { $pull: { followers: req.user._id } }).exec();
                    User.updateOne({ username: req.user.username }, { $pull: { following: foundUser._id } }).exec();
                } else {
                    User.updateOne({ username: req.params.username }, { $push: { followers: req.user._id } }).exec();
                    User.updateOne({ username: req.user.username }, { $push: { following: foundUser._id } }).exec();
                }
            }
        })
        .catch(er => console.log(er));
    res.json({ message: "task completed." });
});

router.post('/signup', (req, res) => {
    const { username, email, password, fullname } = req.body;
    if (!email || !username || !password || !fullname) {
        return res.status(422).json({ error: "PLease enter all fields." })
    }
    User.findOne({ email: email })
        .then((foundUser) => {
            if (foundUser) {
                return res.status(422).json({ error: "User already existed.<br>If it belongs to you then Try Login instead." })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        username,
                        fullname
                    })
                    user.save()
                        .then(user => {
                            res.status(200).json({ message: "Successfully Signed Up.<br>Please Login now." })
                        })
                        .catch(err => console.log(err));
                })

        })
        .catch(err => console.log(err))
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter all fields." })
    }
    User.findOne({ email: email })
        .populate("posts", "url _id")
        .exec()
        .then(foundUser => {
            if (!foundUser) {
                return res.status(422).json({ error: "Invalid email or password." })
            }
            bcrypt.compare(password, foundUser.password)
                .then(doMatched => {
                    if (doMatched) {
                        const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET);
                        res.json({ token, message: "Successfully signed in.", user: foundUser });
                    } else {
                        return res.status(422).json({ error: "Invalid email or password." })
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.get('/followersOrFollowings/:userId/:task', isLogged, (req, res) => {
    User.findById(req.params.userId, req.params.task)
        .populate(req.params.task, "username dp _id fullname followers")
        .exec()
        .then(task => {
            if (task) {
                res.json({ [req.params.task]: task });
            } else {
                res.json({ error: "no comments" });
            }
        })
        .catch(er => console.log(er))
})

module.exports = router;