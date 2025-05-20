const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userRepo = require('../infrastructure/userRepository');

// Esquema de validación
const schema = Joi.object({
  correo: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginUser = async ({ correo, password }) => {
  // Validar datos
  const { error } = schema.validate({ correo, password });
  if (error) throw new Error(error.details[0].message);

  // Buscar usuario por correo
  const user = await userRepo.getUserByEmail(correo);
  if (!user) throw new Error('Usuario o contraseña incorrectos.');

  // Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Usuario o contraseña incorrectos.');

  // Generar JWT
  const token = jwt.sign(
    { id: user.id, rol: user.rol, nombre: user.nombre, correo: user.correo },
    process.env.JWT_SECRET || 'supersecreto',
    { expiresIn: '8h' }
  );

  // Excluir el password del usuario retornado
  const { password: _pw, ...userWithoutPw } = user;

  // Retornar token y datos del usuario
  return { token, user: userWithoutPw };
};

module.exports = loginUser;
