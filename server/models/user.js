const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        required: true,
        type: Number
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;