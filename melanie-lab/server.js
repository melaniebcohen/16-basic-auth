'use strict';

const express = require('express');
const debug = require('debug')('instaclone:server.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./router/auth-router.js');
const galleryRouter = require('./router/gallery-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(authRouter);
app.use(galleryRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`listening on port ${PORT}`);
});

server.isRunning = true;