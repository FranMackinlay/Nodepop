'use strict';

const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
  adName: String,
  sale: Boolean,
  price: Number,
  photo: String,
  tags: [String]
});

adSchema.statics.list = function (filter, limit, skip, sort) {

  const query = Ad.find(filter).limit(limit).skip(skip).sort(sort);
  return query.exec();
};

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
