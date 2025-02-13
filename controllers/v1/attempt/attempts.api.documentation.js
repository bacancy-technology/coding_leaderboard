const userId = '633bbd26dc032fefe03501db';
const questionsId = '67a1cbb17c8def73caa4d051';
const attemptId = '5f9b1b3b7c8def73caa4d051';

const exampleData = {
  id: attemptId,
  type: 'attempts',
  attributes: {
    userId,
    questionsId,
    status: 'Doing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
const security = [{ ApiKeyAuth: [] }];
const tags = ['Attempts'];

exports.attemptsApiDocumentation = {
  '/api/v1/attempts': {
    get: {
      security,
      tags,
      description: 'Get all attempts',
      responses: {
        200: {
          description: 'Get all attempts',
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
    post: {
      tags,
      description: 'Attempt a question',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                questionsId: {
                  type: 'string',
                  description: 'question id',
                  example: exampleData.attributes.questionsId,
                },
                status: {
                  type: 'string',
                  description: 'Doing/Done',
                  example: exampleData.attributes.status,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Create new question',
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
                    example: 'Data updated.',
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
      },
    },
  },
};
