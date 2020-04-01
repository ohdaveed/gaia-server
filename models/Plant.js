const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'User',
	},
	common_name: String,
	scientific_name: String,
	url: String,
	location: {
		type: String,
		enum: ['Point'],
		required: true,
	},
	coordinates: {
		type: [Number],
		required: true,
	},

	lat: Number,
	long: Number,
	score: Number,
	username: String,
	date_created: { type: Date, default: Date.now },
});

const Plant = mongoose.model('Plants', plantSchema);

module.exports = Plant;
