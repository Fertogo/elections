var Election = require('../models/Election');
// var rsa = require('node-rsa');

var Python = require('python-shell');



var administrator = {};

// var key = new rsa();
// key.generateKeyPair(); //TODO load KeyPair from permanent storage

// console.log(key.exportKey('public'))
// console.log(key.exportKey('private'))

function signMessage(message, cb) {
    Python.run('sign.py', {args:[message]}, cb);
}

administrator.verifySignature = function(message, signature, cb) {
    Python.run('verify.py', {args:[message, signature]}, function(err, results) {
        cb(err, results[0] == "True")
    });
};

administrator.tempSign = function(message, cb) {  //TODO Remove
    signMessage(message, function(err, results) {
        console.log(err);
        console.log(results);
        cb(err, results[0])
    });

}

administrator.signBallot = function(req, res, next) {
    var user = req.session.user.kerberos;
    var blindBallot = req.body.blindBallot;
    var election = req.body.election;


    Election.getElection(election, function(err, e) {
        if (err) return next(err);

        // Check that user has the right to vote
        if (!e.userCanVote(user)) return res.status(401).send("NOT_ALLOWED");

        // Sign ballot
        signMessage(blindBallot, function(err, signature) {
            signature = signature[0]
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
