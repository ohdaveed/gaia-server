const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const jwtExpirySeconds = 3600;

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const passport = require("passport");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ username: "email taken" });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user.username))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched

        // Create JWT Payload
        // const payload = {
        //   id: user.id,
        //   name: user.username
        // };

        let name = user.username

        const token = jwt.sign({name}, keys.secretOrKey, {
          algorithm: 'HS256',
          expiresIn: jwtExpirySeconds
        });

        console.log('token:', token);

        res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
        res.status(200)
        res.end();

        // req.login(payload, { session: false }, error => {
        //   if (error) {
        //     res.status(400).send({ error });
        //   }
        // });
        // // Sign token
        // const token = jwt.sign(JSON.stringify(payload), keys.secretOrKey);
        // console.log(keys.secretOrKey)
        // console.log(keys)
        // res.status(200).send({token});
      }
    });
  });
});

//       (err, token) => {
//         res.json({
//           success: true,
//           payload,
//           token: "Bearer " + token
//         });
//       }
//     );
//   } else {
//     return res
//       .status(400)
//       .json({ passwordincorrect: "Password incorrect" });
//   }
// });

router.get(
  "/currentUser",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({ username: req.user.username });
  }
);

module.exports = router;
