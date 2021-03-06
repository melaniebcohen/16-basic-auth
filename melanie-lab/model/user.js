'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const debug = require('debug')('instaclone:user.js');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  findToken: { type: String, unique: true },
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generatePasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindToken = function() {
  debug('generateFindToken');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateFindToken.call(this);

    function _generateFindToken() {
      this.findToken = crypto.randomBytes(32).toString('hex');  
      this.save()
        .then( () => resolve(this.findToken))
        .catch( err => {
          if (tries > 3) return reject(err);
          tries++;
          _generateFindToken.call(this);
        });
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');

  return new Promise((resolve, reject) => {
    this.generateFindToken()
      .then( findToken => resolve(jwt.sign({ token: findToken }, process.env.APP_SECRET)))
      .catch( err => reject(err));
  });
};

module.exports = mongoose.model('user', userSchema);