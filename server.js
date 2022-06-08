require("dotenv").config();

const express = require("express");
const app = express();

// const helmet = require('helmet');
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const photos = require("./routes/api/photos");
const plants = require("./routes/api/plants");

// Connect to MongoDB
// app.use(helmet());

app.use(cors({ origin: ["http://localhost:3000"] }));
// BodyParser
// app.use(methodOverride("_method"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// DB Config
require("./db/db.js");

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/photos", photos);
app.use("/api/plants", plants);
app.get("/", (req, res) => {
  const name = req.query.name || "World";
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});
