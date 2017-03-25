var express  = require('express');
var router   = express.Router();
var fs       = require('fs');

var Election = require('../models/Election');
var admin    = require('../controllers/administrator-controller');


/* GET home page. */
router.get('/:eid', function(req, res, next) {
    var election = req.params.eid;
    var user     = req.session.user.kerberos

    Election.getElection(election, function(err, e) {
        if (err) return next(err);
        if (!e) return res.status(404).send("ELECTION_NOT_FOUND");

        if (!e.userInElection(user)) return res.status(401).send("NOT_ALLOWED");

        var data = {};

        data.stage = e.stage;
        data.organizer = e.organizer;

        fs.readFile('keystore/'+ e._id + ".pub", function(err, key) {
            if (err) return next(err);
            data.adminKey = key.toString();
            data.voters = e.voters
            data.id = e._id;

            res.render('election', {election:data});
        });
    });
});

module.exports = router;
