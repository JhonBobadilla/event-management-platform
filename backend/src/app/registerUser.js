const bcrypt = require('bcrypt');
const Joi = require('joi');
const userRepo = require('../infrastructure/userRepository');

const schema = Joi.object({
  nombre: Joi.string().required(),
  correo: Joi.string().email().required(),
  telefono: Joi.string().required(),
  numero_documento: Joi.string().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('usuario', 'organizador').required()
});

const registerUser = async (userData) => {
  const { error } = schema.validate(userData);
  if (error) throw new Error(error.details[0].message);

  // Revisa si ya existe correo o numero_documento
  const existing = await userRepo.getUserByEmail(userData.correo);
  if (existing) throw new Error('Correo ya registrado.');

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const userCreated = await userRepo.createUser({
    ...userData,
    password: hashedPassword
  });

  return userCreated;
};

module.exports = registerUser;
