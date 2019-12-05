const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/test", (req, res) => res.send("user route testing!"));

// @route GET api/users
// @description Get all users
// @access Public
router.get("/", (req, res) => {
	User.find()
		.then((users) => res.json(users))
		.catch((err) =>
			res.status(404).json({ nousersfound: "No Users found" })
		);
});

// @route GET api/users/:id
// @description Get single user by id
// @access Public
router.get("/:id", (req, res) => {
	User.findById(req.params.id)
		.then((user) => res.json(user))
		.catch((err) => res.status(404).json({ nouserfound: "No User found" }));
});

// @route GET api/users
// @description add/save user
// @access Public
router.post("/", (req, res) => {
	User.create(req.body)
		.then((user) => res.json({ msg: "User added successfully" }))
		.catch((err) =>
			res.status(400).json({ error: "Unable to add this user" })
		);
});

// @route GET api/users/:id
// @description Update user
// @access Public
router.put("/:id", (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body)
		.then((user) => res.json({ msg: "Updated successfully" }))
		.catch((err) =>
			res.status(400).json({ error: "Unable to update the Database" })
		);
});

// @route GET api/users/:id
// @description Delete book by id
// @access Public
router.delete("/:id", (req, res) => {
	User.findByIdAndRemove(req.params.id, req.body)
		.then((user) => res.json({ mgs: "User entry deleted successfully" }))
		.catch((err) => res.status(404).json({ error: "No such user" }));
});

// @route POST api/users/register
// @description register user

router.post("/register", (req, res, next) => {
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

	const userDbEntry = {};

	userDbEntry.username = req.body.username;
	userDbEntry.email = req.body.email;
	userDbEntry.password = passwordHash;

	User.create(userDbEntry, (err, user) => {
		if (err) {
			next(err);
		}

		req.session.id = user.id;
		req.session.username = user.username;
		req.session.logged = true;

		res.json(userDbEntry);
	});
});

//@route POST api/users/login
// @description login user

router.post("/login", (req, res, next) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		// console.log("\nthis is user we're finding in login")
		console.log(foundUser);
		if (foundUser) {
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.message = "";
				req.session.username = req.body.username;
				req.session.logged = true;
				req.session.id = foundUser._id;
				req.session.user = foundUser;

				res.json({ msg: "welcome" });
			} else {
				res.json({ msg: "you shall not pass!" });
			}
		} else {
			res.json({ msg: "you shall not pass!" });
		}
	});
});

// @route PUT api/users/logout
// @description logout user

router.get("/logout", (req, res) => {
	req.session.destroy(function(err) {
		if (err) {
		} else {
			req.session.logout = "y'all come back now!";
			res.redirect("/");
		}
	});
});

module.exports = router;
