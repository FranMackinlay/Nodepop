'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  ads: [],
});

userSchema.statics.hashPassword = async (simplePassword) => {
  return await bcrypt.hash(simplePassword, 10);
};

// eslint-disable-next-line func-names
userSchema.statics.list = function (filter, limit, skip, sort) {
  // eslint-disable-next-line no-use-before-define
  const query = User.find(filter).limit(limit).skip(skip).sort(sort);
  return query.exec();
};


const User = mongoose.model('User', userSchema);

// TODO: Module export
module.exports = User;
