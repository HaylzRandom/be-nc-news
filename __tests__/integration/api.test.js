const request = require('supertest');

const app = require('../../app');
const db = require('../../db/connection');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data');

const endpointData = require('../../endpoints.json');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api', () => {
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
