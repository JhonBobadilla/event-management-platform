const express = require('express');
const createEvent = require('../../app/createEvent');
const authMiddleware = require('../../shared/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Crear un nuevo evento (solo organizadores)
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_evento:
 *                 type: string
 *               tipo_evento:
 *                 type: string
 *                 enum: [educativo, empresarial, deportivo, artístico]
 *               modalidad:
 *                 type: string
 *                 enum: [virtual, presencial]
 *               descripcion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono_contacto:
 *                 type: string
 *               requisitos:
 *                 type: string
 *               cupo_maximo:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No autorizado (rol incorrecto)
 */
router.post('/', authMiddleware('organizador'), async (req, res) => {
  try {
    const event = await createEvent(req.body, req.user.id);
    res.status(201).json({ message: 'Evento creado exitosamente', event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
