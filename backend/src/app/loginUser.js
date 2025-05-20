const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userRepo = require('../infrastructure/userRepository');

const schema = Joi.object({
  correo: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginUser = async ({ correo, password }) => {
  const { error } = schema.validate({ correo, password });
  if (error) throw new Error(error.details[0].message);

  const user = await userRepo.getUserByEmail(correo);
  if (!user) throw new Error('Usuario no encontrado.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta.');

  // Generar JWT
  const token = jwt.sign(
    { id: user.id, rol: user.rol, nombre: user.nombre, correo: user.correo },
    process.env.JWT_SECRET || 'supersecreto',
    { expiresIn: '2h' }
  );

  // No retornar el password hasheado
  const { password: _pw, ...userWithoutPw } = user;

  return { token, user: userWithoutPw };
};

module.exports = loginUser;
