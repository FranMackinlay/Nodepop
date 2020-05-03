'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

userSchema.statics.hashPassword = (simplePassword) => {
  return bcrypt.hash(simplePassword, 10);
};


const User = mongoose.model('User', userSchema);

// TODO: Module export
module.exports = User;
