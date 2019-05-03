const mongoose = require('mongoose');

const { DETAILS_BASE_LINK } = require('../../constants');

const ytsMoviesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        movieId: {
            type: String,
            required: true,
            index: true,
        },
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);

ytsMoviesSchema.virtual('link')
    .get(function () {
        return DETAILS_BASE_LINK + this.movieId;
    });

ytsMoviesSchema.virtual('year')
    .get(function () {
        const yearMatch = this.movieId.match(/[0-9]{4}$/);
        return parseInt(yearMatch[0]);
    });

ytsMoviesSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject()
    return { ...rest }
}

const YtsMovies = new mongoose.model('yts-movies', ytsMoviesSchema)

module.exports = YtsMovies