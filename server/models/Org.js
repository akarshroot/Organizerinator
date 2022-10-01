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
            eventId: mongoose.Schema.Types.ObjectId,
            _id: false            
        }
    ],
    orgAdminTeam: [
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

module.exports = mongoose.model("Org", orgSchema)