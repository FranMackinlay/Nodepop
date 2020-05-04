'use strict';

const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
  //TODO: save the locale param
  const locale = req.params.locale;

  //TODO: save the prev page so we can go back
  const prevPage = req.get('referer');

  //TODO: place new language cookie
  res.cookie('nodeapi-locale', locale, { maxAge: 1000 * 60 * 60 * 24 * 20 }); //? 20 days

  //TODO: redirect to prev page
  res.redirect(prevPage);
})


module.exports = router;
