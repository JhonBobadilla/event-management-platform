const pool = require('../config/db');

const createReservation = async ({ user_id, event_id }) => {
  const result = await pool.query(
    `INSERT INTO reservations (user_id, event_id)
     VALUES ($1, $2)
     RETURNING *`,
    [user_id, event_id]
  );
  return result.rows[0];
};

const getReservationsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT r.id, r.fecha_reserva, e.*
     FROM reservations r
     JOIN events e ON r.event_id = e.id
     WHERE r.user_id = $1
     ORDER BY r.fecha_reserva DESC`,
    [user_id]
  );
  return result.rows;
};

const checkReservationExists = async ({ user_id, event_id }) => {
  const result = await pool.query(
    `SELECT * FROM reservations WHERE user_id = $1 AND event_id = $2`,
    [user_id, event_id]
  );
  return result.rows.length > 0;
};

const deleteReservation = async (reservationId, userId) => {
  const result = await pool.query(
    `DELETE FROM reservations WHERE id = $1 AND user_id = $2 RETURNING *`,
    [reservationId, userId]
  );
  return result.rows[0];
};

module.exports = {
  createReservation,
  getReservationsByUser,
  checkReservationExists,
  deleteReservation,
};
