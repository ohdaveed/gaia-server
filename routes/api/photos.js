const express = require("express");
const router = express.Router();
const Photo = require("../../models/Photo");
const axios = require("axios");
const User = require("../../models/User");
const fs = require("fs");
const Datauri = require("datauri");
const datauri = new Datauri();

const passport = require("passport");

// MULTER
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

// gets all photos from a user
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = { username: req.user.username };

    Photo.find()
      .where(user)
      .then(photos => res.json(photos))
      .catch(err => res.status(404).json({ nophotosfound: "No photos found" }));
  }
);

router.get("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  res.send("photo route testing!");
});

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    upload(req, res, function(err) {
      if (err) {
        return res.send(err);
      }

      // console.log(req.file);

      const cloudinary = require("cloudinary").v2;

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
      });

      const geourl =
        "https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.GEO_API;

      let long, lat;
      let location = axios.get(geourl).then(function(response) {
        lat = parseFloat(response.data.latitude);
        long = parseFloat(response.data.longitude);
      });

      // console.log(typeof req.file.buffer);

      // console.log(buffer);
      const uniqueFilename = req.file.originalname;

      datauri.format(".png", req.file.buffer);

      const path = datauri.content;

      let dbimage;
      let imgurl;
      let id;
      let user;
      let name;

      cloudinary.uploader.upload(
        path,
        {
          public_id: `gaia/${uniqueFilename}`,
          tags: `gaia, ${req.user.id}`
        },
        function(err, result) {
          if (err) return res.send(err);

          // console.log(result);

          const dbimage = {
            url: result.url,
            tags: result.tags,
            lat: lat,
            long: long,
            user: req.user.username,
            id: result.public_id
          };

          imgurl = result.url;
          
          User.findById(req.user.id).then(user => {
            user.url.push(dbimage.url);
            user.save().then(console.log(dbimage));
          });

          Photo.create(dbimage).then(photo => {
            User.findById(req.user.id).then(user => {
              user.photos.push(photo.id);
              user.save().then(data => {
                res.json(dbimage);
              });
            });
          });
        }
      );
    });
  }
);

module.exports = router;
