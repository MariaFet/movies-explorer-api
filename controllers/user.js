require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id.toString())
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      return res.send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports.editCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictingRequestError('Пользователь с данной почтой уже существует.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при получении пользователя.'));
      }
      return next(err);
    });
};

module.exports.signup = (req, res, next) => {
  const { name, email } = req.body;
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then(() => res.status(201).send({ data: { name, email } }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictingRequestError('Пользователь с данной почтой уже существует.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new NotAuthorizedError('Неправильные почта или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new NotAuthorizedError('Неправильные почта или пароль.'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret_key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          });
          return res.send('Авторизация прошла успешно.');
        });
    })
    .catch((err) => next(err));
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt');
  return res.send('Успешный выход.');
};
