const Promise = require('bluebird');
const chalk = require('chalk');

const connection = require('../../src/common/mongoose-connection');
const bookingSeedPromises = require('./booking');

Promise.all([
    ...bookingSeedPromises,
]).catch(() => {}).finally(() => {
    console.log(chalk.blue('Seeding Done'));
    connection.then(server => server.disconnect());
});
