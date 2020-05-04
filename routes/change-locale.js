'use strict';

const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {

  const locale = req.params.locale;

  const prevPage = req.get('referer');

  res.cookie('nodeapi-locale', locale, { maxAge: 1000 * 60 * 60 * 24 * 20 }); //? 20 days

  res.redirect(prevPage);
})


module.exports = router;
