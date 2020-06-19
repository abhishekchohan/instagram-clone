const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const isLogged = require('../middlewares/isLogged');

router.get('/user/:username', isLogged, (req, res) => {
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

module.exports = router;