const request = require('supertest');

const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () => {
  /* 
        - GET
        - respond with 200 status code
        - respond 404 when incorrect path sent
    */
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

describe('/api', () => {
  /* 
        - GET
        - respond with 200 status code
        - respond with 404 when path not found/misspelled
  */
  test('GET:200 should respond with an object describing all available endpoints', () => {
    // TODO - Figure out a way to do this dynamically
    const endpointsExpected = {
      'GET /api': {
        description:
          'serves up a json representation of all the available endpoints of the api',
      },
      'GET /api/topics': {
        description: 'serves an array of all topics',
        queries: [],
        exampleResponse: {
          topics: [{ slug: 'football', description: 'Footie!' }],
        },
      },
      'GET /api/articles': {
        description: 'serves an array of all articles',
        queries: ['author', 'topic', 'sort_by', 'order'],
        exampleResponse: {
          articles: [
            {
              title: 'Seafood substitutions are increasing',
              topic: 'cooking',
              author: 'weegembump',
              body: 'Text from the article..',
              created_at: '2018-05-30T15:59:13.341Z',
              votes: 0,
              comment_count: 6,
            },
          ],
        },
      },
    };

    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        const endpoints = response.body;

        expect(endpoints).toEqual(endpointsExpected);
      });
  });
  test('GET:404 should respond with approriate error status code and error message when path does not exist', () => {
    return request(app)
      .get('/apis')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path Not Found');
      });
  });
});
