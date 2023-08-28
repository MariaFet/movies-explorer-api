require('dotenv').config();
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const { JWT_SECRET, NODE_ENV } = process.env;

const handleAuthError = (res, next) => {
  next(new NotAuthorizedError('Необходима авторизация.'));
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new NotAuthorizedError('Отсутствует токен, необходима авторизация.'));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    return handleAuthError(res, next);
  }
  req.user = payload;
  return next();
};
