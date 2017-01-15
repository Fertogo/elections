var mongoose = require('mongoose');


var electionSchema = mongoose.Schema({
    organizer : {type: String, required: true}, //Kerberos of the election official.
    stage : {type: String, enum:["pending", "running", "ended"]},
    voters   : [{
        kerberos      : {type: String, required: true},
        blindBallot   : {type: String}
    }],
    ballots  : [{
        ballot          : {type: String, required: true},
        adminSignature  : {type: String, required: true}
    }]
});

module.exports = mongoose.model('Election', electionSchema)
