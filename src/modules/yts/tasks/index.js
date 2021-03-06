const chalk = require('chalk');
const cron = require('node-cron');
const moment = require('moment');

const checkNewMovies = require('../services/check');

// running time is at 06:00 +2 UTC regardless of the server's location
const executingHour = moment.parseZone('06:00 +02:00', 'HH:mm ZZ').hours();

const task = cron.schedule(`0 */1 * * *`, async () => {
    if (moment().hours() != executingHour) return;
    console.log(chalk.bgMagenta('Checking YTS Movies'));

    await checkNewMovies()
}, { scheduled: false });

module.exports = task;