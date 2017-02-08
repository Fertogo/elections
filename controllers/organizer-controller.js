var Election = require('../models/Election');

var organizer = {};

organizer.createElection = function(req, res, next) {
    var organizer = req.session.user.kerberos;
    var voters    = req.body.voters.split(',');

    console.log("Creating election with: " + voters);

    Election.createElection(organizer, voters, function(err, e) {
        if (err) return next(err);

        e.startElection(function(err) {
            if (err) return next(err);

            res.redirect("/organizer");
        })
    })
};


organizer.endElection = function(req, res, next) {
    var organizer  = req.session.user.kerberos;
    var electionID = req.body.electionID;

    console.log("ending election: " + electionID);

    Election.getElection(electionID, function(err, e) {
        if (err) return next(err);
        if (!e) return res.status(404).send("ELECTION_NOT_FOUND");

        // Check that user is organizer
        if (!e.userIsOrganizer(organizer)) return res.status(401).send("NOT_AN_ORGANIZER");

        // End the election
        e.endElection(function(err){
            if (err) return next(err);
            res.send("ELECTION_ENDED");
        });
    });


};

organizer.renderHome = function(req, res, next) {
    var organizer = req.session.user.kerberos;

    Election.find({organizer: organizer }, function(err, elections) {
        res.render('organizer-home', {user: req.session.user, elections:elections});
    });
};

module.exports = organizer;
