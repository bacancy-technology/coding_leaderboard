/* eslint-disable */

jest.mock('express-openid-connect', () => ({
  auth: jest.fn().mockImplementation(() => (req, res, next) => {
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

describe('Happy Path -> Attempts', () => {
  it('should create a new attempt', async () => {
    const res = await request(app)
      .post('/api/v1/attempts')
      .send({
        questionsId: '507f191e810c19729de860ea',
        status: 'Doing',
      });
    expect(res.statusCode).toBe(200);
  });

  it('should retry to update status', async () => {
    const res = await request(app)
      .post('/api/v1/attempts')
      .send({
        questionsId: '507f191e810c19729de860ea',
        status: 'Done',
      });
    expect(res.statusCode).toBe(200);
  });

  it('should get attempts by question ID', async () => {
    const res = await request(app)
      .get('/api/v1/attempts/507f191e810c19729de860ea');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should get attempts by user ID', async () => {
    const res = await request(app)
      .get('/api/v1/attempts/507f191e810c19729de860ea');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should get all attempts', async () => {
    const res = await request(app)
      .get('/api/v1/attempts')
      .send({
        usersId: '507f191e810c19729de860ea',
        questionsId: '507f191e810c19729de860ea',
        status: 'Done',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
