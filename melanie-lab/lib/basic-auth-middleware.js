'use strict';

const createError = require('http-errors');
const debug = require('debug')('instaclone:basic-auth-middleware.js');

module.exports = function(req, res, next) {
  debug('basic auth');

  var authHeader = req.headers.authorization;
  if (!authHeader) next(createError(401, 'Authorization header required'));

  var base64str = authHeader.split('Basic ')[1];
  if (!base64str) next(createError(401, 'Username and password required'));

  var utf8str = Buffer.from(base64str, 'base64').toString();
  var authArr = utf8str.split(':');

  req.auth = {
    username: authArr[0],
    password: authArr[1],
  };

  if (!req.auth.username) next(createError(401, 'username required'));
  if (!req.auth.password) next(createError(401, 'password required'));
  next();
};