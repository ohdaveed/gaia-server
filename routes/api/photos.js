const express = require("express");
const router = express.Router();
const Photo = require("../../models/Photo");
const axios = require("axios");
const User = require("../../models/User");
// const fs = require("fs");
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
    let user = req.user.id;
    Photo.find()
      .where(user)
      .then((photos) => res.json(photos))
      .catch((err) =>
        res.status(404).json({ nophotosfound: "No photos found" })
      );
  }
);

//Photo test route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.send("photo route testing!");
  }
);

// Delete photo by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Photo.findByIdAndRemove(req.params.id).then((photo) => {
      res.json({ message: "photo deleted" }).status(200);
    });
  }
);

// Photo upload to cloudinary
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return res.send(err);
      }

      // console.log(req.file);

      const cloudinary = require("cloudinary").v2;

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      });

      const geourl =
        "https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.GEO_API;

      let long, lat;
      let location = axios.get(geourl).then(function (response) {
        lat = parseFloat(response.data.latitude);
        long = parseFloat(response.data.longitude);
      });

      datauri.format(".jpg", req.file.buffer);

      const file = datauri.content;

      let dbimage;
      let imgurl;
      let id;
      let user;
      let name = req.file.originalname.split(".")[0];
      let mimetype = file.mimetype;
      let css = file.getcss;

      const uniqueFilename =
        Date.now() + "-" + req.file.originalname.split(".")[0];

      cloudinary.uploader.upload(
        file,
        {
          folder: `${req.user.username}`,

          public_id: `${uniqueFilename}`,
          tags: `${req.user.id}`,
        },
        function (err, result) {
          if (err) return res.send(err);
          /*
                    console.log(result);
          */
          const dbimage = {
            url: result.url,
            format: result.format,
            tags: req.user.id,
            name: result.public_id,
            long: long,
            lat: lat,
            user: req.user.username,
          };

          imgurl = result.url;

          User.findById(req.user.id).then((user) => {
            user.photos.push(dbimage.url);
            user.save().then(console.log(dbimage));
          });

          Photo.create(dbimage).then((photo) => {
            User.findById(req.user.id).then((user) => {
              user.photos.push(dbimage.url);
              user.save().then((data) => {
                res.json(dbimage).status(200);
              });
            });
          });
        }
      );
    });
  }
);

module.exports = router;
