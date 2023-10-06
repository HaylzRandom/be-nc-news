const request = require('supertest');

const app = require('../../app');
const db = require('../../db/connection');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/comments/:comment_id', () => {
  describe('DELETE Requests', () => {
    test('DELETE:204 should respond with 204 status code when comment deleted', () => {
      return request(app).delete('/api/comments/1').expect(204);
    });
    test('DELETE:400 should return an appropriate status code and error message when given an invalid ID', () => {
      return request(app)
        .delete('/api/comments/abc')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('DELETE:404 should respond with appropriate status code and error message when comment with the ID supplied does not exist', () => {
      return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('comment_id 99999 not found');
        });
    });
  });

  describe('PATCH Requests', () => {
    test('PATCH:200 should return updated comment object', () => {
      const updatedComment = {
        inc_votes: 4,
      };

      const expectedObj = {
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 20,
        created_at: '2020-04-06T12:17:00.000Z',
      };

      return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .expect(200)
        .then((response) => {
          const { comment } = response.body;

          expect(comment).toBeObject();
          expect(comment).toMatchObject(expectedObj);
        });
    });
    test('PATCH:200 should return updated comment object with votes incremented by passed in value', () => {
      const updatedComment = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/comments/5')
        .send(updatedComment)
        .expect(200)
        .then((response) => {
          const { comment } = response.body;
          expect(comment.votes).toBe(1);
        });
    });
    test('PATCH:200 should return updated comment object with votes decremented by passed in value', () => {
      const updatedComment = {
        inc_votes: -10,
      };

      return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .expect(200)
        .then((response) => {
          const { comment } = response.body;
          expect(comment.votes).toBe(6);
        });
    });
    test('PATCH:400 should respond with appropriate status code and error message when body is missing required information', () => {
      const updatedComment = {};

      return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('PATCH:400 should respond with appropriate status code and error message when body has incorrect value types', () => {
      const updatedComment = {
        inc_votes: 'a',
      };

      return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('PATCH:400 should respond with appropriate status code and error message when passing an invalid ID', () => {
      const updatedComment = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/comments/abc')
        .send(updatedComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('PATCH:404 should respond with appropriate status code and error message when comment with ID supplied does not exist', () => {
      const updatedComment = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/comments/9999')
        .send(updatedComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('comment_id 9999 not found');
        });
    });
  });
});
