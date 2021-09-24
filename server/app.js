require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

module.exports = app;