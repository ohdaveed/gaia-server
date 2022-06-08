const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'User',
	},
	scientific_name: String,
	url: [String],
	coordinates: {
		type: [Number],
		required: true,
	},
	common_name: { type: [String], required: false, default: null},
	lat: Number,
	long: Number,
	score: Number,
	username: String,
	date_created: { type: Date, default: Date.now },
});

const Plant = mongoose.model('Plants', plantSchema);

module.exports = Plant;
