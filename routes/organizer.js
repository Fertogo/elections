var express = require('express');
var router = express.Router();

var organizer = require('../controllers/organizer-controller')

router.post('/createElection', organizer.createElection);
router.get('/createElection', function(req, res, next){ res.render("create-election", {}) });

router.get('/', organizer.renderHome);
router.post('/endElection', organizer.endElection);

module.exports = router;
