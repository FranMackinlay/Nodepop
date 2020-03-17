
const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
  adName: String,
  sale: Boolean,
  price: Number,
  photo: String,
  tags: [String],
});

// eslint-disable-next-line func-names
adSchema.statics.list = function (filter, limit, skip, sort) {
  // eslint-disable-next-line no-use-before-define
  const query = Ad.find(filter).limit(limit).skip(skip).sort(sort);
  return query.exec();
};

const Ad = mongoose.model('Ad', adSchema);


module.exports = Ad;
