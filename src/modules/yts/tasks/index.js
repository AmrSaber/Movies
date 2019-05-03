const cron = require('node-cron');
const moment = require('moment');

const checkNewMovies = require('../services/check');

// running time is at 06:00 +2 UTC regardless of the server's location
const executingHour = moment.parseZone('06:00 +02:00', 'HH:mm ZZ').utcOffset(2).hours();

const task = cron.schedule(`* ${executingHour} * * *`, async () => await checkNewMovies());
task.stop();

module.exports = task;