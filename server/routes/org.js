const { Router } = require("express")
const User = require("../models/User.js")
const bcrypt = require("bcrypt")
const generateTokens = require("../util/generateTokens")
const {
	signUpBodyValidation,
	logInBodyValidation,
	orgSignUpBodyValidation,
} = require("../util/validationSchema")
const Org = require("../models/Org.js")
const auth = require("../middleware/auth.js")

const router = Router();

// signup
router.post("/signup", async (req, res) => {
	try {
		const { error } = orgSignUpBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });

		const user = await Org.findOne({ email: req.body.email });
		if (user)
			return res
				.status(400)
				.json({ error: true, message: "Org with given email already exist" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const userDoc = await new Org({ ...req.body, password: hashPassword }).save();
		res
			.status(201)
			.json({ error: false, message: "Account created sucessfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

// login
router.post("/login", async (req, res) => {
	try {
		const { error } = logInBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });

		const user = await Org.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(401)
				.json({ error: true, message: "Invalid email or password. User with given email not found." });

		const verifiedPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!verifiedPassword)
			return res
				.status(401)
				.json({ error: true, message: "Invalid email or password" });

		const { accessToken, refreshToken } = await generateTokens(user);
		res
			.cookie("refreshToken", refreshToken, {
				maxAge: 604800000,// set desired expiration here
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.cookie("checkToken", true, {
				maxAge: 604800000,// same as above
				secure: true,
				sameSite: "none",
			})

		res.status(200).json({
			error: false,
			accessToken,
			userId: user._id,
			isOrg: true,
			message: "Logged in sucessfully",
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

router.post("/details", auth, async (req, res) => {
	try {
		const requestorId = req.body.userId
		const resData = await Org.findById({ _id: requestorId })
		if (!resData)
			res.status(404).json({ error: true, message: "No such organization found." })
		else {
			resData.password = undefined
			res.status(200).json({ error: false, message: "Data request successful.", requestedData: resData })
		}

	} catch (error) {
		console.log(error)
		res.status(500).json({ error: true, message: "Internal server error. PLease contact admin immediately." })
	}
})

module.exports = router;