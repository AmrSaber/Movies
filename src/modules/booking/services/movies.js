const _ = require('lodash');

const Movies = require('../db/models/movies');

const getMovies = async () => {
    const movies = await Movies.find();
    return movies.map(movie => movie.toJSON());
}

const addMovie = async (title, id) => {
    let movie = await Movies.findOne({ movieId: id });
    if (_.isNil(movie)) movie = await Movies.create({ title, movieId: id });
    if (!process.env.DEV) console.log(`Add Movie ${JSON.stringify(movie)}`);
    return movie;
}

const removeMovie = async (id) => {
    const movie = await Movies.findOneAndRemove({ movieId: id });
    if (!process.env.DEV) console.log(`Remove Movie ${JSON.stringify(movie)}`);
    return movie;
}

module.exports = {
    getMovies,
    addMovie,
    removeMovie
};