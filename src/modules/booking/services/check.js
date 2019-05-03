const _ = require('lodash');
const chalk = require('chalk');
const axios = require('axios');
const Promise = require('bluebird');

const { getMovies, removeMovie } = require('./movies');
const { getMails } = require('../../mails/services');
const { sendMail } = require('../../mails/utils');
const { SERVICE_TYPE_BOOKING } = require('../../../common/constants')

const { bookLink, viewLink } = require('../constants');

const checkMoviesForBooking = async () => {
    const movies = await getMovies();
    const availableMovies = [];

    await Promise.map(movies, async (movie) => {
        const { title, movieId: id } = movie;

        // if the movie page includes the link for booking then booking is open
        const response = await axios.get(viewLink + id);
        const canBook = response.data.includes(`/booking/${id}`);

        if (canBook) {
            console.log(chalk.blue(`Can Book "${title}"`));
            availableMovies.push(movie);
            removeMovie(id);
        } else {
            if (process.env.DEV) {
                console.log(chalk.yellow(`Can\'t book "${title}"`));
            }
        }
    })

    await notifyWithAvailableMovies(availableMovies);
}

const notifyWithAvailableMovies = async (availableMovies) => {
    if (_.isEmpty(availableMovies)) return;

    let title, body;

    if (availableMovies.length == 1) {
        const { title: movieTitle, movieId: id } = availableMovies[0];

        title = `Book "${movieTitle}" Now!`;

        body = `
                Booking is now available for "${movieTitle}".<br/>
                you can book <a href="${bookLink + id}">Here</a>.
            `;
    } else if (availableMovies.length > 1) {
        title = 'Movies Available for booking';

        body = 'The Following movies are available for booking:<br/>';
        availableMovies.forEach(({ title: movieTitle, movieId: id }) => {
            body += `- <a href=${bookLink + id}>${movieTitle}</a><br/>`;
        })
        body += 'Book them now.';
    }

    const mails = (await getMails(SERVICE_TYPE_BOOKING)).map(m => m.address);
    await sendMail(mails, title, body);
};

module.exports = checkMoviesForBooking;