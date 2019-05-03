const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio');
const Promise = require('bluebird');

const Movies = require('../db/models/movies');
const { MAIN_PAGE } = require('../constants');
const { sendMail } = require('../../mails/utils');
const { getMails } = require('../../mails/services')
const { SERVICE_TYPE_YTS } = require('../../../common/constants');

const checkNewMovies = async () => {
    const scrapedMovies = await getCurrentMovies();
    const scrapedIds = scrapedMovies.map(m => m.movieId);
    const existingMovies = await Movies.find({ movieId: { $in: scrapedIds } });

    const existingIds = new Set();
    existingMovies.forEach(m => existingIds.add(m.movieId));

    const newMovies = scrapedMovies.filter(m => !existingIds.has(m.movieId));

    await Promise.all([
        Movies.insertMany(newMovies),
        notifyWithNewMovies(newMovies),
    ]);
}

const getCurrentMovies = async () => {
    const { data } = await axios.get(MAIN_PAGE);
    const $ = cheerio.load(data);

    const scrapedMovies = [];

    // scrap the home page and extract movies details
    $('a.browse-movie-title').each((_i, e) => {
        movie = {};

        movie.title = e.children[0].data;

        const link = e.attribs.href;

        // skip movies from "coming soon" section
        if (link.includes('imdb')) return;

        const idMatch = link.match(/[^\/]+$/);
        const yearMatch = link.match(/[0-9]{4}$/);

        // throws an error in case the site's construction is changed
        if (_.isNil(idMatch) || _.isNil(yearMatch))
            throw new Error(`Can't extract data from the scraped url "${link}"`);

        movie.link = link;
        movie.movieId = idMatch[0];
        movie.year = parseInt(yearMatch[0]);

        scrapedMovies.push(movie);
    });

    return scrapedMovies;
};

const notifyWithNewMovies = async (newMovies) => {
    if (_.isEmpty(newMovies)) return;

    const title = 'New Movies at YTS';
    let body = `The following movies have been added to <a href='${MAIN_PAGE}'>YTS</a>:<ul>`;
    newMovies.forEach(movie => body += `<li><a href='${movie.link}'>${movie.title}</a></li>`);
    body += `</ul>Check them out now.`;

    const mails = (await getMails(SERVICE_TYPE_YTS)).map(m => m.address);
    await sendMail(mails, title, body);
}


module.exports = checkNewMovies;