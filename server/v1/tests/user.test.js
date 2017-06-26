import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## User APIs', () => {
  let user = {
    username: 'kk123',
    email: 'test@test.com',
    password: '1234'
  };
  const validUserCredentials = {
    username: 'kk123',
    email: 'test@test.com',
    password: '1234',
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
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.username).to.equal(validUserCredentials.username);
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
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

  describe('# POST /v1/users/:userId/password/change', () => {
    it('should change password', (done) => {
      user.password = '1234';
      request(app)
        .post('/v1/users/password/change')
        .send(user)
        .then((res) => {
          expect(res.body).to.equal('Password changed');
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
