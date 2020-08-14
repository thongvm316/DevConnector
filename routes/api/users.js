const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Models
const User = require('../../models/User');

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Pleae include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password width 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    console.log(req.body);

    try {
      // See if user exits
      let user = await User.findOne({ email: email });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exits' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      // const salt = await bcrypt.genSalt(10);
      // user.password = await bcrypt.hash(password, salt);
      // await user.save();
      // console.log(user)

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          user.save();
          console.log(user)
      });
    });

      // Return jsonwebtoken

      res.send('User register');
    } catch (error) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
