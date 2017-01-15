
var organizer = {};

organizer.createElection = function(req, res, next) {
    var organizer = req.user.kerberos;
    var voters    = req.body.voters;
    // TODO
};


organizer.endElection = function(req, res, next) {
    var organizer  = req.user.kerberos;
    var electionID = req.body.electionID;
    // TODO
};

module.exports = organizer;
