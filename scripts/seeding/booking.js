const Promise = require('bluebird')

const Movies = require('../../src/modules/booking/db/models/movies');
const Mails = require('../../src/modules/booking/db/models/mails');

movies = [
    { title: "SHAZAM!", movieId: "2048061" },
    { title: "Avengers: endgame", movieId: "2032663" },
    { title: "Spies in Disguise", movieId: "2049130" }
];

mail = { email: 'amr.m.saber.mail@gmail.com'};

module.exports = [
    Movies.insertMany(movies, { ordered: false }),
    Mails.create(mail)
];