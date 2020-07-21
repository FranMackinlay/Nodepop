const express = require('express');

const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/', async (req, res, next) => {
  try {

    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    const findUser = await User.findOne({ email });

    if (!findUser || !await bcrypt.compare(password, findUser.password)) {
      let error = new Error();
      error.error = true;
      error.message = 'Invalid Credentials';
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign({ _id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });


    res.json({ token, findUser });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
