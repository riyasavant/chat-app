const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

router.get('/getUsername', verifyToken, (req, res) => {
    res.json({ isLoggedIn: true, username: req.user.username });
});

module.exports = router;