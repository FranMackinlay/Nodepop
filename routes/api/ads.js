/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */

const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ad');
const cote = require('cote');
const requester = new cote.Requester({ name: 'create thumbnail' });
const jimp = require('jimp');


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
        filter.sale = false;
        break;
      case 'sell':
        filter.sale = true;
        break;
      default:
        break;
    }

    const limit = parseInt(req.query.limit) || 10000;
    const skip = parseInt(req.query.skip);
    const { sort } = req.query;

    const adList = await Ad.list(filter, limit, skip, sort);

    if (req.query.email && adList.length !== 0) {
      const userAds = adList.filter(ad => {
        return ad.author === req.query.email;
      });
      return res.send({ userAds });
    }

    res.locals.adList = adList;

    if (adList.length === 0) {
      res.status(404).json({ error: 'Ad not found, try with another query' });
    } else {
      res.send({ adList });
      // res.render('adList', adList);
    }
    module.exports = adList;
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


router.post('/', async (req, res, next) => {
  const adData = req.body;

  const newAd = new Ad(adData);
  await newAd.save();
  // res.setHeader('Access-Control-Allow-Origin', 'http://3.19.218.251/');
  // res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

  res.status(201).json({ result: 'Ad created successfully', status: 201, ad: newAd });
});

router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const adUpdate = req.body;

    const updatedAd = await Ad.findOneAndUpdate({ _id }, adUpdate, {
      new: true,
      useFindAndModify: false,
    });

    // res.setHeader('Access-Control-Allow-Origin', 'http://3.19.218.251/');
    // res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, append, delete, entries,f oreach, get, has, keys, set, values');
    res.status(200);
    res.json({ result: updatedAd, status: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Ad.deleteOne({ _id });

    // res.setHeader('Access-Control-Allow-Origin', 'http://3.19.218.251/');
    // res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

    res.json({ result: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
