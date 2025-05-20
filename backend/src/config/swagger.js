// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plataforma de Eventos API',
      version: '1.0.0',
      description: 'API para la gestión de eventos (Node.js + PostgreSQL)',
    },
  },
  apis: ['./src/interfaces/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
