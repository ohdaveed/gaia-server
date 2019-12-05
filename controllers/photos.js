const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");
const axios = require("axios");
const User = require("../models/User");

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

router.get("/test", (req, res) => res.send("photo route testing!"));

// @route GET api/photos
// @description Get all photos
// @access Public
router.get("/", (req, res) => {
	Photo.find()
		.then((photo) => res.json(photo))
		.catch((err) =>
			res.status(404).json({ nophotosfound: "No photos found" })
		);
});

// @route GET api/photos/:id
// @description Get single photo by id
// @access Public
router.get("/:id", (req, res) => {
	Photo.findById(req.params.id)
		.then((photo) => res.json(photo))
		.catch((err) =>
			res.status(404).json({ noPhotofound: "No Photo found" })
		);
});

// @route POST api/photos
// @description Post a photo
// @access Public
router.post("/upload", (req, res, next) => {
	console.log("\nhere's the session in photo upload");
	console.log(req.session);
	if (req.session.logged === true) {
		const upload = multer({ storage }).single("image");
		upload(req, res, function(err) {
			if (err) {
				return res.send(err);
			}
			// res.json(req.file);
			console.log("file uploaded to server");
			console.log(req.file);

			const cloudinary = require("cloudinary").v2;
			cloudinary.config({
				cloud_name: process.env.CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_SECRET
			});

			const geourl =
				"https://api.ipgeolocation.io/ipgeo?apiKey=" +
				process.env.GEO_API;

			console.log(geourl);

			let long, lat;
			let location = axios.get(geourl).then(function(response) {
				lat = parseFloat(response.data.latitude);
				long = parseFloat(response.data.longitude);
			});

			const path = req.file.path;
			const uniqueFilename = new Date().toISOString();

			console.log("does it get this far?");
			console.log(path);

			let dbimage;
			cloudinary.uploader
				.upload(
					path,
					{ public_id: `gaia/${uniqueFilename}`, tags: `gaia` }, // directory and tags are optional
					function(err, image) {
						if (err) return res.send(err);
						console.log("file uploaded to Cloudinary");
						// remove file from server
						const fs = require("fs");
						fs.unlinkSync(path);

						const dbimage = {
							url: image.url,
							name: image.original_filename,
							lat: lat,
							long: long
						};

						Photo.create(dbimage).then((photo) => {
							User.findById(req.session.user._id).then((user) => {
								console.log("\n here's the user");
								console.log(user);
								user.photos.push(photo.id);
								user.save().then((data) => {
									res.json({
										msg: "photo url added successfully"
									});
								});
							});
						});
					}
				)

				.catch((err) =>
					res
						.status(400)
						.json({ error: "Unable to add this photo url" })
				);
		});
	} else {
		res.status(401).json({ error: "You must be logged in" });
	}
});

// @route GET api/photos/:id
// @description Delete photo by id
// @access Public
router.delete("/:id", (req, res) => {
	Photo.findByIdAndRemove(req.params.id, req.body)
		.then((photo) => res.json({ mgs: "Photo entry deleted successfully" }))
		.catch((err) => res.status(404).json({ error: "No such photo" }));
});

module.exports = router;
