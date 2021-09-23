const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  const user = req.body;

  // Check if username already exists
  const oldUser = await User.findOne({ username: user.username });

  if(oldUser) {
    res.json({message: "Username has already been taken"});
  } else {

    // 10 Salt rounds
    user.password = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: user.username,
      password: user.password
    });

    newUser.save();
    res.json({message: "Registered successfully"});
  }
});

module.exports = router;