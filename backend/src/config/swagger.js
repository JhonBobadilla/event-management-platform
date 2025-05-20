const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plataforma de Gestión de Eventos',
      version: '1.0.0',
      description: 'API REST para la gestión de usuarios, autenticación, eventos y reservas.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths a archivos de rutas/controladores con comentarios Swagger
  apis: [
    './src/interfaces/routes/userRoutes.js',
    './src/interfaces/routes/eventRoutes.js',
    './src/interfaces/routes/reservationRoutes.js', 
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;



