const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");

router.get("/test", (req, res) => res.send("photo route testing!"));

router.post("/upload", async (req, res) => {
	try {
		if (!req.files) {
			res.send({
				status: false,
				message: "No file uploaded"
			});
		} else {
			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let avatar = req.files.avatar;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			avatar.mv("./uploads/" + avatar.name);

			//send response
			res.send({
				status: true,
				message: "File is uploaded",
				data: {
					name: avatar.name,
					mimetype: avatar.mimetype,
					size: avatar.size
				}
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
