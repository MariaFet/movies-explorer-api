const movieRouter = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movie');
const { validateMovieId, validateAddMovie } = require('../middlewares/validator');

movieRouter.get('/', getMovies);
movieRouter.post('/', validateAddMovie, addMovie);
movieRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouter;
