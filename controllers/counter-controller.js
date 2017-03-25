var Election = require('../models/Election');
var administrator = require('./administrator-controller');

// Note that counter never knows who is communicating with it.
var counter = {};

counter.collectBallot = function(req, res, next) {
    var election  = req.body.election;
    var ballot    = req.body.ballot;
    var signature = req.body.signature;


    Election.getElection(election, function(err, e) {
        if (err) return next(err);
        if (!e) return res.status(404);

        // Check that this ballot/signature has not been submitted before
        if (e.ballots && e.ballots.filter(function(b) { return b.adminSignature == signature; }).length > 0)
            return res.status(401).send("SIGNATURE_ALREADY_USED");

        // Check signature of ballot using current election's admin key
        administrator.verifySignature(e._id, ballot, signature, function(err, signatureValid) {
            if (err) return next(err);
            if (!signatureValid) {
                console.log("Signature not valid for given ballot");
                return res.status(401).send("INVALID_SIGNATURE");
            }

            // Check for valid ballot
            if (! verifyBallot(ballot)) return res.send("Invalid ballot");

            // Add ballot to list
            e.addBallot(ballot, signature, function(err) {
                if (err) return next(err);
                res.send("BALLOT_COLLECTED");
            });
        });
    });
};

function verifyBallot(ballot) {
    // TODO: Define what a valid ballot is here.
    return true;
}


counter.endElection = function(electionID) {
    // Stop accepting new ballots for that election
    var election = Election.getElection(electionID, function(err, election) {
        if (err) return next(err);

        election.endElection(function(err) {
            if (err) return next(err);

            // Count the ballots
            var results = election.getResults();
            res.json(results);
        });
    });

};

counter.viewBallots = function(req, res, next) {
    var election = req.params.eid;
    var user     = req.session.user.kerberos;

    Election.getElection(election, function(err, e){
        if (err) return next(err);
        if (!e) return res.status(404).send("ELECTION_NOT_FOUND");

        // Check that election is closed
        if (!e.isClosed()) return res.status(401).send("ELECTION_NOT_CLOSED");

        // Check that user is in election
        if (!e.userInElection(user)) return res.status(401).send("USER_NOT_IN_ELECTION");

        // Send back the ballots
        res.json(e.ballots);
    });
};

module.exports = counter;
