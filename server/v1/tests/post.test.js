import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## POSTS APIs', () => {
  const validUserCredentials = {
    username: 'test',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };
  let jwtToken;
  const validPost = {
    title: 'test',
    description: 'test',
    layout: 'test',
    tags: ['1234']
  };
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
  describe('# POST /v1/post/', () => {
    it('Create new POST', (done) => {
      request(app)
        .post('/v1/post')
        .set('Authorization', jwtToken)
        .send(validPost)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('user');
          expect(res.body)
            .to.have.property('title');
          expect(res.body)
            .to.have.property('description');
          expect(res.body)
            .to.have.property('tags');
          done();
        })
        .catch(done);
    });
  });
});
