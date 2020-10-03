const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// Get user after login, register
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // select('-name'): loai bo field khi tim thay user
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
}) //??? chua biet dung de lam gi

// Login
router.post(
    '/',
    [
      check('email', 'Pleae include a valid email').isEmail(),
      check(
        'password',
        'Password is require'
      ).exists() // exists(): check xem nguoi dung co nhap pass hay ko, va ko quan tam nguoi dung nhap gi, chi can co nhap
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        let user = await User.findOne({ email: email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        const payload = {
          user: {
            id: user.id
          },
        };
       
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 360000 },
          (err, token) => {
            res.json({ token });
          }
        );
  
      } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
module.exports = router;


