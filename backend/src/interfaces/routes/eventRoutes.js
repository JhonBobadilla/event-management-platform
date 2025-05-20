const express = require('express');
const createEvent = require('../../app/createEvent');
const getEventsByOrganizer = require('../../app/getEventsByOrganizer');
const updateEvent = require('../../app/updateEvent');
const deleteEvent = require('../../app/deleteEvent');
const getAvailableEvents = require('../../app/getAvailableEvents');
const authMiddleware = require('../../shared/authMiddleware');

// --- EXCEL UPLOAD DEPENDENCIAS Y CASO DE USO ---
const multer = require('multer');
const processExcelEvents = require('../../app/processExcelEvents'); // <-- Implementa este caso de uso

const router = express.Router();

// Configuración de Multer para archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

/**
 * @swagger
 * /api/events/upload-excel:
 *   post:
 *     summary: Cargar múltiples eventos por archivo Excel (.xlsx) (solo organizadores)
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel (.xlsx) con los eventos.
 *     responses:
 *       200:
 *         description: Resumen de la carga de eventos.
 *       400:
 *         description: Archivo inválido o errores en los datos.
 *       401:
 *         description: No autorizado.
 */
router.post(
  '/upload-excel',
  authMiddleware('organizador'),
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Debe adjuntar un archivo Excel.' });
    }
    try {
      const organizadorId = req.user.id;
      const resumen = await processExcelEvents(req.file.buffer, organizadorId);
      res.status(200).json(resumen);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtiene la lista de eventos del organizador autenticado
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos creada por el organizador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
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
 *         description: No autorizado
 */
router.get('/', authMiddleware('organizador'), async (req, res) => {
  try {
    const events = await getEventsByOrganizer(req.user.id);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Actualizar un evento existente (solo organizadores)
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del evento a actualizar
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: Evento actualizado correctamente
 *       400:
 *         description: Datos inválidos o evento no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No autorizado (rol incorrecto)
 */
router.put('/:id', authMiddleware('organizador'), async (req, res) => {
  try {
    const updatedEvent = await updateEvent(req.params.id, req.user.id, req.body);
    res.json({ message: 'Evento actualizado', event: updatedEvent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Eliminar un evento existente (solo organizadores)
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del evento a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento eliminado correctamente
 *       400:
 *         description: Evento no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No autorizado (rol incorrecto)
 */
router.delete('/:id', authMiddleware('organizador'), async (req, res) => {
  try {
    const deletedEvent = await deleteEvent(req.params.id, req.user.id);
    res.json({ message: 'Evento eliminado', event: deletedEvent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/events/public:
 *   get:
 *     summary: Lista de eventos disponibles para usuarios
 *     tags:
 *       - Eventos
 *     responses:
 *       200:
 *         description: Lista de eventos disponibles para reserva
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
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
 */
router.get('/public', async (req, res) => {
  try {
    const events = await getAvailableEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


