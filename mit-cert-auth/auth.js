// Module exports taken from example-app.js
auth = {};

// packages
var app = require('express')();
var randomstring = require('randomstring');
var sha256 = require('sha256');
// var cookieSession = require('cookie-session');

// import config file
var config = require('./config');
config.scriptsPath = config.scriptsPath.replace(/^\/|\/$/g, '').replace(/^[^\/]/g, '/$&'); // enforce "/p1/p2" slash format

// // enable cookie sessions (to be able to store key in req.session)
// app.use(cookieSession({secret: config.cookieSecret}))

//generate random key and return login link
auth.getLoginUrl = function(req) {
    // generate random key and redirect url
    var authUrl = 'https://' + config.scriptsUsername + '.scripts.mit.edu:444' + config.scriptsPath + '/auth.php';
    var key = randomstring.generate(10);
    var linkUrl = authUrl + '?key=' + key;

    // if (!req.session) req.session = {};
    // store key in session
    req.session.key = key;

    return linkUrl;
}

auth.login = function(req, res, next) {
    // get query params
    var email = req.query.email;
    var token = req.query.token;
    var name = req.query.name;

    // compute token
    var key = req.session.key;
    var secret = config.authSecret;
    var correctToken = sha256(email + key + secret);

    // check token
    if (token === correctToken) {
        console.log(name + " Authenticated");
        req.session.user = {
            email : email,
            token : token,
            name  : name,
            kerberos : email.split("@mit.edu")[0]
        }
        // next();
        res.redirect('/');
    } else {
        res.send(401);
    }
}

auth.authenticate = function(req, res, next) {
    console.log(req.session.user);

    if (req.session && req.session.user) return next();
    res.redirect(auth.getLoginUrl(req));
}

module.exports = auth;
