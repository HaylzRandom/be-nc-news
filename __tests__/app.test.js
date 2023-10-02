const request = require('supertest');

const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

const endpointData = require('../endpoints.json');

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
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        const endpoints = response.body;

        expect(endpoints).toEqual(endpointData);
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

describe('/api/articles/:article_id', () => {
  /* 
    - GET
    - respond with 200 status code
    - respond with 404 when article with ID cannot be found
    - respond with 400 when sending an invalid ID
  */
  test('GET:200 should return a single article object to client', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.article_id).toBe(1);
        expect(typeof article.article_id).toBe('number');
        expect(article.topic).toBe('mitch');
        expect(typeof article.topic).toBe('string');
        expect(article.author).toBe('butter_bridge');
        expect(typeof article.author).toBe('string');
        expect(article.votes).toBe(100);
        expect(typeof article.votes).toBe('number');
      });
  });
  test('GET:404 should return an appropriate status code and error message when given a valid but non-existant article ID', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
  test('GET:400 should return an appropriate status code and error message when given a valid but non-existant article ID', () => {
    return request(app)
      .get('/api/articles/a')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});
