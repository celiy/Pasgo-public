//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const moviesController = require('../controllers/exampleController');
//autenticação executada antes de um get/post ser feito
const authController = require('../controllers/authController');

const router = express.Router();

//api.com/highest-rated
router.route('/highest-rated')
    .get(moviesController.getHighestRated, moviesController.getAllMovies)

//api.com/movie-stats
router.route('/movie-stats')
    .get(moviesController.getMovieStats);

//api.com/movie-by-genre/{genero do filme}
router.route('/movie-by-genre/:genre')
    .get(moviesController.getMovieByGenre);

//api.com
router.route('/')
    .get(authController.protect, moviesController.getAllMovies)
    .post(moviesController.createMovie)

//api.com/{id aqui}
router.route('/:id')
    .get(moviesController.getMovieByID)
    .patch(authController.protect, moviesController.updateMovieByID)
    .delete(authController.protect, authController.restrict('admin'), moviesController.deleteMovieByID)

module.exports = router;