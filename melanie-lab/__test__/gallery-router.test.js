'use strict';

const request = require('superagent');
const mongoose = require('mongoose');
const serverToggle = require('../lib/server-toggle.js');
const Promise = require('bluebird');
const server = require('../server.js');

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

require('jest');

const url = `http://localhost:3000`;
const exampleUser = { username: 'embee', password: 'yoyoyo', email: 'embeecee@gmail.com' };
const exampleGallery = { name: 'test gallery', description: 'Test gallery description' };

describe('Gallery Routes', function() {
  beforeAll( done => serverToggle.serverOn(server, done));
  afterAll( done => serverToggle.serverOff(server, done));

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/gallery', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    it('should return a gallery', done => {
      request.post(`${url}/api/gallery`)
        .send(exampleGallery)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.description).toEqual(exampleGallery.description);
          expect(res.body.name).toEqual(exampleGallery.name);
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          done();
        });
    });
  });

  describe('GET: /api/gallery/:galleryId', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeEach( done => {
      exampleGallery.userId = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
    });
    afterEach( () => delete exampleGallery.userId );
    it('should return a gallery', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.description).toEqual(exampleGallery.description);
          expect(res.body.name).toEqual(exampleGallery.name);
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          done();
        });
    });
  });
});