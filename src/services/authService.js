const jwt = require('jsonwebtoken');
const { users, verifyPassword } = require('../config/auth');
const AppError = require('./errors');

function login(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    throw new AppError('Usuário e senha são obrigatórios.', 400);
  }

  const user = users.find((item) => item.username === username);
  if (!user || !verifyPassword(password, user)) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const token = jwt.sign(
    { sub: user.username, role: user.role },
    process.env.JWT_SECRET || 'development-only-secret-change-me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  );

  return { token, user: { username: user.username, role: user.role } };
}

module.exports = { login };
