import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## User APIs', () => {
  let user = {
    name: 'nameT',
    username: 'kk123',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };
  const validJwtCredentials = {
    name: 'nameT',
    username: 'kk123',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };
  const validUserCredentials = {
    name: 'nameT',
    username: 'test',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };
  let jwtToken;


  describe('# POST /v1/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/v1/users')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          user = res.body;
          done();
        })
        .catch(done);
    });
    it('should get valid JWT token', (done) => {
      request(app)
        .post('/v1/auth/login')
        .send(validJwtCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.username).to.equal(validJwtCredentials.username);
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
        })
        .catch(done);
    });
  });

  describe('# POST /v1/users/password/update', () => {
    it('should update a users password', (done) => {
      request(app)
        .patch('/v1/users/password/update')
        .set('Authorization', jwtToken)
        .send({
          currentPassword: validJwtCredentials.password,
          password: '1234'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('password updated successfully');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/v1/users/${user.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/v1/users/4edd40c86762e0fb12000003')
        .set('Authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /v1/users/biography', () => {
    it('should set users biography', (done) => {
      user.biography = 'test';
      request(app)
        .patch('/v1/users/biography')
        .set('Authorization', jwtToken)
        .send(user)
        .then((res) => {
          expect(res.body).to.equal('biography updated');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /v1/users/follow', () => {
    it('should follow a user', (done) => {
      request(app)
        .post('/v1/users/follow')
        .set('Authorization', jwtToken)
        .send(validUserCredentials)
        .then((res) => {
          expect(res.body.message)
            .to
            .equal(`${user.username} followed ${validUserCredentials.username}`);
          done();
        })
        .catch(done);
    });
  });
  describe('# POST /v1/users/unfollow', () => {
    it('should unfollow a user', (done) => {
      request(app)
        .post('/v1/users/unfollow')
        .set('Authorization', jwtToken)
        .send(validUserCredentials)
        .then((res) => {
          expect(res.body.message)
            .to
            .equal(`${user.username} unfollowed ${validUserCredentials.username}`);
          done();
        })
        .catch(done);
    });
  });
  describe('# PUT /v1/users/:userId', () => {
    it('should update user details', (done) => {
      user.username = 'kk';
      user.email = 'valid@email.com';
      request(app)
        .put(`/v1/users/${user.id}`)
        .set('Authorization', jwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('kk');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/v1/users')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# PATCH /v1/users/profile', () => {
    it('should SET profile of user', (done) => {
      request(app)
        .patch('/v1/users/profile')
        .send({
          biography: 'test',
          occupation: 'test'
        })
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('occupation');
          expect(res.body).to.have.property('biography');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/users/profile', () => {
    it('should get profile of user', (done) => {
      request(app)
        .get('/v1/users/profile')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('biography');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /v1/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/v1/users/${user.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('kk');
          done();
        })
        .catch(done);
    });
  });
});
