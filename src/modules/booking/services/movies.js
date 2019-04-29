const _ = require('lodash');

const Movies = require('../db/models/movies');

const getMovies = async () => {
    const movies = await Movies.find();
    return movies.map(movie => movie.toJSON());
}

const addMovie = async (title, id) => {
    let movie = Movies.find({ title });
    if (_.isNil(movie)) movie = await Movies.create({ title, movieId: id });
    return movie;
}

const removeMovie = async (id) => {
    return Movies.findOneAndRemove({ movieId: id });
}

module.exports = {
    getMovies,
    addMovie,
    removeMovie
};