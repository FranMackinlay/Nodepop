/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/', async (req, res, next) => {
  try {
    if (!req.query.email) {
      const userList = await User.list();
      res.json({ users: userList });
    } else {
      const email = req.query.email;
      console.log('REQ.QUERY', req.query);
      const findUser = await User.findOne({ email });

      if (!findUser) {
        res.status(404).json({ error: 'User not found', status: 404 });
      } else {
        res.json({ user: findUser });
      }
    }

  } catch (error) {
    next(error);
  }

});

router.post('/', async (req, res, next) => {

  try {
    const userData = req.body;

    userData.password = await User.hashPassword(userData.password);

    const newUser = new User(userData);
    await newUser.save();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

    res.status(201).json({ result: 'User created successfully', status: 201, user: newUser });

  } catch (error) {
    res.status(400).json({ error: 'Email already taken', status: 400 });
  }
});


module.exports = router;
