require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const cors = require("cors");

//DB Config
require("./db/db.js");

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
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

const usersController = require("./controllers/users");
app.use("/users", usersController);

const photosController = require("./controllers/photos");
app.use("/photos", photosController);

const plantsController = require("./controllers/plants");
app.use("/plants", plantsController);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
