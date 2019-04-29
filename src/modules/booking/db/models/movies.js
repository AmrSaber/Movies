const mongoose = require('mongoose')

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    movieId: {
        type: Number,
        required: true,
        index: true,
        unique: true
    }
})

moviesSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject()
    return { ...rest }
}

const Movies = new mongoose.model('booking-movies', moviesSchema)

module.exports = Movies