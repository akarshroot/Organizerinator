const mongoose = require("mongoose")

const orgSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: String,
    eventHistory: [
        {
            eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event'
            },
            _id: false            
        }
    ],
    orgAdminTeam: [
        {
            orgMemberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            _id: false
        }
    ],
    isOrg: {
        type: Boolean,
        default: true,
        immutable: true
    },
    currentEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        _id: false,
        default: undefined
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

module.exports = mongoose.model("Org", orgSchema)