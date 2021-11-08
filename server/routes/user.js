const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const User = require("../models/user");

router.get('/getUsername', verifyToken, (req, res) => {
    res.json({ isLoggedIn: true, username: req.user.username });
});

router.get("/:userId", async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.params.userId});
        res.status(200).json(userData);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;