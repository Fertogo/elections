
var counter = {};

counter.collectBallot = function(req, res, next) {
    var election = req.body.election;
    var ballot = req.body.ballot;
    var signature = req.body.signature;

    // TODO

    // Check signature of ballot using current election's admin key

    // Check for valid ballot

    // Add ballot to list
};


counter.endElection = function(electionID) {

    // TODO

    // Stop accepting new ballots for that election

    // Count the ballots



};

counter.viewBallots = function(req, res, next) {
    var election = req.body.election;
    var user = req.user.kerberos;

    //TODO

    // Check that election is closed

    // Check that user is in election

    // Send back the ballots

}

module.exports = counter;
