const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User"
	},
	url: String,
	name: String,
	lat: Number,
	long: Number,
	date_created: { type: Date, default: Date.now }
});

const Photo = mongoose.model("Photos", photoSchema);

module.exports = Photo;
