var express = require('express');
var router = express.Router();

var counter = require('../controllers/counter-controller')
var auth = require('../mit-cert-auth/auth.js').authenticate;


router.get ('/collect', function(req, res, next) { res.render('counter-collect', {}); });
router.post('/collect', counter.collectBallot);

router.get('/results/:eid', auth,  counter.viewBallots);

router.post('/tempSign', counter.tempSign)

module.exports = router;
