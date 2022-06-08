const express = require("express");
const router = express.Router();
const Photo = require("../../models/Photo");
const axios = require("axios");
const User = require("../../models/User");
const cloudinary = require("cloudinary").v2;

// AUTHENTICATION
const passport = require("passport");

// MULTER
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");
const Datauri = require("datauri");
const datauri = new Datauri();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

let long, lat, location, id, user;

const geourl =
  "https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.GEO_API;

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

// router.post(
//   "/add", {

// }).then(function(err, image) {
//   var photo = new Photo(req.body);
// // Get temp file path
// var imageFile = req.files.image.path;
// // Upload file to Cloudinary
// cloudinary.uploader
//   .upload(imageFile, { tags: "express_sample" })
//   .then(function (image) {
//     console.log("** file uploaded to Cloudinary service");
//     console.dir(image);
//     photo.image = image;
//     // Save photo with image metadata
//     return photo.save();
//   })
//   .then(function () {
//     console.log("** photo saved");
//   })
//   .finally(function () {
//     res.render("photos/create_through_server", {
//       photo: photo,
//       upload: photo.image,
//     });
//   })
// })

// Photo upload to cloudinary
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return res.send(err);
      }

      // const geourl =
      // "https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.GEO_API;

      location = axios.get(geourl).then(function (response) {
        [
          (lat = parseFloat(response.data.latitude)),
          (long = parseFloat(response.data.longitude)),
        ];
      });

      datauri.format(".png", req.file.buffer);

      const file = datauri.content;

      const uniqueFilename = Date.now() + req.file.originalname.split(".")[0];

      let dbimage;
      user = req.user;
      let name = req.file.originalname.split(".")[0];
      let mimetype = file.mimetype;

      cloudinary.uploader.upload(
        file,
        {
          folder: `${req.user.username}`,
          tags: `${req.user.id}`,
          access_type: `token`,
        },
        function (err, result) {
          if (err) return res.send(err);

          console.log(result);

          let imgurl = result.url;

          dbimage = {
            url: result.url,
            name: `${uniqueFilename}`,
            longdec: long,
            latdec: lat,
            public_id: result.public_id,
            coordinates: [long, lat],
            date: Date(),
            user: req.user.username,
          };
          User.findById(req.user.id).then((user) => {
            user.photos.push(dbimage.url);
            user.save();
          });

          Photo.create(dbimage).then((photo) => {
            photo.save().then((data) => {
              res.json(dbimage).status(200);
            });
          });
        }
      );
    });
  }
);

module.exports = router;
