require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose")
const bodyParser = require("body-parser");

const session = require("express-session");
const methodOverride = require("method-override");
const cors = require("cors");

const passport = require("passport");
const users = require("./routes/api/users");

//DB Config
require("./db/db.js");

// Connect to MongoDB


app.use(
	cors({
		origin: process.env.REACT_APP_API_URL,
		credentials: true,
		optionsSuccessStatus: 200
	})
);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);

//BodyParser
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// const usersController = require("./controllers/users");
// app.use("/users", usersController);

// const photosController = require("./controllers/photos");
// app.use("/photos", photosController);

// const plantsController = require("./controllers/plants");
// app.use("/plants", plantsController);

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

const port = process.env.PORT;
 // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));