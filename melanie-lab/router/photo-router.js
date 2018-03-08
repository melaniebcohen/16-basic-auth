'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('instaclone:photo-router');

const Photo = require('../model/photo.js');
const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const photoRouter = module.exports = Router();

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

function s3uploadProm(params) {
  debug('s3uploadProm');

  return new Promise((resolve) => {
    s3.upload(params, (err, s3data) => {
      resolve(s3data);
    });
  });
}

function s3deleteProm(params) {
  debug('s3deleteProm');

  return new Promise((resolve) => {
    s3.deleteObject(params, (err, s3data) => {
      resolve(s3data);
    });
  });
}


photoRouter.post('/api/gallery/:galleryId/photo', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST: /api/gallery/:galleryId/photo');

  if (!req.file) return next(createError(400, 'File not found'));
  if (!req.file.path) return next(createError(500, 'File not saved'));

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };

  Gallery.findById(req.params.galleryId)
    .then( () => s3uploadProm(params))
    .then( s3data => {
      console.log('s3 response',s3data);
      del([`${dataDir}/*`]);

      let photoData = {
        name: req.body.name,
        description: req.body.description,
        objectKey: s3data.Key,
        imageURI: s3data.Location,
        userId: req.user._id,
        galleryId: req.params.galleryId,
      };
      
      return new Photo(photoData).save();
    })
    .then( photo => res.json(photo))
    .catch( err => next(err));
});

photoRouter.delete('/api/photo/:photoId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/photo/:photoId');

  let params = {
    Bucket: process.env.AWS_BUCKET,
  };

  Photo.findById(req.params.photoId)
    .then( photo => {
      params.Key = photo.objectKey;
      return params;
    })
    .then( params => s3deleteProm(params))
    .then( s3res => res.json(s3res))
    .catch( err => next(err));
});