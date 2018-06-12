import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## Stats APIs', () => {
  let validUserCredentials = {
    name: 'nameT',
    username: 'test',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };


  let jwtToken;
  describe('# POST /api/auth/login', () => {
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
            validUserCredentials = {
              id: decoded.id,
              ...validUserCredentials
            };
            done();
          });
        })
        .catch(done);
    });
  });

  describe('# GET /v1/stats/user/:userId', () => {
    it('should get a user stats', (done) => {
      request(app)
        .get(`/v1/stats/user/${validUserCredentials.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('followers');
          expect(res.body).to.have.property('following');
          expect(res.body).to.have.property('posts');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/stats/posts/top', () => {
    it('get top posts', (done) => {
      request(app)
        .get('/v1/stats/posts/top')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
});
