const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Models
const User = require('../../models/User');

// Register
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

    try {
      // See if user exits - Bao loi neu user da ton tai
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exits' }] });
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

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          user.save();
        });
      }); // Async

      const payload = {
        user: {
          id: user.id, // ???????
        },
      };
     
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  } // Khi co UI se thu them ve try catch
);

module.exports = router;
