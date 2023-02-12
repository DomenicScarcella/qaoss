'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet'); //application security
const cors = require('cors');
const validator = require('express-validator');
const localtunnel = require('localtunnel');

var app = express();

var index = require('./routes/index');
var peers = require('./routes/peers');
var post = require('./routes/post');
var config = require('./config/config.json');
var comments = require('./routes/comments');
var likes = require('./routes/likes');
var profile = require('./routes/profile');
var share = require('./routes/share');
var feed = require('./routes/feed');
var messages = require('./routes/messages');

const ngrok = require('ngrok');
const fs = require('fs').promises;
const domain = "https://qaoss.eu.ngrok.io";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());

app.use(compression()); //Compress all routes
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'archives')))

app.use('/', index);
app.use('/peers', peers);
app.use('/post', post);
app.use('/comments', comments);
app.use('/likes', likes);
app.use('/profile', profile);
app.use('/share', share);
app.use('/feed', feed);
app.use('/messages', messages);

app.use(session({
    secret: "k5Zurj4",
    cookie: {
        httpOnly: true,
        secure: true
    },
    resave: false,
    saveUninitialized: true
})
)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

(async function () {

    const tunnel = await localtunnel(config.port, { domain: domain, subdomain: config.subdomain });

    app.listen(config.port, () => console.log(tunnel.url + ` listening to port ${config.port}`));

    console.log('Liberty and Dignity');

})();





//const publicEndpoint = await ngrok.connect({ port: config.port, subdomain: config.subdomain, inspect: false });
//console.log(publicEndpoint);

//verify integrity of the index at start up
//check that all content in the index exists, if not then delete from index
//check if all content is in the index, if not then add it.

//})();

