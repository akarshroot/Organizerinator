const mongoose = require("mongoose")

const participantSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    teamSize: Number,
    teamMembers: [
        {
            name: String,
            universityId: String,
            tshirtSize: String,
            email: String,
            phnNum: String,
            batch: Number,
            department: String
        }
    ],
    allottedVenue: String,
    allottedTable: Number,
    attending: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    }
})

module.exports = mongoose.model("Participant", participantSchema)