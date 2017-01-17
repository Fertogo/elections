var Election = require('../models/Election');

var organizer = {};

organizer.createElection = function(req, res, next) {
    var organizer = req.user.kerberos;
    var voters    = req.body.voters;

    Election.createElection(organizer, voters, function(err, e) {
        if (err) return next(err);

        e.startElection(function(err) {
            if (err) return next(err);

            res.json({
                "result" : "ELECTION_CREATED",
                "electionID" : e.__id;
            });
        })
    })
};


organizer.endElection = function(req, res, next) {
    var organizer  = req.user.kerberos;
    var electionID = req.body.electionID;

    Election.getElection(electionID, function(err, e) {
        if (err) return next(err);
        if (!e) return res.status(404);

        // Check that user is organizer
        if (!e.userIsOrganizer(organizer)) res.status(401);

        // End the election
        e.endElection(function(err){
            if (err) return next(err);
            res.send("ELECTION_ENDED");
        });
    });


};

module.exports = organizer;
