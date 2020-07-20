
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
    console.log('ISSALE', isSale);
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

    // res.setHeader('Access-Control-Allow-Origin', 'http://3.19.218.251/');
    // res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, append, delete, entries,f oreach, get, has, keys, set, values');

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

router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const ad = await Ad.findOne({ _id });

    // res.setHeader('Access-Control-Allow-Origin', 'http://3.19.218.251/');
    // res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, append, delete, entries,f oreach, get, has, keys, set, values');

    if (!ad) {
      res.status(404).json({ result: 'Ad not found' });
    }

    res.json({ result: ad });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
