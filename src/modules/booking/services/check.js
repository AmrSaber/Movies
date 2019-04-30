const chalk = require('chalk');
const Promise = require('bluebird');
const axios = require('axios');

const { getMovies, removeMovie } = require('./movies');
const { getMails } = require('./mails');
const { sendMail } = require('../../../common/utils');

const { bookLink, viewLink } = require('../constants');

const checkMoviesForBooking = async () => {
    const movies = await getMovies();
    const availableMovies = [];

    await Promise.map(movies, async (movie) => {
        const { title, movieId: id } = movie;
        let canBook;

        try {
            // if the movie page includes the link for booking then booking is open
            const response = await axios.get(viewLink + id);
            canBook = response.data.includes(`/booking/${id}`);
        } catch (e) {
            if (process.env.DEV) {
                console.log(chalk.red(e));
            }
            return;
        }

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

    if (availableMovies.length == 0) return;

    // create the response
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

    const mails = (await getMails()).map(m => m.email);
    sendMail(mails, title, body);
}

module.exports = checkMoviesForBooking;