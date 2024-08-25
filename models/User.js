const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Photo = require("./Photo");
const Plant = require("./Plant");

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	portfolio: {
		    type: mongoose.Schema.Types.ObjectID,
        ref: 'Photo',
	},
	treks: [{}],
	photos: [{}],
	plants: [{}]
	
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
