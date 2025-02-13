module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Leaderboard APIs',
    description: 'Built this web app to encourage my team members to participate in the weekly challenges and to keep track of their progress.',
    contact: {
      name: 'Franklin P. Thaker',
      email: 'Jarvisfranklinthaker@gmail.com',
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
  },
};
