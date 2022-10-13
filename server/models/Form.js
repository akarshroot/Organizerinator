const mongoose = require("mongoose")

const formSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    department: {
        type: Boolean,
        required: true,
        default: false
    },
    email: {
        type: Boolean,
        required: true,
        default: false
    },
    maxTeamSize: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: Boolean,
        required: true,
        default: false
    },
    phnNum: {
        type: Boolean,
        required: true,
        default: false
    },
    teamMembers: {
        type: Boolean,
        required: true,
        default: false
    },
    teamName: {
        type: Boolean,
        required: true,
        default: false
    },
    teamSize: {
        type: Boolean,
        required: true,
        default: false
    },
    tshirtSize: {
        type: Boolean,
        required: true,
        default: false
    },
    universityId: {
        type: Boolean,
        required: true,
        default: false
    },
    year: {
        type: Boolean,
        required: true,
        default: false
    },
    maxTeamSize: {
        type: Number
    }
})

module.exports = mongoose.model("Form", formSchema)