const pool = require('../config/db');

/**
 * Crea un nuevo evento asociado a un organizador
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<Object>} Evento creado
 */
const createEvent = async (eventData) => {
  const {
    nombre_evento,
    tipo_evento,
    modalidad,
    descripcion,
    ciudad,
    direccion,
    telefono_contacto,
    requisitos,
    cupo_maximo,
    organizador_id
  } = eventData;

  const result = await pool.query(
    `INSERT INTO events 
    (nombre_evento, tipo_evento, modalidad, descripcion, ciudad, direccion, telefono_contacto, requisitos, cupo_maximo, organizador_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      nombre_evento,
      tipo_evento,
      modalidad,
      descripcion || '',
      ciudad || '',
      direccion || '',
      telefono_contacto || '',
      requisitos || '',
      cupo_maximo,
      organizador_id
    ]
  );

  return result.rows[0];
};

const getEventsByOrganizer = async (organizador_id) => {
  const result = await pool.query(
    'SELECT * FROM events WHERE organizador_id = $1 ORDER BY creado_en DESC',
    [organizador_id]
  );
  return result.rows;
};

const getEventById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM events WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const incrementCupoActual = async (id) => {
  await pool.query(
    'UPDATE events SET cupo_actual = cupo_actual + 1 WHERE id = $1',
    [id]
  );
};

const decrementCupoActual = async (id) => {
  await pool.query(
    'UPDATE events SET cupo_actual = cupo_actual - 1 WHERE id = $1 AND cupo_actual > 0',
    [id]
  );
};

const updateEvent = async (id, organizador_id, updateData) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updateData)) {
    fields.push(`${key} = $${idx++}`);
    values.push(value);
  }
  values.push(id, organizador_id);

  const query = `
    UPDATE events SET ${fields.join(', ')} 
    WHERE id = $${idx++} AND organizador_id = $${idx}
    RETURNING *`;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteEvent = async (id, organizador_id) => {
  const result = await pool.query(
    'DELETE FROM events WHERE id = $1 AND organizador_id = $2 RETURNING *',
    [id, organizador_id]
  );
  return result.rows[0];
};

// Método para obtener eventos disponibles
const getAvailableEvents = async () => {
  const result = await pool.query(
    `SELECT * FROM events 
     WHERE estado = 'disponible' AND cupo_actual < cupo_maximo
     ORDER BY creado_en DESC`
  );
  return result.rows;
};

module.exports = {
  createEvent,
  getEventsByOrganizer,
  getEventById,
  incrementCupoActual,
  decrementCupoActual,
  updateEvent,
  deleteEvent,
  getAvailableEvents, 
};





