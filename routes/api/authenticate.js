const express = require('express');

const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/', async (req, res, next) => {
  try {

    const email = req.body.email;
    const password = req.body.password;

    const findUser = await User.findOne({ email });

    if (!findUser || !await bcrypt.compare(password, findUser.password)) {
      const error = new Error({ error: true, message: 'Invalid Credentials' });
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign({ _id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    res.json({ token });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
