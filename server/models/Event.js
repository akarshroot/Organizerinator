const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    adminEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    eventDescription: String,
    eventDate: Date,
    eventDuration: Number,
    participantList: {
        type: mongoose.Schema.Types.ObjectId
    },
    orgTeam: [
        {
            orgMemberId: mongoose.Schema.Types.ObjectId,
            _id: false
        }
    ],
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

module.exports = mongoose.model("Event", eventSchema)