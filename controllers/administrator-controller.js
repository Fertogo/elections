var Election = require('../models/Election');
var rsa = require('node-rsa');


var administrator = {};

var key = new rsa();
key.generateKeyPair(); //TODO load KeyPair from permanent storage

administrator.verifySignature = function(message, signature) {
    return key.verify(message, signature);
};

administrator.signBallot = function(req, res, next) {
    var user = req.user.kerberos;
    var blindBallot = req.body.blindBallot;
    var election = req.body.election;


    Election.getElection(election, function(err, e) {
        if (err) return next(err);

        // Check that user has the right to vote
        if (!e.userCanVote(user)) return res.status(401);

        // Sign ballot
        var signedBallot = key.sign(blindBallot);

        // Save ballot
        e.addBlindBallot(blindBallot, signedBallot, function(err) {
            if (err) return next(err);

            // Send ballot
            res.send(signedBallot);
        })

    });


};


administrator.publishSignatures = function(req, res, next) {
    var user = req.user.kerberos;
    var election = req.body.election;


    Election.getElection(election, function(err, e) {
        if (err) return next(err);

        // check that user is in election
        if (!e.userCanVote(user) && !e.userIsOrganizer(user))
            return res.status(401);

        // send all signatures
        res.json(e.voters); //TODO Privacy issue?
    });


};

module.exports = administrator;
