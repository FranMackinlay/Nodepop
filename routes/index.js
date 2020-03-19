/* eslint-disable radix */
const express = require('express');

const router = express.Router();

const Ad = require('../models/Ad');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    //* Validate adName filter
    if (req.query.adName !== undefined) {
      const adName = new RegExp(`^${req.query.adName}`, 'i');
      filter.adName = adName;
    }

    //* Validate price filter
    if (req.query.price !== undefined) {
      if (req.query.price.includes('-')) {
        const priceRange = req.query.price.split('-');

        if (priceRange[0] !== '' && priceRange[1] !== '') {
          const $gte = parseInt(priceRange[0]);
          const $lte = parseInt(priceRange[1]);

          filter.price = { $gte, $lte };
        }

        if (priceRange[0] === '' && priceRange[1] !== '') {
          const $lte = parseInt(priceRange[1]);

          filter.price = { $lte };
        }

        if (priceRange[0] !== '' && priceRange[1] === '') {
          const $gte = parseInt(priceRange[0]);

          filter.price = { $gte };
        }
      } else {
        filter.price = req.query.price;
      }
    }

    //* Validate tags filter
    if (typeof req.query.tags !== 'undefined') {
      if (req.query.tags.includes('-')) {
        const tagsArray = req.query.tags.split('-');

        filter.tags = { $in: tagsArray };
      } else {
        filter.tags = req.query.tags;
      }
    }

    //* Validate sale filter
    const isSale = req.query.sale;
    switch (isSale) {
      case 'buy':
        filter.sale = true;
        break;
      case 'sell':
        filter.sale = false;
        break;
      default:
        break;
    }

    const limit = parseInt(req.query.limit) || 10000;
    const skip = parseInt(req.query.skip);
    const { sort } = req.query;

    const adList = await Ad.list(filter, limit, skip, sort);

    res.locals.adList = adList;

    if (adList.length === 0) {
      res.locals.errors = {
        status: res.status(404).statusCode,
        msg: 'Oh no! Ad not found!',
        solution: 'Please try another query.',
      };
      res.render('error');
    } else {
      res.render('adList', adList);
      // res.render('adList', adList);
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;
