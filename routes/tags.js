const express = require('express');

const router = express.Router();

const Ad = require('../models/Ad');

router.get('/', async (req, res, next) => {
  try {
    const tagsArray = await Ad.getTags();
    res.locals.tagsArray = tagsArray;
    res.render('tags', tagsArray);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
