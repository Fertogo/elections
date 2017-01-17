var mongoose = require('mongoose');


var electionSchema = mongoose.Schema({
    organizer : {type: String, required: true}, //Kerberos of the election official.
    stage : {type: String, enum:["pending", "running", "ended"]},
    voters   : [{
        kerberos      : {type: String, required: true},
        blindBallot   : {type: String}
    }],
    ballots  : [{
        ballot          : {type: String},
        adminSignature  : {type: String, required: true}
    }]
});

electionSchema.methods.userInElection = function(user) {
    return (this.voters.filter(function(v) {
        return (v.kerberos == user)
    }).length > 0) || (user == this.organizer);
};

electionSchema.methods.userCanVote = function(user) {
    if (this.stage != "running") return false;

    return (this.voters.filter(function(v) {
        if (v.blindBallot) return false; // user already voted
        return (v.kerberos == user)
    }).length > 0);
};

electionSchema.methods.userIsOrganizer = function(user) {
    return this.organizer == user;
};

electionSchema.methods.addBlindBallot = function(user, blindBallot) {
    var voter = this.voters.filter(function(v) {
        return v.kerberos == user;
    });

    voter.blindBallot = blindBallot;

    this.save(cb);
}

electionSchema.methods.addBallot = function(ballot, signature, cb) {
    if (this.stage != "running") return cb("ELECTION_CLOSED");

    this.ballots.push({ballot:ballot, adminSignature:signature});
    this.save(cb);
};

electionSchema.methods.getBallot = function(signature) {
    return this.ballots.filter(function(b) {
        return b.adminSignature == signature;
    });
};

electionSchema.methods.getResults = function() {
    // TODO

    return this.ballots;
};

electionSchema.methods.startElection = function(cb) {
    this.stage = "running";
    this.save(cb);
};

electionSchema.methods.endElection = function(cb) {
    this.stage = "ended";
    this.save(cb);
};

electionSchema.methods.isClosed = function() {
    return this.stage == "ended";
}

///// Statics /////

electionSchema.statics.getElection = function(election, cb) {
    electionSchema.findOne({_id:election}, cb);
};

electionSchema.statics.createElection = function(organizer, voters, cb) {
    mongoose.model('Election').create({
        organizer : organizer,
        voters    : voters,
        stage     : "pending"
    }, cb);
};

module.exports = mongoose.model('Election', electionSchema)
