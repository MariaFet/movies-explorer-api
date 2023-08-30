const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 10000,
  max: 100,
  message: 'Превышено количество запросов к серверу. Попробуйте позже.',
});

module.exports = limiter;
