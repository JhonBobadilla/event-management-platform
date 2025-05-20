// src/interfaces/routes/userRoutes.js
const express = require('express');
const registerUser = require('../../app/registerUser');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario u organizador
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               numero_documento:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [usuario, organizador]
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error en datos o usuario ya existe
 */
router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Usuario creado correctamente', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
