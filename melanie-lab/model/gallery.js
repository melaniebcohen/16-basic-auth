'use strict';

const mongoose = require('mongoose');
// const createError = require('http-errors');
const debug = require('debug')('instaclone:user.js');

const Schema = mongoose.Schema;
const gallerySchema = Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  userId: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('gallery', gallerySchema);