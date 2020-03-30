require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const photos = require("./routes/api/photos");
const plants = require("./routes/api/plants");

//DB Config
require("./db/db.js");

// Connect to MongoDB
let whitelist = ['http://localhost:8000', 'http://localhost:3000', 'https://gaiadb.herokuapp.com']

app.use(cors({
  origin: function(origin, callback){

    if(!origin) return callback(null, true);

    if(whitelist.indexOf(origin) === -1){
      let message = 'shant pass'
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

//BodyParser
// app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/photos", photos);
app.use("/api/plants", plants);
app.get("/", (req, res) => {
  res.send("Gaia backend");
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
