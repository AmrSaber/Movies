const cron = require('node-cron');
const chalk = require('chalk');

const checkMoviesForBooking = require('../services/check');

// run every 30 seconds for dev and every 5 minutes for production
const cronTiming = (process.env.DEV) ? '*/30 * * * * *' : '*/5 * * * *';
const task = cron.schedule(cronTiming, async () => checkMoviesForBooking());
task.stop();

module.exports = task;