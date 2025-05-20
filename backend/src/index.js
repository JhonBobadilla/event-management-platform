require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const pool = require('./config/db');
const userRoutes = require('./interfaces/routes/userRoutes');
const eventRoutes = require('./interfaces/routes/eventRoutes');


const app = express();
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales (usuarios: registro y login)
app.use('/api/users', userRoutes);

// Rutas de eventos (crear, listar, etc.)
app.use('/api/events', eventRoutes); 



// Healthcheck de base de datos y servidor
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Puerto de la app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Swagger docs en http://localhost:${PORT}/api-docs`);
});



