/* eslint-disable */
const request = require('supertest');
const app = require('../app');
const { removeDB } = require('../connection/db.connect');

// Mock with internal state management
const mockAuth = {
  authenticated: false,
};

jest.mock('express-openid-connect', () => ({
  auth: jest.fn().mockImplementation(() => (req, res, next) => {
    req.oidc = {
      isAuthenticated: () => mockAuth.authenticated,
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

afterAll(async () => removeDB());

describe('App Routes', () => {
  it('should send index.html when user is not authenticated', async () => {
    mockAuth.authenticated = false;
    const res = await request(app)
      .get('/');
    expect(res.statusCode).toBe(200);
  });

  it('should send dashboard.html when user is authenticated', async () => {
    mockAuth.authenticated = true;
    const res = await request(app)
      .get('/');
    expect(res.statusCode).toBe(200);
  });
});


