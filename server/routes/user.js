const { Router } = require("express")
const User = require("../models/User.js")
const bcrypt = require("bcrypt")
const generateTokens = require("../util/generateTokens")
const Org = require("../models/Org.js")
const auth = require("../middleware/auth.js")

const router = Router();


router.post("/details", auth, async (req, res) => {
	try {
		const requestorId = req.body.userId
		const resData = await User.findById({_id: requestorId})		
		if(!resData)
			res.status(404).json({error: true, message: "No such user found."})
		else
			res.status(200).json({error: false, message: "Data request successful.", requestedData: resData})

	} catch (error) {
		console.log(error)
		res.status(500).json({error: true, message: "Internal server error. PLease contact admin immediately."})
	}
})

module.exports = router;