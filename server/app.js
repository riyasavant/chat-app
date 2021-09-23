const express = require('express');
const mongoose = require("mongoose");

const indexRouter = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

module.exports = app;