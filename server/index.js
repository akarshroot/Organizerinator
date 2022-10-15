const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const cookies = require("cookie-parser");
const orgRoutes = require("./routes/org")
const userRoutes = require("./routes/user")
const eventRoutes = require("./routes/event")
const sheetRoutes = require("./routes/sheets")
const refreshTokenRoutes = require("./routes/refreshToken")
const { config } = require("dotenv");
const mongoose = require("mongoose");
const path = require("path")
// const path = require('path');

const PORT = process.env.PORT || 3001;
config()
const app = express()
// app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json())
app.use(cors())
app.use(cookies())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use(express.static(path.join(__dirname, "/public")))
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
})
//CONNECT DB
mongoose.connect(process.env.DB, async function (err) {
  if (err) console.log({ status: 500, message: "Server Error. Try Again Later.", dev_msg: err.message })
  console.log("Connected!");
})

// Handle GET/POST requests to /api route
app.use("/api/org/", orgRoutes)
app.use("/api/user/", userRoutes)
app.use("/api/event/", eventRoutes)
app.use("/api/sheet/", sheetRoutes)
// app.use("/api/db", dbRoutes) //depreciated
app.use("/api/refreshToken", refreshTokenRoutes)

app.get("/test", (req, res) => {
  res.send({ message: "Hello from the Organizerinator server!" })
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});