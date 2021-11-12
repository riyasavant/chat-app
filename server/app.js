require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const conversationRouter = require('./routes/conversation');
const messageRouter = require('./routes/message');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
    console.log('Database connection successful');
} catch(err) {
    console.log(err);
}


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

module.exports = app;