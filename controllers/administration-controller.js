
var administrator = {};

administrator.signBallot = function(req, res, next) {
    var user = req.user.kerberos;
    var blindBallot = req.body.blindBallot;

    //TODO

    // Check that user has the right to vote

    // Sign ballot

    // Save ballot

    // Send ballot

};


administrator.publishSignatures = function(req, res, next) {
    var user = req.user.kerberos;

    // TODO

    // check that user is in election

    // send all signatures
};

module.exports = administrator;
