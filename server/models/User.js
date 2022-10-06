const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    // userID: String,
    firstName: String,
    lastName: String,
    email: {
        required: true,
        type: String,
        lowercase: true
    },
    password: String,
    universityId: {
        required: true,
        type: Number
    },
    isOrg: {
        type: Boolean,
        default: false,
        immutable: true
    },
    profileComplete: Boolean,
    participationHistory: [
        {
            eventId: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("User", userSchema)