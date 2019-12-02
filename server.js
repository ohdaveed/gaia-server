require("dotenv").config();

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const methodOverride = require("method-override");

//DB Config
require("./db/db.js");

app.use(
	fileUpload({
		createParentPath: true
	})
);

//BodyParser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const usersController = require("./controllers/users");
app.use("/users", usersController);

const photosController = require("./controllers/photos");
app.use("/photos", photosController);

app.get("/", (req, res) => res.send("Hello world!"));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
