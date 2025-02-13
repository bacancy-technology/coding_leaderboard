const userId = '633bbd26dc032fefe03501db';
const leaderboardId = '5f9b1b3b7c8def73caa4d051';

const exampleData = {
  id: leaderboardId,
  type: 'leaderboards',
  attributes: {
    userId,
    score: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
const security = [{ ApiKeyAuth: [] }];
const tags = ['Leaderboards'];

exports.leaderboardsApiDocumentation = {
  '/api/v1/leaderboards': {
    get: {
      security,
      tags,
      description: 'Leaderboard',
      responses: {
        200: {
          description: 'Leaderboard',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    description: 'HTTP Status Code',
                    example: 200,
                  },
                  success: {
                    type: 'boolean',
                    description: 'success/failure',
                    example: true,
                  },
                  message: {
                    type: 'string',
                    description: 'API Message',
                    example: 'Data fetched.',
                  },
                  data: {
                    type: 'array',
                    description: 'data returned from the API',
                    example: [exampleData],
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
        401: {
          description: 'Authentication/Authorization error',
        },
      },
    },
  },
};
