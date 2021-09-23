require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use('/api/auth', authRouter);

module.exports = app;