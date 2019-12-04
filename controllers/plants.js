const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");
const { encode, decode } = require("url-encode-decode");
const axios = require("axios");
const Plant = require("../models/Plant");

router.get("/test", (req, res) => res.send("plant route testing!"));

// @route GET api/users
// @description Get all users
// @access Public
router.get("/", (req, res) => {
	Plant.find()
		.then((plants) => res.json(plants))
		.catch((err) =>
			res.status(404).json({ noplantsfound: "No Plants found" })
		);
});

// @route GET api/plants
// @description identify plant
// @access Public
router.get("/:id", (req, res) => {
	let lat;
	let long;
	Photo.findById(req.params.id)
		.then((photo) => {
			lat = photo.lat;
			long = photo.long;
			let url = photo.url;
			const encodedurl = encode(url);
			let identifyurl =
				"https://my-api.plantnet.org/v2/identify/all?" +
				"api-key=" +
				process.env.PLANET_NET_API +
				"&images=" +
				encodedurl +
				"&organs=leaf";
			return identifyurl;
		})
		.then((identifyurl) => {
			const identified = axios.get(identifyurl).then((response) => {
				// console.log("\n this is my response");
				// console.log(response);
				return response;
			});
			return identified;
		})
		.then((response) => {
			const data = response.data;
			// console.log("\n this is data");
			// console.log(data);
			return data;
		})
		.then((data) => {
			const plantdb = {
				common_name: data.results[0].species.commonNames,
				scientific_name:
					data.results[0].species.scientificNameWithoutAuthor,
				url: data.query.images,
				score: data.results[0].score,
				lat: lat,
				long: long
			};
			Plant.create(plantdb).then((data) => {
				res.json(data);
			});
		})
		// .then((data) => res.json(data))
		.catch((err) => {
			console.log(err);
			res.status(404).json({ noPlantfound: "No Plant found" });
		});
});

// @route GET api/plants/:id
// @description Delete plant by id
// @access Public
router.delete("/:id", (req, res) => {
	Plant.findByIdAndRemove(req.params.id, req.body)
		.then((plant) => res.json({ mgs: "Plant entry deleted successfully" }))
		.catch((err) => res.status(404).json({ error: "No such plant" }));
});

module.exports = router;
