const express = require('express');
const router = express.Router();
const User = require("../models/user");

// Search user by username
router.get("/:username", async (req, res) => {
    try {
        const userData = await User.findOne({username: req.params.username});
        res.status(200).json(userData);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get("/get/:userId", async (req, res) => {
    // console.log(req.params.userId);
    try {
        const userData = await User.findOne({_id: req.params.userId});
        res.status(200).json(userData);
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get all users
router.get("/", (req, res) => {
    try {
        User.find({}, (err, users) => {
            // console.log(users);
            res.status(200).json(users);
        });
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;