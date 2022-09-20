const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const cookies = require("cookie-parser");
const authRoutes = require("./routes/auth")
const refreshTokenRoutes = require("./routes/refreshToken")
const { config } = require("dotenv");
const mongoose = require("mongoose");
const notificationListener = require("./utils/notificationListener");
// const path = require('path');

const PORT = process.env.PORT || 3001;
config()
const app = express()
// app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json())
app.use(cors())
app.use(cookies())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

const { Server } = require("socket.io");

const io = new Server();

//CONNECT DB
mongoose.connect(process.env.DB, function (err) {
  if (err) console.log({ status: 500, message: "Server Error. Try Again Later.", dev_msg: err.message })
  // console.log("Connected!");
})

// Handle GET/POST requests to /api route
app.use("/api", authRoutes)
// app.use("/api/db", dbRoutes) //depreciated
app.use("/api/refreshToken", refreshTokenRoutes)

notificationListener(io)
io.listen(5000)

app.get("/test", (req, res) => {
  res.send({ message: "Hello from the Organizerinator server!" })
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});