import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

describe('## POSTS APIs', () => {
  const validUserCredentials = {
    _id: '5949bdae7428fa4d772bad52',
    name: 'nameT',
    username: 'test',
    password: '1234',
    email: 'address@newtonlabs.com.gt'
  };
  let jwtToken;
  let validPost = {
    title: 'test',
    description: 'test',
    dashboard: {
      main: {
        definition: {
          name: 'tes',
          widgetType: {
            id: 1,
            name: 'Gr\u00e1fico de Pie'
          },
          entity: {
            id: 2,
            name: 'fact_adjudicacion',
            display_name: 'Adjudicaci\u00f3n',
            visible: true,
            createdAt: '2017-08-08T06:00:00.000Z',
            updatedAt: '2017-08-08T06:00:00.000Z'
          },
          filters: [
            {
              column: null,
              operation: null,
              value: null
            }
          ],
          dateFilters: [
            {
              column: null,
              operation: null,
              date1: null,
              date2: null
            }
          ],
          baseColumn: {
            id: 6,
            name: 'categoria',
            display_name: 'categor\u00eda',
            type: 1,
            base_table: 'fact_adjudicacion',
            second_table: '',
            entity_id: 2,
            createdAt: '2017-08-08T06:00:00.000Z',
            updatedAt: '2017-08-08T06:00:00.000Z'
          },
          category: {
            operation: {
              id: 1,
              name: 'Sumar',
              type: 2,
              value_type: 2,
              createdAt: '2017-08-08T06:00:00.000Z',
              updatedAt: '2017-08-08T06:00:00.000Z'
            },
            column: {
              id: 7,
              name: 'monto',
              display_name: 'Monto',
              type: 4,
              base_table: 'fact_adjudicacion',
              second_table: '',
              entity_id: 2,
              createdAt: '2017-08-08T06:00:00.000Z',
              updatedAt: '2017-08-08T06:00:00.000Z'
            }
          }
        }
      },
      first_submain: {
        data: [

        ],
        definition: {

        }
      },
      second_submain: {
        data: [

        ],
        definition: {

        }
      },
      third_submain: {
        data: [

        ],
        definition: {

        }
      }
    },
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
  describe('# GET /v1/post/like/validation/:postId/:userId', () => {
    it('Check if user can like post', (done) => {
      request(app)
        .get(`/v1/post/like/validation/${validPost._id}/${validUserCredentials._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('userId');
          expect(res.body)
            .to.have.property('canLike');
          expect(res.body.canLike)
            .to.be.true;
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

  describe('# GET /v1/post/like/validation/:postId/:userId', () => {
    it('Check if user can like post', (done) => {
      request(app)
        .get(`/v1/post/like/validation/${validPost._id}/${validUserCredentials._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('userId');
          expect(res.body)
            .to.have.property('canLike');
          expect(res.body.canLike)
            .to.be.false;
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

  describe('# POST /v1/post/tag', () => {
    it('add tag to post', (done) => {
      request(app)
        .post('/v1/post/tag')
        .set('Authorization', jwtToken)
        .send({ postId: validPost._id, tag: 'tag_test' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.tags)
            .to.be.an('array').to.include('tag_test');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /v1/post/tag', () => {
    it('remove tag from post', (done) => {
      request(app)
        .delete('/v1/post/tag')
        .set('Authorization', jwtToken)
        .send({ postId: validPost._id, tag: 'tag_test' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.post.tags)
            .to.be.an('array').to.not.include('tag_test');
          expect(res.body.removed)
            .to.be.a('number');
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
