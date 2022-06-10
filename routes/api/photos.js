const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Photo = require("../../models/Photo");
const axios = require("axios");
const User = require("../../models/User");
const keys = require("../../config/keys");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const fileUpload = require("express-fileupload");
const { upload } = require("../../config/cloudinary");

// cloudinary.config({

//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET

// })

// MULTER
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

// gets all photos from a user
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = { username: req.user.username };

    Photo.find().where(user)
      .then((photos) => res.json(photos))
      .catch((err) =>
        res.status(404).json({ nophotosfound: "No photos found" })
      );
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.send("photo route testing!");
  }
);

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    const upload = multer({ storage }).single("image");

    upload(req, res, function (err) {
      if (err) return res.send(err);

      const geourl =
        "https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.GEO_API;

      let long, lat;

      const location = axios.get(geourl).then(function (response) {
        lat = parseFloat(response.data.latitude);
        long = parseFloat(response.data.longitude);
      });

      const path = req.file.path;
      const uniqueFilename = new Date().toISOString();

      let dbimage;
      let imgurl;

      cloudinary.uploader.upload(
        path,{ public_id: `${req.user.id}/${uniqueFilename}`, tags: `${location}` }, // directory and tags are optional
          function (err, image) {
            if (err) return res.send(err);
              
            fs.unlinkSync(path);

            const dbimage = {
              url: image.url,
              name: image.original_filename,
              lat: location.lat,
              long: location.long,
              location: image.location,
              username: req.user.username,
             };

          Photo.create(dbimage).then(photo => {
            // User.findById(req.user.id).then((user) => {
            //   user.photos.push(photo.id);
            //   user.save().then((data) => {
            //     cole.log("The upload was a success.");
             return res.json(photo);
          });
        }
      );
    });
  }
);

router.post("/add-image", async (req, res) => {
  if (!req.files) return res.send("Please upload an image");

  const { image } = req.files;
  const fileTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!fileTypes.includes(image.mimetype))
    return res.send("Image formats supported: JPG, PNG, JPEG");

  const cloudFile = await upload(image.tempFilePath);
  // console.log(cloudFile)
  // console.log('This is the cloudfile')

  let photo = new Photo({
    user_id: req.user,
    public_id: cloudFile.public_id,
    photo_url: cloudFile.url,
    delete_token: cloudFile.delete_token,
    signature: cloudFile.signature,
    date: cloudFile.created_at,
  });

  photo.save(photo);

  return res.status(201).json(photo);
});

module.exports = router;
