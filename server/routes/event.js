const { Router } = require("express")
const Org = require("../models/Org.js")
const auth = require("../middleware/auth.js");
const Event = require("../models/Event.js");
const Form = require("../models/Form.js");
const { sanitizeParticipantData } = require("../util/eventFunctions.js");
const Participant = require("../models/Participant.js");

const router = Router();

router.post("/create", auth, async (req, res) => {
    try {
        const orgId = req.body.orgId
        const orgData = await Org.findById({ _id: orgId })
        const eventData = {
            ...req.body,
            orgId: orgId,
            adminEmail: orgData.email,
        }
        const eventDoc = await new Event(eventData).save()
        const updatedOrgData = await Org.findByIdAndUpdate({ _id: orgId }, { currentEvent: eventDoc._id, $push: { eventHistory: { eventId: eventDoc._id } } })
        if (updatedOrgData)
            res.status(201).json({ error: false, message: "Event created sucessfully" });
        else
            throw new Error("Could not update org data.")
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });

    }
})

router.post("/generateForm", auth, async (req, res) => {
    try {
        const eventId = req.body.eventId
        const formData = {
            ...req.body,
            orgId: undefined
        }

        const regForm = await new Form(formData).save()

        const eventDoc = await Event.findByIdAndUpdate({ _id: eventId }, { registrationPath: regForm._id })

        if (eventDoc)
            res.status(201).json({ error: false, message: "Registration form created sucessfully" });
        else
            throw new Error("Could not create registration form.")
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });

    }
})

router.post("/form", async (req, res) => {
    try {
        const formId = req.body.formId

        const formDoc = await Form.findById({ _id: formId }).populate({ path: 'eventId' })
        if (formDoc) {
            const resData = {
                eventTitle: formDoc.eventId.eventTitle,
                eventDescription: formDoc.eventId.eventDescription,
                eventStartDate: formDoc.eventId.eventStartDate,
                eventDuration: formDoc.eventId.eventDuration
            }
            formDoc.eventId = undefined
            resData.formData = formDoc
            res.status(201).json({ error: false, message: "Form data fetched sucessfully", requestedData: resData });
        }
        else throw new Error("Blank Form?")

    } catch (err) {
        console.log(err.message);
        res.status(404).json({ error: true, message: "Form not found." });

    }
})

router.post("/participant/register", async (req, res) => {
    try {
        const formSnapshot = await Form.findById({ _id: req.body.formId })
        const preRegisterSnapshot = await Event.findById({ _id: formSnapshot.eventId })
        req.body.eventId = formSnapshot.eventId
        const finalParticipantData = sanitizeParticipantData(req.body, preRegisterSnapshot.totalRegistrations)
        const registeredParticipantDoc = await new Participant(finalParticipantData).save()
        if (registeredParticipantDoc) {
            const updateEventRegistrations = await Event.findByIdAndUpdate({ _id: formSnapshot.eventId }, { $inc: { totalRegistrations: 1 } })
            if (updateEventRegistrations)
                res.status(201).json({ error: false, message: "Registration Successful" })
            else throw new Error("Could not increment registrations.")
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})

router.post("/participant/details", auth, async (req, res) => {
    try {
        const teamNumber = parseInt(req.body.teamNumber)
        const eventId = req.body.eventId
        const teamDetails = await Participant.findOne({ eventId: eventId, teamNumber: teamNumber })
        if (!teamDetails) res.status(404).json({ error: true, message: "Participant not found." })
        else res.status(200).json({ error: false, requestedData: teamDetails })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})

router.post("/participant/attending", auth, async (req, res) => {
    try {
        const teamId = req.body.teamId
        const preCheck = await Participant.findById({ _id: teamId })
        if (!preCheck) res.status(404).json({ error: true, message: "Participant not found." })
        else if (preCheck.attending == true) res.status(400).json({ error: true, message: "Already marked present." })
        else {
            const teamDetails = await Participant.findByIdAndUpdate({ _id: teamId }, { attending: true })
            const eventDetailsUpdated = await Event.findByIdAndUpdate({ _id: teamDetails.eventId }, { $inc: { attending: 1 } })
            const eventData = await Event.findById({ _id: teamDetails.eventId })
            const teamDetailsUpdated = await Participant.findByIdAndUpdate({ _id: teamId }, { allottedTable: eventData.attending })
            res.status(201).json({ error: false, message: "Successfully Marked Present", requestedData: { allottedTable: eventData.attending } })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})

module.exports = router;