const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Photo = require("./Photo");
const Plant = require("./Plant");

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
	],
	plants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Plant
		}
	]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
