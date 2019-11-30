const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

require("./db/db.js");

app.get("/", (req, res) => res.send("Hello world!"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
