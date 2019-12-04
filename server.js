require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");

//DB Config
require("./db/db.js");

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

app.get("/", (req, res) => res.send("Hello world!"));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
