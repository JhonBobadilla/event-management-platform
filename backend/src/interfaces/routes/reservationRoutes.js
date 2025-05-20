const express = require('express');
const createReservation = require('../../app/createReservation');
const getReservationsByUser = require('../../app/getReservationsByUser');
const cancelReservation = require('../../app/cancelReservation');
const authMiddleware = require('../../shared/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Reservar un espacio en un evento (solo usuarios)
 *     tags:
 *       - Reservas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Error en los datos o reservas duplicadas
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No autorizado (rol incorrecto)
 */
router.post('/', authMiddleware('usuario'), async (req, res) => {
  try {
    const reservation = await createReservation({ user_id: req.user.id, event_id: req.body.event_id });
    res.status(201).json({ message: 'Reserva creada exitosamente', reservation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtener las reservas del usuario autenticado
 *     tags:
 *       - Reservas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fecha_reserva:
 *                     type: string
 *                     format: date-time
 *                   id:
 *                     type: integer
 *                   nombre_evento:
 *                     type: string
 *                   tipo_evento:
 *                     type: string
 *                   modalidad:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   ciudad:
 *                     type: string
 *                   direccion:
 *                     type: string
 *                   telefono_contacto:
 *                     type: string
 *                   requisitos:
 *                     type: string
 *                   cupo_maximo:
 *                     type: integer
 *                   cupo_actual:
 *                     type: integer
 *                   estado:
 *                     type: string
 *                   organizador_id:
 *                     type: integer
 *                   creado_en:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No autorizado (rol incorrecto)
 */
router.get('/', authMiddleware('usuario'), async (req, res) => {
  try {
    const reservations = await getReservationsByUser(req.user.id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancelar una reserva (solo usuarios)
 *     tags:
 *       - Reservas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la reserva a cancelar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada correctamente
 *       400:
 *         description: Reserva no encontrada o no tienes permisos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No autorizado (rol incorrecto)
 */
router.delete('/:id', authMiddleware('usuario'), async (req, res) => {
  try {
    const deleted = await cancelReservation(req.params.id, req.user.id);
    res.json({ message: 'Reserva cancelada', reservation: deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
