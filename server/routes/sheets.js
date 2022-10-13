const { Router } = require("express");
const auth = require("../middleware/auth");
const Participant = require("../models/Participant");

const router = Router();

router.post("/attendance/view", auth, async (req, res) => {
    try {
        const eventId = req.body.eventId
        const registeredTeams = await Participant.find({eventId: eventId})
        if(registeredTeams)
            res.status(200).json({error: false, requestedData: registeredTeams})
        else
            throw new Error("No registered teams found OR invalid event id.")
    } catch (error) {
        console.log(error);
        res.status(404).json({error: true, message: error.message})
    }
});

module.exports = router;