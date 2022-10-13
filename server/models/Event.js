const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    adminEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    registrationPath: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form'
    },
    eventTitle: String,
    eventDescription: String,
    eventStartDate: Date,
    eventDuration: Number,
    totalRegistrations: {
        type: Number,
        default: 0,
        required: true
    },
    totalTeams: {
        type: Number,
        default: 0
    },
    attending: {
        type: Number,
        default: 0,
        required: true
    },
    participantList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            _id: false
        }
    ],
    orgTeam: [
        {
            orgMemberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
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