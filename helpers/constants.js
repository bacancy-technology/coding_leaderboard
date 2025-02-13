require('dotenv').config();

exports.envConstants = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 27017,
  DB_NAME: process.env.DB_NAME || 'test_db',
  DB_PASS: process.env.DB_PASS,
  DB_USER: process.env.DB_USER,
  DB_DIALECT: process.env.DB_DIALECT || 'mongodb',
  DB_DEBUG_MODE: process.env.DB_DEBUG_MODE || 'false',
  APP_HOST: process.env.APP_HOST || 'http://localhost',
  APP_PORT: process.env.APP_PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'dev',
  AUTHENTICATION: process.env.AUTHENTICATION || 'false',
  AUTH0_SECRET: process.env.AUTH0_SECRET || 'test_secret',
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || 'http://localhost:4000',
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'test_client_id',
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'test_domain',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || 'admin@bacancy.com',
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
};
