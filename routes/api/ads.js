'use strict';

const express = require('express');
const router = express.Router();

const Ad = require('../../models/Ad');

router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.adName !== undefined) {
      const adName = new RegExp('^' + req.query.adName, "i");
      filter.adName = adName;
    }

    const sale = req.query.sale;
    const price = req.query.price;
    const tags = req.query.tags;
    const limit = parseInt(req.query.limit) || 10000;
    const skip = parseInt(req.query.skip);
    const sort = req.query.sort;



    if (typeof sale !== 'undefined') {
      filter.sale = sale;
    }
    if (typeof price !== 'undefined') {
      if (price.includes('-')) {

        const priceRange = price.split('-');

        filter.price = { $gte: parseInt(priceRange[0]), $lte: parseInt(priceRange[1]) };

      } else {
        filter.price = price;
      }
    }

    if (typeof tags !== 'undefined') {
      filter.tags = tags;
    }

    console.log(filter);
    const adList = await Ad.list(filter, limit, skip, sort, tags);
    res.locals.adList = adList;

    if (adList.length === 0) {
      res.status(404).json({ error: 'Ad not found, try with another query' });
    } else {
      res.render('adList', adList);
    }


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

router.post('/', async (req, res, next) => {
  const adData = req.body;

  const newAd = new Ad(adData);

  const saveNewAd = await newAd.save();

  res.status(201).json({ result: `Ad created successfully` });
});

router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const adUpdate = req.body;

    const updatedAd = await Ad.findOneAndUpdate({ _id }, adUpdate, {
      new: true,
      useFindAndModify: false
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
