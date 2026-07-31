const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token de autenticação não informado.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret-change-me');
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Você não possui permissão para esta operação.' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
