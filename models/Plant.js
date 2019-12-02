const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User"
	},
	common_name: { type: String },
	scientific_name: { type: String },
	url: { type: String },
	caption: { type: String },
	lattitude: { type: Number },
	longitude: { type: Number }
});

const Photo = mongoose.model("Photos", photoSchema);

module.exports = Photo;
