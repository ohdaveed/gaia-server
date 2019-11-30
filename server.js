const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
require("./db/db.js");

app.get("/", (req, res) => res.send("Hello world!"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
