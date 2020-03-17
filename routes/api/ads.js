/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */

const express = require('express');

const router = express.Router();

const Ad = require('../../models/Ad');

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
      res.status(404).json({ error: 'Ad not found, try with another query' });
    } else {
      res.json(adList);
      // res.render('adList', adList);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/tags', async (req, res, next) => {
  try {
    const tagsArray = await Ad.getTags();
    res.json(tagsArray);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const ad = await Ad.findOne({ _id });

    if (!ad) {
      res.status(404).json({ result: 'Ad not found' });
    }

    res.json({ result: ad });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res) => {
  const adData = req.body;

  const newAd = new Ad(adData);

  await newAd.save();

  res.status(201).json({ result: 'Ad created successfully' });
});

router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const adUpdate = req.body;

    const updatedAd = await Ad.findOneAndUpdate({ _id }, adUpdate, {
      new: true,
      useFindAndModify: false,
    });

    res.json({ result: updatedAd });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Ad.deleteOne({ _id });

    res.json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
