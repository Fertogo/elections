var express = require('express');
var router = express.Router();

var administrator = require('../controllers/administrator-controller')

router.post('/signBallot', administrator.signBallot);

router.get('/', function(req, res, next) {
    console.log("Admin hi");
    res.send("hi from admin");
});

module.exports = router;
