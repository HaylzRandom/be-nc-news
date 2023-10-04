const request = require('supertest');

const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

const endpointData = require('../endpoints.json');
const { expect } = require('@jest/globals');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api', () => {
  /* 
        - GET
        - respond with 200 status code
        - respond with 404 when path not found/misspelled
  */
  describe('GET Requests', () => {
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
});

describe('/api/topics', () => {
  /* 
        - GET
        - respond with 200 status code
        - respond 404 when incorrect path sent
  */
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
});

describe('/api/articles', () => {
  /* 
        - GET
        - respond with 200 status code
        - respond with 200 status code and array order by date in descending order
        - respond with 200 status code and array of articles filtered by topic
        - respond with 200 status code and array of all articles when no topic query passed
        - respond with 400 status code when passed an invalid sort query
        - respond with 404 status code when passed a topic that does not exist
        - respond with 404 when path not found/misspelled
        
  */
  describe('GET Requests', () => {
    test('GET:200 should send an array of all articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          const { articles } = response.body;

          expect(articles).toHaveLength(13);

          articles.forEach((article) => {
            expect(typeof article.article_id).toBe('number');
            expect(typeof article.author).toBe('string');
            expect(typeof article.title).toBe('string');
            expect(typeof article.topic).toBe('string');
            expect(typeof article.created_at).toBe('string');
            expect(typeof article.votes).toBe('number');
            expect(typeof article.article_img_url).toBe('string');
            expect(typeof article.comment_count).toBe('number');
            expect(article).not.toHaveProperty('body');
          });
        });
    });
    test('GET:200 should send array sorted by date in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          const { articles } = response.body;

          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    test('GET:200 should send array of articles filtered by topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .then((response) => {
          const { articles } = response.body;

          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    test('GET:200 should send array of all articles when no topic is sent as a query', () => {
      return request(app)
        .get('/api/articles')
        .then((response) => {
          const { articles } = response.body;

          expect(articles).toHaveLength(13);
          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    test('GET:200 should send array sorted by date in ascending order when passed as a query', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .then((response) => {
          const { articles } = response.body;

          expect(articles).toBeSortedBy('created_at', {
            ascending: true,
          });
        });
    });
    test('GET:400 should respond with appropriate error status code and error message when passed an order query that is invalid', () => {
      return request(app)
        .get('/api/articles?order=1')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Query Passed');
        });
    });
    test('GET:404 should respond with appropriate error status code and error message when passed a topic that does not exist', () => {
      return request(app)
        .get('/api/articles?topic=1')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Topic does not exist');
        });
    });
    test('GET:404 should respond with approriate error status code and error message when path does not exist', () => {
      return request(app)
        .get('/api/articl3s')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path Not Found');
        });
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
  describe('GET Requests', () => {
    test('GET:200 should return a single article object to client', () => {
      const expectedObj = {
        article_id: 1,
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      };

      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toMatchObject(expectedObj);
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
    test('GET:400 should return an appropriate status code and error message when given an invalid ID that is not a number', () => {
      return request(app)
        .get('/api/articles/a')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  /* 
    - GET
    - respond with 200 status
    - respond with 200 if article is found but no comments exist
    - respond with 404 when no article found with article_id
    - respond with 400 when passing an invalid ID
  */
  describe('GET Requests', () => {
    test('GET:200 should return an array of comments for a given article', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          const { comments } = response.body;

          expect(comments).toHaveLength(11);
          expect(comments).toBeSortedBy('created_at', {
            descending: true,
          });
          expect(comments).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              }),
            ])
          );
        });
    });
    test('GET:200 should return array of comments sorted by date in descending order', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          const { comments } = response.body;

          expect(comments).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    test('GET:200 should respond with appropriate message and status code when article exists but has no comments', () => {
      return request(app)
        .get('/api/articles/12/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toBe('No comments found for article');
        });
    });
    test('GET:404 should respond with appropriate status code and error message when article with the ID supplied does not exist', () => {
      return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('article_id 9999 not found');
        });
    });
    test('GET:400 should return an appropriate status code and error message when given an invalid ID that is not a number', () => {
      return request(app)
        .get('/api/articles/a/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
  });
  /* 
    - POST
    - respond with 201 with new comment created
    - respond with 400 when passing an invalid ID
    - respond with 400 when not passing all required information
    - respond with 404 when no article found with article_id 
    - respond with 404 when user does not exist in users 
  */
  describe('POST Requests', () => {
    test('POST:201 should return newly created comment as an object', () => {
      const newComment = {
        username: 'lurker',
        body: 'This is a comment...',
      };

      return request(app)
        .post('/api/articles/11/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
          const { comment } = response.body;

          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );

          expect(comment.comment_id).toBe(19);
        });
    });
    test('POST:400 should respond with appropriate status code and error message when passing an invalid ID', () => {
      const newComment = {
        username: 'lurker',
        body: 'This is a comment...',
      };

      return request(app)
        .post('/api/articles/abc/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('POST:400 should respond with appropriate status code and error message when body is missing information', () => {
      const newComment = {
        username: 'errorUser',
      };

      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('POST:404 should respond with appropriate status code and error message when article with the ID supplied does not exist', () => {
      const newComment = {
        username: 'lurker',
        body: 'This is a comment...',
      };

      return request(app)
        .post('/api/articles/999999/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('article_id 999999 not found');
        });
    });
    test('POST:404 should respond with appropriate status code and error message when user who does not exist tries to post', () => {
      const newComment = {
        username: 'newUser',
        body: 'This is a comment...',
      };

      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('username newUser not found');
        });
    });
  });
});
