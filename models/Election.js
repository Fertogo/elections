var mongoose = require('mongoose');


var electionSchema = mongoose.Schema({
    organizer : {type: String, required: true}, //Kerberos of the election official.
    stage : {type: String, enum:["pending", "running", "ended"]},
    voters   : [{
        kerberos      : {type: String, required: true},
        blindBallot   : {
            blindBallot     : {type: String},
            adminSignature  : {type: String}
        }
    }],
    ballots  : [{
        ballot          : {type: String},
        adminSignature  : {type: String}
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
        if (v.blindBallot.blindBallot) return false; // user already voted
        return (v.kerberos == user)
    }).length > 0);
};

electionSchema.methods.userIsOrganizer = function(user) {
    return this.organizer == user;
};

electionSchema.methods.addBlindBallot = function(user, blindBallot, signature, cb) {
    var voter = this.voters.filter(function(v) {
        return v.kerberos == user;
    });

    var index = 0;
    console.log(this.voters);
    console.log(user);

    while(this.voters[index].kerberos != user){
        index++;
        if (index >= this.voters.length) {
            console.log("User can't vote"); // Code should check for this earlier but just in case
            cb("NOT_REGISTERED");
            break;
        }
    }

    this.voters[index].blindBallot = {
        blindBallot : blindBallot,
        adminSignature : signature
    };

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
    mongoose.model('Election').findOne({_id:election}, cb);
};

electionSchema.statics.createElection = function(organizer, rawVoters, cb) {
    var voters = rawVoters.map(function(v) {
        return {
            kerberos : v,
        };
    });

    console.log(voters);
    console.log(organizer);

    mongoose.model('Election').create({
        organizer : organizer,
        voters    : voters,
        stage     : "pending",
        ballots   : []
    }, cb);
};

module.exports = mongoose.model('Election', electionSchema)
