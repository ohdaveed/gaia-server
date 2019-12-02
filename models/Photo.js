const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User"
	},
	path: { type: String },
	caption: { type: String }
});

const Photo = mongoose.model("Photos", photoSchema);

module.exports = Photo;
