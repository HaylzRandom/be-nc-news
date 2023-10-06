const request = require('supertest');

const app = require('../../app');
const db = require('../../db/connection');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () => {
  describe('GET Requests', () => {
    test('GET:200 should send an array of all topics to the client', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
          const { topics } = response.body;

          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');
          });
        });
    });
    test('GET:404 should respond with approriate error status code and error message when path does not exist', () => {
      return request(app)
        .get('/api/topic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path Not Found');
        });
    });
  });
  describe('POST Requests', () => {
    test('POST:201 should return newly created topic', () => {
      const newTopic = {
        slug: 'topicName',
        description: 'This is a topic description...',
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((response) => {
          const { topic } = response.body;

          expect(topic).toBeObject();

          expect(topic).toEqual({
            slug: 'topicName',
            description: 'This is a topic description...',
          });
        });
    });
    test('POST:201 should return newly created topic when no description is passed', () => {
      const newTopic = {
        slug: 'topicName',
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((response) => {
          const { topic } = response.body;

          expect(topic).toBeObject();

          expect(topic).toEqual({
            slug: 'topicName',
            description: null,
          });
        });
    });
    test('POST:400 should respond with appropriate status code and error message when body is missing required information', () => {
      const newTopic = {
        description: 'This is a topic description...',
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('POST:400 should respond with appropriate status code and error message when body sends incorrect parameter', () => {
      const newTopic = {
        topic: 'topicName',
        description: 'This is a description...',
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('POST:409 should respond with appropriate status code and error message when sent a topic that already exists', () => {
      const newTopic = {
        slug: 'cats',
        description: 'Yet another topic description...',
      };

      return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(409)
        .then(({ body }) => {
          expect(body.msg).toBe('Topic already exists');
        });
    });
  });
});
