const adminId = '633bbd26dc032fefe03501db';
const exampleData = {
  id: '67a1cbb17c8def73caa4d051',
  type: 'questions',
  attributes: {
    title: 'Two sum',
    platform: 'LeetCode',
    difficulty: 'Easy',
    points: 1,
    visible: true,
    postedBy: adminId,
    link: 'https://leetcode.com/problems/two-sum/',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
const security = [{ ApiKeyAuth: [] }];
const tags = ['Questions'];

exports.questionsApiDocumentation = {
  '/api/v1/questions': {
    get: {
      security,
      tags,
      description: 'Get all questions',
      responses: {
        200: {
          description: 'Get all questions',
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
      description: 'Create new question',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'title of the problem',
                  example: exampleData.attributes.title,
                },
                platform: {
                  type: 'string',
                  description: 'platform of the problem',
                  example: exampleData.attributes.platform,
                },
                difficulty: {
                  type: 'string',
                  description: 'Easy/Medium/Hard',
                  example: exampleData.attributes.difficulty,
                },
                points: {
                  type: 'number',
                  description: 'Easy: 1, Medium: 2, Hard: 3',
                  example: exampleData.attributes.points,
                },
                visible: {
                  type: 'boolean',
                  description: 'visibility of the question',
                  example: true,
                },
                link: {
                  type: 'string',
                  description: 'link to the problem',
                  example: exampleData.attributes.link,
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
  '/api/v1/questions/{questionsId}': {
    get: {
      security,
      tags,
      description: 'Find question by id',
      parameters: [
        {
          in: 'path',
          name: 'questionsId',
          schema: {
            type: 'string',
            example: exampleData.id,
          },
          required: true,
          description: '_id of the question',
        },
      ],
      responses: {
        200: {
          description: 'Find question by id',
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
    delete: {
      security,
      tags,
      description: 'Delete question by id',
      parameters: [
        {
          in: 'path',
          name: 'questionsId',
          schema: {
            type: 'string',
            example: exampleData.id,
          },
          required: true,
          description: '_id of the question',
        },
      ],
      responses: {
        200: {
          description: 'Delete question by id',
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
                    example: 'Data deleted.',
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
    put: {
      security,
      tags,
      description: 'Update question by id',
      parameters: [
        {
          in: 'path',
          name: 'questionsId',
          schema: {
            type: 'string',
            example: exampleData.id,
          },
          required: true,
          description: '_id of the question',
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'title of the problem',
                  example: exampleData.attributes.title,
                },
                platform: {
                  type: 'string',
                  description: 'platform of the problem',
                  example: exampleData.attributes.platform,
                },
                difficulty: {
                  type: 'string',
                  description: 'Easy/Medium/Hard',
                  example: exampleData.attributes.difficulty,
                },
                points: {
                  type: 'number',
                  description: 'Easy: 1, Medium: 2, Hard: 3',
                  example: exampleData.attributes.points,
                },
                visible: {
                  type: 'boolean',
                  description: 'visibility of the question',
                  example: true,
                },
                link: {
                  type: 'string',
                  description: 'link to the problem',
                  example: exampleData.attributes.link,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Update question by id',
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
