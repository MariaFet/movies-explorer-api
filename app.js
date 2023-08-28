require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookie = require('cookie-parser');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const { PORT = 3000, MONGODB_URL, FRONT_URL } = process.env;

const app = express();

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  autoIndex: true,
  useUnifiedTopology: false,
});

app.use(helmet());
app.use(express.json());
app.use(cookie());
app.use(cors({ origin: FRONT_URL, credentials: true }));
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors);
app.use(errorHandler);
app.listen(PORT);
