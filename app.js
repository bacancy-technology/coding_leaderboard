const cors = require('cors');
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./api_docs');
const dbConn = require('./connection/db.connect');
const { envConstants } = require('./helpers/constants');

const app = express();
const { getROLES } = require('./middleware/middleware');

dbConn.connect();

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: envConstants.AUTH0_SECRET,
  baseURL: envConstants.AUTH0_BASE_URL,
  clientID: envConstants.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${envConstants.AUTH0_DOMAIN}.auth0.com`,
};
app.use(auth(config));

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(logger('common', { skip: () => process.env.NODE_ENV === 'test' }));

app.use('/custom-swagger-ui.css', express.static('./public/custom-swagger-ui.css'));
app.use('/js/dashboard.js', express.static('./public/js/dashboard.js'));
app.use('/default-user-icon.png', express.static('./public/default-user-icon.png'));

const swaggerOptions = {
  customCssUrl: '/custom-swagger-ui.css',
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation, swaggerOptions));

app.get('/callback', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.sendFile(`${__dirname}/public/index.html`);
  } else {
    res.sendFile(`${__dirname}/public/dashboard.html`);
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/error', (req, res) => {
  res.sendFile(`${__dirname}/public/error.html`);
});

app.use(requiresAuth());

getROLES(); // to generate the ROLE object for role based authentication/authorization

require('./routes/routing').routes(app);

module.exports = app;
