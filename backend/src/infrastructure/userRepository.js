const pool = require('../config/db');

const createUser = async (userData) => {
  const {
    nombre,
    correo,
    telefono,
    numero_documento,
    password,
    rol
  } = userData;

  const result = await pool.query(
    `INSERT INTO users (nombre, correo, telefono, numero_documento, password, rol)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nombre, correo, telefono, numero_documento, password, rol]
  );

  return result.rows[0];
};

const getUserByEmail = async (correo) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE correo = $1`,
    [correo]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail
};
