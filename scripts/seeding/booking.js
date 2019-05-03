const Movies = require('../../src/modules/booking/db/models/movies');

movies = [
    { title: "SHAZAM!", movieId: "2048061" },
    { title: "Avengers: endgame", movieId: "2032663" },
    { title: "Spies in Disguise", movieId: "2049130" }
];

const seedMovies = async () => {
    await Movies.deleteMany({ movieId: { $in: movies.map(m => m.movieId) } });
    await Movies.insertMany(movies);
};

module.exports = seedMovies();