const crypto = require('node:crypto');

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64);
}

function createUser(username, password, role) {
  const salt = crypto.randomBytes(16).toString('hex');
  return {
    username,
    role,
    salt,
    passwordHash: hashPassword(password, salt),
  };
}

const users = [
  createUser(
    process.env.MANAGER_USERNAME || 'gerente',
    process.env.MANAGER_PASSWORD || 'gerente123',
    'manager',
  ),
  createUser(
    process.env.USER_USERNAME || 'usuario',
    process.env.USER_PASSWORD || 'usuario123',
    'user',
  ),
];

function verifyPassword(password, user) {
  const candidate = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(candidate, user.passwordHash);
}

module.exports = { users, verifyPassword };
