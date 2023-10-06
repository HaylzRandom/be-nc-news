const request = require('supertest');

const app = require('../../app');
const db = require('../../db/connection');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data');
beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/articles', () => {
  describe('GET Requests', () => {
    describe('Basic Queries', () => {
      test('GET:200 should send an array of all articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((response) => {
            const { articles } = response.body;

            expect(articles).toHaveLength(10); // With pagination included this is now a length of 10 rather than 13

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
      test('GET:404 should respond with approriate error status code and error message when path does not exist', () => {
        return request(app)
          .get('/api/articl3s')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Path Not Found');
          });
      });
    });

    describe('Pagination Queries', () => {
      test('GET:200 should send an array of articles pagninated and limited by 10 as a default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((response) => {
            const { articles, count } = response.body;
            expect(articles).toHaveLength(10);
            expect(count.total_count).toBe(13);
          });
      });
      test('GET:200 should send an array of articles paginated and limited by query', () => {
        return request(app)
          .get('/api/articles?limit=5')
          .expect(200)
          .then((response) => {
            const { articles, count } = response.body;
            expect(articles).toHaveLength(5);
            expect(count.total_count).toBe(13);
          });
      });
      test('GET:200 should send an array of articles that are paginated and offset', () => {
        return request(app)
          .get('/api/articles?p=2')
          .expect(200)
          .then((response) => {
            const { articles } = response.body;

            const firstArticle = articles[0];

            expect(articles).toHaveLength(3);
            expect(firstArticle.article_id).not.toBe(3);
            expect(firstArticle.article_id).toBe(8);
          });
      });
      test('GET:400 should respond with appropriate error status code and error message when passed a limit query that is invalid', () => {
        return request(app)
          .get('/api/articles?limit=b')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query Passed');
          });
      });
      test('GET:400 should respond with appropriate error status code and error message when passed a page query that is invalid', () => {
        return request(app)
          .get('/api/articles?p=page')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query Passed');
          });
      });
    });

    describe('Order By Queries', () => {
      test('GET:200 should send array ordered by date in descending order', () => {
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
      test('GET:200 should send array ordered by date in ascending order when passed as a query', () => {
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
    });

    describe('Sort By Queries', () => {
      test('GET:200 should send array sorted by created_at', () => {
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
      test('GET:200 should send array sorted by column passed in query', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id')
          .then((response) => {
            const { articles } = response.body;

            expect(articles).toBeSortedBy('article_id', {
              descending: true,
            });
          });
      });
      test('GET:200 should send array sorted by column and order by query passed in', () => {
        return request(app)
          .get('/api/articles?sort_by=topic&order=asc')
          .then((response) => {
            const { articles } = response.body;

            expect(articles).toBeSortedBy('topic', {
              ascending: true,
            });
          });
      });
      test('GET:400 should respond with appropriate error status code and error message when passed an sort by query that is invalid', () => {
        return request(app)
          .get('/api/articles?sort_by=cheese')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query Passed');
          });
      });
    });

    describe('Filter by Topic Queries', () => {
      test('GET:200 should send array of articles filtered by topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .then((response) => {
            const { articles } = response.body;

            expect(articles).toHaveLength(10);
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

            expect(articles).toHaveLength(10);
            expect(articles).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });

      test('GET:400 should respond with appropriate error status code and error message when passed a topic query that is invalid', () => {
        return request(app)
          .get('/api/articles?topic=1')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query Passed');
          });
      });
      test('GET:404 should respond with appropriate error status code and error message when passed a topic that does not exist', () => {
        return request(app)
          .get('/api/articles?topic=banana')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Topic does not exist');
          });
      });
    });
  });
  describe('POST Requests', () => {
    test('POST:201 should return newly created article object', () => {
      const newArticle = {
        author: 'lurker',
        title: 'Test article...',
        body: 'Test Article body...',
        topic: 'cats',
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then((response) => {
          const { article } = response.body;

          expect(article).toBeObject();

          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
    });
    test('POST:201 should return newly created artile object without default article_img_url', () => {
      const newArticle = {
        author: 'lurker',
        title: 'Test article...',
        body: 'Test Article body...',
        topic: 'cats',
        article_img_url: 'https://www.google.com/catpic',
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then((response) => {
          const { article } = response.body;

          expect(article.article_img_url).not.toBe(
            'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
          );
          expect(article.article_img_url).toBe('https://www.google.com/catpic');
        });
    });
    test('POST:400 should respond with appropriate status code and error message when body is missing required information', () => {
      const newArticle = {
        author: 'lurker',
        title: 'Test article...',
        body: 'Test Article body...',
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('POST:400 should respond with appropriate status code and error message when body sends incorrect parameter', () => {
      const newArticle = {
        username: 'lurker',
        title: 'Test article...',
        body: 'Test Article body...',
        topic: 'cats',
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('POST:400 should respond with appropriate status code and error message when author does not exist', () => {
      const newArticle = {
        author: 'unknownUser',
        title: 'Test article...',
        body: 'Test Article body...',
        topic: 'cats',
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .then(({ body }) => {
          expect(body.msg).toBe('username unknownUser not found');
        });
    });
    test('POST:400 should respond with appropriate status code and error message when topic does not exist', () => {
      const newArticle = {
        author: 'lurker',
        title: 'Test article...',
        body: 'Test Article body...',
        topic: 'notATopic',
      };

      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .then(({ body }) => {
          expect(body.msg).toBe('slug notATopic not found');
        });
    });
  });
});

describe('/api/articles/:article_id', () => {
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
        comment_count: 11,
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
  describe('PATCH Requests', () => {
    test('PATCH:200 should return updated article object', () => {
      const updatedArticle = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(200)
        .then((response) => {
          const { article } = response.body;

          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );

          expect(article.votes).toBe(101);
        });
    });
    test('PATCH:200 should return updated article object with votes incremented by passed in value', () => {
      const updatedArticle = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/articles/13')
        .send(updatedArticle)
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article.votes).toBe(1);
        });
    });
    test('PATCH:200 should return updated article object with votes decremented by passed in value', () => {
      const updatedArticle = {
        inc_votes: -50,
      };

      return request(app)
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article.votes).toBe(50);
        });
    });
    test('PATCH:400 should respond with appropriate status code and error message when body is missing required information', () => {
      const updatedArticle = {};

      return request(app)
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Required information is missing');
        });
    });
    test('PATCH:400 should respond with appropriate status code and error message when body has incorrect value types', () => {
      const updatedArticle = {
        inc_votes: 'a',
      };

      return request(app)
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('PATCH:400 should respond with appropriate status code and error message when passing an invalid ID', () => {
      const updatedArticle = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/articles/abc')
        .send(updatedArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('PATCH:404 should respond with appropriate status code and error message when article with ID supplied does not exist', () => {
      const updatedArticle = {
        inc_votes: 1,
      };

      return request(app)
        .patch('/api/articles/9999')
        .send(updatedArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('article_id 9999 not found');
        });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET Requests', () => {
    describe('Basic Queries', () => {
      test('GET:200 should return an array of comments for a given article', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((response) => {
            const { comments } = response.body;

            expect(comments).toHaveLength(10);
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

    describe('Pagination Queries', () => {
      test('GET:200 should send an array of comments pagninated and limited by 10 as a default', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((response) => {
            const { comments } = response.body;
            expect(comments).toHaveLength(10);
          });
      });
      test('GET:200 should send an array of articles paginated and limited by query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then((response) => {
            const { comments } = response.body;
            expect(comments).toHaveLength(5);
          });
      });
      test('GET:200 should send an array of articles that are paginated and offset', () => {
        return request(app)
          .get('/api/articles/1/comments?p=2')
          .expect(200)
          .then((response) => {
            const { comments } = response.body;

            const firstComment = comments[0];

            expect(comments).toHaveLength(1);
            expect(firstComment.comment_id).not.toBe(5);
            expect(firstComment.comment_id).toBe(9);
          });
      });
      test('GET:400 should respond with appropriate error status code and error message when passed a limit query that is invalid', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=b')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query Passed');
          });
      });
      test('GET:400 should respond with appropriate error status code and error message when passed a page query that is invalid', () => {
        return request(app)
          .get('/api/articles/1/comments?p=page')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query Passed');
          });
      });
    });
  });
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
