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
  let validPost = {
    title: 'test',
    description: 'test',
    layout: 'test',
    tags: ['1234']
  };
  let comment = {};
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
          validPost = res.body;
          done();
        })
        .catch(done);
    });
  });
  describe('# GET /v1/post/', () => {
    it('should get one post', (done) => {
      request(app)
        .get(`/v1/post/${validPost.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });
  describe('# GET /v1/post/', () => {
    it('should get all posts', (done) => {
      request(app)
        .get('/v1/post')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
  describe('# POST /v1/post/comment', () => {
    it('add comment to post', (done) => {
      request(app)
        .post('/v1/post/comment')
        .set('Authorization', jwtToken)
        .send({ content: 'test content', postId: validPost._id })
        .expect(httpStatus.OK)
        .then((res) => {
          comment = res.body;
          expect(res.body)
            .to.have.property('content');
          done();
        })
        .catch(done);
    });
  });
  describe('# DELETE /v1/post/comment', () => {
    it('delete comment from post', (done) => {
      request(app)
        .delete('/v1/post/comment')
        .set('Authorization', jwtToken)
        .send({ commentId: comment._id, postId: validPost._id })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('content');
          done();
        })
        .catch(done);
    });
  });
  describe('# POST /v1/post/like', () => {
    it('add like to post', (done) => {
      request(app)
        .post('/v1/post/like')
        .set('Authorization', jwtToken)
        .send({ postId: validPost._id })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('likes');
          done();
        })
        .catch(done);
    });
  });
  describe('# DELETE /v1/post/like', () => {
    it('remove like from post', (done) => {
      request(app)
        .delete('/v1/post/like')
        .set('Authorization', jwtToken)
        .send({ postId: validPost._id })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('likes');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /v1/post', () => {
    it('delete post', (done) => {
      request(app)
        .delete('/v1/post/')
        .set('Authorization', jwtToken)
        .send({ postId: validPost._id })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body._id).to.equal(validPost._id);
          done();
        })
        .catch(done);
    });
  });
});
