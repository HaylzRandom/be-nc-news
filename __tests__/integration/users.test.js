const request = require('supertest');

const app = require('../../app');
const db = require('../../db/connection');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/users', () => {
  describe('GET Requests', () => {
    test('GET:200 should return an array of user objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          const { users } = response.body;

          expect(users).toHaveLength(4);

          expect(users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              }),
            ])
          );
        });
    });
    test('GET:404 should respond with appropriate status code and error message when path incorrect', () => {
      return request(app)
        .get('/api/user')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path Not Found');
        });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET Requests', () => {
    test('GET:200 should return a single user object to client', () => {
      const expectedObj = {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      };

      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then((response) => {
          const { user } = response.body;

          expect(user).toBeObject();
          expect(user).toMatchObject(expectedObj);
        });
    });
    test('GET:404 should respond with appropriate status code and error message when user with a username does not exist', () => {
      return request(app)
        .get('/api/users/does-not-exist')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('username does-not-exist not found');
        });
    });
  });
});
