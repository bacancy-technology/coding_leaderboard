/* eslint-disable */

jest.mock('express-openid-connect', () => ({
  auth: jest.fn().mockImplementation(() => (req, res, next) => {
    // Mock authentication behavior here
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        email: 'admin@bacancy.com',
        name: 'Test User',
        picture: 'http://example.com/picture.jpg',
        sub: 'auth0|1234567890',
      },
    };
    next();
  }),
  requiresAuth: jest.fn().mockImplementation(() => (req, res, next) => {
    // Mock authentication behavior here
    if (!req.oidc || !req.oidc.isAuthenticated()) {
      return res.status(401).send('Unauthorized');
    }
    next();
  }),
}));

const sinon = require('sinon');
const request = require('supertest');
const app = require('../../../app');
const { removeDB } = require('../../../connection/db.connect');

afterAll(async () => removeDB());

beforeEach(() => {
  sinon.restore();
  process.env.DB_PORT = 1234;
  require('../../../helpers/constants');
});

describe('Happy Path -> Leaderboards', () => {
  it('should get all leaderboards', async () => {
    const res = await request(app)
      .get('/api/v1/leaderboards');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should get attempted questions by user ID', async () => {
    const res = await request(app)
      .post('/api/v1/leaderboards/attempted_questions/507f191e810c19729de860ea');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should get my score', async () => {
    const res = await request(app)
      .get('/api/v1/leaderboards/myscore');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
