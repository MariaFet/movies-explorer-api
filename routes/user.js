const userRouter = require('express').Router();
const { getCurrentUser, editCurrentUser } = require('../controllers/user');
const { validateEditCurrentUser } = require('../middlewares/validator');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', validateEditCurrentUser, editCurrentUser);

module.exports = userRouter;
