const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { signup, signin, signout } = require('../controllers/user');
const { validateSignin, validateSignup } = require('../middlewares/validator');

router.post('/signup', validateSignup, signup);
router.post('/signin', validateSignin, signin);
router.post('/signout', auth, signout);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('*', auth, (req, res, err, next) => next(new NotFoundError('Запрашиваемая страница не найдена.')));

module.exports = router;
