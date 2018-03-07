'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
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
    it('with a valid body, should return a gallery', done => {
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
    it('without a token, should return a 401 error', done => {
      request.post(`${url}/api/gallery`)
        .send(exampleGallery)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('without a body or with an invalid body, should return a 400 error', done => {
      request.post(`${url}/api/gallery`)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('BadRequestError');
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
    
    it('with a valid body, should return a gallery', done => {
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
    it('without a token, should return a 401 error', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('for a valid request with id not found, should return a 404 error', done => {
      request.get(`${url}/api/gallery/12345`)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res).toEqual('object');
          done();
        });
    });
  });

  describe('PUT: /api/gallery/:galleryId', () => {
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

    it('with a valid body, should update a gallery', done => {
      exampleGallery.name = 'Test Update';
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
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
    it('without a token, should return a 401 error', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
        .send(exampleGallery)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('for a valid request with id not found, should return a 404 error', done => {
      request.put(`${url}/api/gallery/1234`)
        .send(exampleGallery)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
    it('without a body or with an invalid body, should return a 400 error', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          console.log(res.text)
          expect(res.text).toEqual('BadRequestError');
          done();
        });
    });


  });

  describe('Unregistered Routes', () => {
    it('unregistered routes should return a 404 error', done => {
      request.get(`${url}/api/galery/`)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res).toEqual('object');
          done();
        });
    });
  });
});