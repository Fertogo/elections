var Election = require('../models/Election');

var Python = require('python-shell');

var fs = require('fs');



var administrator = {};


function signMessage(id, message, cb) {
    Python.run('sign.py', {args:[id, message]}, cb);
}

administrator.verifySignature = function(id, message, signature, cb) {
    Python.run('verify.py', {args:[id, message, signature]}, function(err, results) {
        cb(err, results[0] == "True")
    });
};

administrator.tempSign = function(message, id, cb) {  //TODO Remove
    signMessage(id, message, function(err, results) {
        console.log(err);
        console.log(results);
        cb(err, results[0])
    });

}

administrator.getPublicKey = function(req, res, next) {
    var election = req.params.eid;
    var user     = req.session.user.kerberos;

    Election.getElection(election, function(err, e){
        if (err) return next(err);
        if (!e) return res.status(404).send("ELECTION_NOT_FOUND");
        if (!e.userInElection(user)) return res.status(401).send("USER_NOT_IN_ELECTION");

        res.header('Content-Disposition', 'attachment; filename="key.pub"');
        fs.readFile('keystore/'+ e._id + ".pub", function(err, data) {
            if (err) return next(err);
            res.send(data);
        });
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
        signMessage(e._id, blindBallot, function(err, signature) {
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
