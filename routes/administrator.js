var express = require('express');
var router = express.Router();

var administrator = require('../controllers/administrator-controller')

router.get ('/signBallot', function(req, res, next) { res.render('administrator-sign', {user:req.session.user}); });
router.post('/signBallot', administrator.signBallot);

router.get('/signatures/:eid', administrator.publishSignatures);
router.get('/publicKey/:eid', administrator.getPublicKey);

router.get('/', function(req, res, next) {
    console.log("Admin hi");
    res.send("hi from admin");
});

module.exports = router;
