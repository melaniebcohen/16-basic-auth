'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('instaclone:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const galleryRouter = module.exports = Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, (req, res, next) => {
  debug('POST: /api/gallery');

  req.body.userId = req.user._id;
  new Gallery(req.body).save()
    .then( gallery => res.json(gallery))
    .catch(next);
});

galleryRouter.get('/api/gallery/:galleryId', bearerAuth, (req, res, next) => {
  debug('GET: /api/gallery/:galleryId');

  Gallery.findById(req.params.galleryId)
    .then( gallery => res.json(gallery))
    .catch( () => next());
});

galleryRouter.put('/api/gallery/:galleryId', bearerAuth, jsonParser, (req, res, next) => {
  debug('PUT: /api/gallery/:galleryId');
  
  if(!req.body.name) return next(createError(400, 'Bad Request'));
  if(!req.body.description) return next(createError(400, 'Bad Request'));

  Gallery.findByIdAndUpdate(req.params.galleryId, req.body, { new: true })
    .then( gallery => res.json(gallery))
    .catch( () => next());
});

galleryRouter.delete('/api/gallery/:galleryId', bearerAuth, (req, res, next) => {
  debug('DELETE: /api/gallery/:galleryId');

  Gallery.findByIdAndRemove(req.params.galleryId, bearerAuth)
    .then( () => res.text('Gallery deleted'))
    .catch( err => next(err));
});