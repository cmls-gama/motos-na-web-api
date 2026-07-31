const authService = require('../services/authService');

function login(req, res, next) {
  try {
    return res.status(200).json(authService.login(req.body?.username, req.body?.password));
  } catch (error) {
    return next(error);
  }
}

module.exports = { login };
