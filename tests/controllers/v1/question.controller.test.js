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

let questionId;

afterAll(async () => removeDB());

beforeEach(async () => {
  sinon.restore();
  process.env.DB_PORT = 1234;
  require('../../../helpers/constants');

  // Create a default question
  const res = await request(app)
    .post('/api/v1/questions')
    .send({
      title: 'Sample Question',
      platform: 'LeetCode',
      difficulty: 'Easy',
      points: 10,
      visible: true,
      link: 'http://example.com/question',
    });
  questionId = res.body.data[0].id;
});

describe('Happy Path -> Questions', () => {
  it('should get all questions', async () => {
    const res = await request(app)
      .get('/api/v1/questions');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should create a new question', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .send({
        title: 'Another Question',
        platform: 'HackerRank',
        difficulty: 'Medium',
        points: 20,
        visible: true,
        link: 'http://example.com/another-question',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should get a question by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/${questionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should update a question by ID', async () => {
    const res = await request(app)
      .put(`/api/v1/questions/${questionId}`)
      .send({
        title: 'Updated Question',
        platform: 'LeetCode',
        difficulty: 'Medium',
        points: 20,
        visible: true,
        link: 'http://example.com/updated-question',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should delete a question by ID', async () => {
    const res = await request(app)
      .delete(`/api/v1/questions/${questionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
