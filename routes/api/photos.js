const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Photo = require("../../models/Photo");
const axios = require("axios");
const User = require("../../models/User");
const keys = require("../../config/keys");

const passport = require("passport")

// MULTER
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

router.get("/", passport.authenticate('jwt', {session:false}), function (req, res){
   res.send("photo route testing!");
});

router.post("/upload", passport.authenticate('jwt', {session:false}), function(req, res){

        
        const upload = multer({ storage }).single("image");
        upload(req, res, function(err) {
            if (err) {
                return res.send(err);
            }

            const cloudinary = require("cloudinary").v2;
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_SECRET
            })

            const geourl =
                "https://api.ipgeolocation.io/ipgeo?apiKey=" +
                process.env.GEO_API;

            let long, lat;
            let location = axios.get(geourl).then(function(response) {
                lat = parseFloat(response.data.latitude);
                long = parseFloat(response.data.longitude);
            });

            const path = req.file.path;
            const uniqueFilename = new Date().toISOString();

            let dbimage;
            let imgurl
            cloudinary.uploader.upload(
                    path,
                    { public_id: `gaia/${uniqueFilename}`, tags: `gaia` }, // directory and tags are optional
                    function(err, image) {
                        if (err) return res.send(err);
                        const fs = require("fs");
                        fs.unlinkSync(path);

                        const dbimage = {
                            url: image.url,
                            name: image.original_filename,
                            lat: lat,
                            long: long
                        };

                        Photo.create(dbimage).then((photo) => {
                            User.findById(req.user.id).then((user) => {
                                user.photos.push(photo.id);
                                user.save().then((data) => {
                                    res.json(dbimage
                                    );
                                });
                            });
                        });
                    })
                })
            })
module.exports = router