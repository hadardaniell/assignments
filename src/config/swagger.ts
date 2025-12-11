// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe API',
      version: '1.0.0',
      description: 'API documentation for the Recipe project',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
