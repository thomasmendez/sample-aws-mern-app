var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var cors = require('cors');

// get env variables 
require('dotenv').config();

// create a passport instance
let passport = require('passport');
let session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('./passport_setup')(passport);

var app = express();

var mongoose = require('mongoose');
mongoose.connect(process.env.NODE_MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// don't need these if 
// we want to return differnt status
// codes other than 200 
// "preflightContinue": true,
// "optionsSuccessStatus": 204,
// "origin": "http://localhost:3000",

var corsOptions;

if (process.env.ENV === 'development') {

    corsOptions = {
        "origin": process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + ":" + process.env.REACT_APP_PORT,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "credentials": true
    }

} else if (process.env.ENV === 'staging' || process.env.ENV === 'production'){

    corsOptions = {
        "origin": process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "credentials": true
    }

} else {
    throw new Error("Please set ENV='development', 'staging', or 'produciton' in .env to setup the correct CORS options")
}


app.use(cors(corsOptions));

const BUILD_PATH = path.join(__dirname, '../..', 'build')
app.use(express.static(BUILD_PATH, {index: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.NODE_COOKIE_SECRET));

// for session
app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Put true if https
}))

app.use(passport.initialize());
app.use(passport.session());

// authenticate user before continuing
const authCheck = (req, res, next) => {
    if (req.user !== undefined) {
        // if logged in
        next();
    } else {
        // if not logged in
        res.status(401).send({
            message: 'Unauthorized'
        });
    }
}

app.use('/', indexRouter);
app.use('/users', authCheck, usersRouter);

module.exports = app;