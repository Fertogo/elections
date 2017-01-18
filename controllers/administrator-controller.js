var Election = require('../models/Election');
var rsa = require('node-rsa');


var administrator = {};

var key = new rsa();
key.generateKeyPair(); //TODO load KeyPair from permanent storage

administrator.verifySignature = function(message, signature) {

    console.log("testing signature verification");
    var m = "Origunal message";

    var sign = key.sign(m, 'hex');
    // console.log("signature: " + sign);

    console.log("Verifying...");

    console.log(key.verify(m, sign, 'utf8', 'hex'));

    console.log("Signatures work");

    console.log("message: " + message);
    console.log("signature: " + signature);
    console.log("correctSignature: " + key.sign(message, "hex"));








    return key.verify(message, signature, 'utf8', 'hex');
};

administrator.signBallot = function(req, res, next) {
    var user = req.session.user.kerberos;
    var blindBallot = req.body.blindBallot;
    var election = req.body.election;


    Election.getElection(election, function(err, e) {
        if (err) return next(err);

        // Check that user has the right to vote
        if (!e.userCanVote(user)) return res.status(401).send("NOT_ALLOWED");

        // Sign ballot
        var signature = key.sign(blindBallot, 'hex');

        // Save ballot
        e.addBlindBallot(user, blindBallot, signature, function(err) {
            if (err) return next(err);

            // Send ballot
            res.send({
                signature : signature,
                result    : "OK"
            });
        })

    });


};


administrator.publishSignatures = function(req, res, next) {
    var user = req.session.user.kerberos;
    var election = req.params.eid;


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
