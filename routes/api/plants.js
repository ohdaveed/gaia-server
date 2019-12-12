const express = require("express");
const router = express.Router();
const { encode, decode } = require("url-encode-decode");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../../models/User");
const keys = require("../../config/keys");
const Photo = require("../../models/Photo");
const Plant = require("../../models/Plant");

const passport = require("passport");

router.get("/", passport.authenticate("jwt", { session: false }), function(
    req,
    res
) {
    res.send("photo route testing!");
});

module.exports = router;
