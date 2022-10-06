const { Router } = require("express")
const Org = require("../models/Org.js")
const auth = require("../middleware/auth.js")

const router = Router();

router.post("/create", auth, async (req, res) => {
    
})

module.exports = router;