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
        req.body.eventId = formSnapshot.eventId
        const finalParticipantData = sanitizeParticipantData(req.body)
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

module.exports = router;