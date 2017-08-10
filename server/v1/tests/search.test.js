import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## Search APIs', () => {
  const validUserCredentials = {
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
            done();
          });
        })
        .catch(done);
    });
  });

  describe('# GET /v1/search/users', () => {
    it('should find user by username', (done) => {
      request(app)
        .get('/v1/search/users')
        .set('Authorization', jwtToken)
        .query({ username: validUserCredentials.username, name: validUserCredentials.name })
        .expect(httpStatus.OK)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/search/users', () => {
    it('should find user by name', (done) => {
      request(app)
        .get('/v1/search/users')
        .set('Authorization', jwtToken)
        .query({ username: 'notFound', name: validUserCredentials.name })
        .expect(httpStatus.OK)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/search/users', () => {
    it('should not find user', (done) => {
      request(app)
        .get('/v1/search/users')
        .set('Authorization', jwtToken)
        .query({ username: 'notFound', name: 'notFound' })
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });
});
