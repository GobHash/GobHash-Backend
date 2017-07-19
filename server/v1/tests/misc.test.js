import request from 'supertest';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## Misc', () => {
  const validUserCredentials = {
    username: 'test',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };
  let jwtToken;
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
  describe('# GET /v1/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/v1/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/v1/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/v1/users/ajsdkfjaklsdjfkajsd')
        .set('Authorization', jwtToken)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - username is required', (done) => {
      request(app)
        .post('/v1/users')
        .set('Authorization', jwtToken)
        .send({
          email: 'test@test.com',
          password: '1234'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('"username" is required');
          done();
        })
        .catch(done);
    });
  });
});
