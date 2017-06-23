import request from 'supertest';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import chai, { expect } from 'chai';
import app from '../../../index';

chai.config.includeStack = true;

describe('## User APIs', () => {
  let user = {
    username: 'kk123',
    email: 'test@test.com',
    password: '1234'
  };

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
  });

  describe('# GET /v1/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/v1/users/${user.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get(`/v1/users/${mongoose.Types.ObjectId()}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('User id does not exist');
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
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('kk');
          done();
        })
        .catch(done);
    });
  });
});
