const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    // roles puede ser string o array
    if (typeof roles === 'string') roles = [roles];

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

      if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'midificilclavejwt');
      req.user = decoded; // Pone los datos del usuario en req.user

      // Si hay restricción de roles, verifica que el usuario tenga el rol requerido
      if (roles.length && !roles.includes(decoded.rol)) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;

