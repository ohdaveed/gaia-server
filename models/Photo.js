const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const photoSchema = new Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User"
	},
	url: String,
	caption: String
});

const Photo = mongoose.model("Photos", photoSchema);

module.exports = Photo;
