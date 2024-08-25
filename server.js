require("dotenv").config();
const fileUpload = require("express-fileupload");

const express = require("express")
const app = express();
// const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const photos = require("./routes/api/photos");
const plants = require("./routes/api/plants");
require("./config/passport")(passport);



app.use(cors({ origin: process.env.REACT_APP, credentials: true, optionsSuccessStatus: 200 }))

app.use(
    fileUpload({
      useTempFiles: true
    })
);
// BodyParser
// app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// DB Config
require("./db/db.js");

// Passport middleware
app.use(passport.initialize());
// Passport config

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
