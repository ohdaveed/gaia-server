const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");

router.get("/test", (req, res) => res.send("plant route testing!"));

module.exports = router;
