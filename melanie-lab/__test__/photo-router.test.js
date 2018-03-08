'use strict';

const request = require('superagent');
const server = require('../server.js');
const serverToggle = require('../lib/server-toggle.js');
const path = require('path');

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const Photo = require('../model/photo.js');

require('jest');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = { username: 'embee', password: 'yoyoyo', email: 'embeecee@gmail.com' };
const exampleGallery = { name: 'test gallery', description: 'Test gallery description' };
const examplePhoto = { name: 'test porg photo', description: 'test photo description', image: `${__dirname}/../data/porg.jpg`};

describe(`Photo Routes`, function() {
  beforeAll( done => serverToggle.serverOn(server, done));
  afterAll( done => serverToggle.serverOff(server, done));

  afterEach( done => {
    Promise.all([
      Photo.remove({}),
      User.remove({}),
      Gallery.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/gallery/:galleryId/photo', function() {
    describe('with a valid token and valid data', function() {
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
      afterEach( done => {
        delete exampleGallery.userId;
        done();
      });
      
      it('should return an object containing our photo URL', done => {
        request.post(`${url}/api/gallery/${this.tempGallery._id}/photo`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .field('name', examplePhoto.name)
          .field('description', examplePhoto.description)
          .attach('image', examplePhoto.image)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(examplePhoto.name);
            expect(res.body.description).toEqual(examplePhoto.description);
            expect(res.body.galleryId).toEqual(this.tempGallery._id.toString());
            expect(path.parse(res.body.imageURI).dir.split('/')[2].split('.')[0]).toEqual('mbcinstaclonebucket');
            done();
          });
      });
    });
  });

  // describe('DELETE: /api/gallery/:galleryId/photo/:photoId', function() {
  //   describe('with a valid token and valid data', function() {
  //     beforeEach( done => {
  //       new User(exampleUser)
  //         .generatePasswordHash(exampleUser.password)
  //         .then( user => user.save())
  //         .then( user => {
  //           this.tempUser = user;
  //           return user.generateToken();
  //         })
  //         .then( token => {
  //           this.tempToken = token;
  //           done();
  //         })
  //         .catch(done);
  //     });
  //     beforeEach( done => {
  //       exampleGallery.userId = this.tempUser._id.toString();
  //       new Gallery(exampleGallery).save()
  //         .then( gallery => {
  //           this.tempGallery = gallery;
  //           done();
  //         })
  //         .catch(done);
  //     });
  //     beforeEach( done => {
  //       request.post(`${url}/api/gallery/${this.tempGallery._id}/photo`)
  //         .set({ Authorization: `Bearer ${this.tempToken}` })
  //         .field('name', examplePhoto.name)
  //         .field('description', examplePhoto.description)
  //         .attach('image', examplePhoto.image)
  //         .then( photo => {
  //           this.tempPhoto = photo;
  //           done();
  //         })
  //         .catch(done);
  //     });

  //     it('should delete the image', done => {
  //       request.delete(`${url}/api/photo/${this.tempPhoto.body._id}`)
  //         .set({ Authorization: `Bearer ${this.tempToken}` })
  //         .end((err, res) => {
  //           if (err) return done(err);
  //           expect(res.status).toEqual(200);
  //           done();    
  //         });
  //     });
  //   });
  // });
});