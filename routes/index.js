var express = require('express');
var router  = express.Router();

var crypto  = require('crypto');
var rsa     = require('node-rsa');
var auth    = require('../mit-cert-auth/auth.js')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect("/organizer");
});

router.get('/login', auth.login);

module.exports = router;
