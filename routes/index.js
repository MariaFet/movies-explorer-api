const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { signup, signin, signout } = require('../controllers/user');
const { validateSignin, validateSignup } = require('../middlewares/validator');

router.post('/signup', validateSignup, signup);
router.post('/signin', validateSignin, signin);
router.use(auth);
router.post('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена.')));

module.exports = router;
