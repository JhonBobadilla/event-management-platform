const pool = require('../config/db');

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
    [nombre_evento, tipo_evento, modalidad, descripcion, ciudad, direccion, telefono_contacto, requisitos, cupo_maximo, organizador_id]
  );

  return result.rows[0];
};

module.exports = {
  createEvent
};
