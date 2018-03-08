'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('instaclone:bearer-auth-middleware.js');

const User = require('../model/user.js');

module.exports = (req, res, next) => {
  debug('bearer auth');

  var authHeader = req.headers.authorization;
  if (!authHeader) next(createError(401, 'authorization header required'));

  var token = authHeader.split('Bearer ')[1];
  if (!token) next(createError(401, 'token required'));

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(err);

    User.findOne({ findToken: decoded.token })
      .then( user => {
        req.user = user;
        next();
      })
      .catch( err => next(createError(401, err.message)));
  });
};