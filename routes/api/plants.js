const express = require('express');
const router = express.Router();
const { encode, decode } = require('url-encode-decode');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../../models/User');
const keys = require('../../config/keys');
const Photo = require('../../models/Photo');
const Plant = require('../../models/Plant');

const passport = require('passport');

router.get('/', passport.authenticate('jwt', { session: false }), function (
	req,
	res
) {
	res.send('photo route testing!');
});

router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		let lat;
		let long;

		Photo.findById(req.params.id)
			.then((photo) => {
				lat = photo.lat;
				long = photo.long;
				let url = photo.url;
				const encodedurl = encode(url);
				let identifyurl =
					'https://my-api.plantnet.org/v2/identify/all?' +
					'api-key=' +
					process.env.PLANET_NET_API +
					'&images=' +
					encodedurl +
					'&organs=leaf';
				return identifyurl;
			})
			.then((identifyurl) => {
				const identified = axios.get(identifyurl).then((response) => {
					// console.log('\n this is my response');
					// console.log(response);
					return response;
				});
				return identified;
			})
			.then((response) => {
				const data = response.data;
				console.log('\n this is data');
				console.log(data.results[0]);
				return data;
			})
			.then((data) => {
				const plantdb = {
					common_name: data.results[0].species.commonNames,
					scientific_name:
						data.results[0].species.scientificNameWithoutAuthor,
					url: data.query.images,
					score: data.results[0].score,
					latdec: lat,
					longdec: long,
					username: req.user.username,
				};

				console.log('\n this is plantdb');
				console.log(plantdb);

				Plant.create(plantdb).then((plantdb) => {
					// User.findById(req.user.id).then(user => {
					//   user.plants.push(plantdb.id);
					//   user.save().then(plantdb => {
					//     res.json(plantdb);
					//   });
					// });
					res.json(plantdb);
				});
			})
			// .then((data) => res.json(data))
			.catch((err) => {
				res.status(404).json({ noPlantfound: 'No Plant found' });
			});
	}
);

// all plants by a user

router.get(
	'/all',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const user = { username: req.user.username };

		console.log('\n this is the user');
		console.log(user);

		Plant.find()
			.where(user)
			.then((plants) => res.json(plants))
			.catch((err) =>
				res.status(404).json({ noplantsfound: 'No plants found' })
			);
	}
);

module.exports = router;
