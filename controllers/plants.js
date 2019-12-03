const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");
const { encode, decode } = require("url-encode-decode");
const axios = require("axios");
const Plant = require("../models/Plant");

router.get("/test", (req, res) => res.send("plant route testing!"));

// @route GET api/plants
// @description identify plant
// @access Public
router.get("/:id", (req, res) => {
	Photo.findById(req.params.id)
		.then((photo) => {
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
				return response;
			});
			return identified;
		})
		.then((response) => {
			const data = response.data;
			console.log("this is data");
			console.log(data);
			return data;
		})
		.then((data) => {
			const plantdb = {
				common_name: data.results[0].species.commonNames,
				scientific_name:
					data.results[0].species.scientificNameWithoutAuthor,
				url: data.query.images,
				score: data.results[0].score
			};
			Plant.create(plantdb);
		})
		.then((data) => res.json(data))
		.catch((err) =>
			res.status(404).json({ noPlantfound: "No Plant found" })
		);
});

module.exports = router;
