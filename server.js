require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const methodOverride = require("method-override");

//DB Config
require("./db/db.js");

//BodyParser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const usersController = require("./controllers/users");
app.use("/users", usersController);

const photosController = require("./controllers/photos");
app.use("/photos", photosController);

const plantsController = require("./controllers/plants");
app.use("/plants", plantsController);

app.get("/", (req, res) => res.send("Hello world!"));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
