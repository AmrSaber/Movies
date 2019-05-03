const Promise = require('bluebird');
const chalk = require('chalk');

const connection = require('../../src/common/mongoose-connection');
const bookingSeed = require('./booking');
const mailsSeed = require('./mails');

connection.then((server) => {
    const promises = [
        bookingSeed,
        mailsSeed,
    ];

    Promise.all(promises)
        .then(() => console.log(chalk.bgBlue('Seeding Done')))
        .catch(error => console.log(error))
        .finally(() => server.disconnect());
});
