const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Photo = require("./Photo");

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	photos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Photo
		}
	]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
