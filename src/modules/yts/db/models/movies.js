const mongoose = require('mongoose');

const ytsMoviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    movieId: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        validate(value) {
            return (value.toString().length == 4);
        }
    }
});

ytsMoviesSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject()
    return { ...rest }
}

const YtsMovies = new mongoose.model('yts-movies', moviesSchema)

module.exports = YtsMovies