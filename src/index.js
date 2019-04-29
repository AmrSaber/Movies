const chalk = require('chalk');

const app = require('./app');
const cronTasks = require('./tasks');

// setup mongoose connection
require('./common/mongoose-connection');

// start the server
const server = app.listen(process.env.PORT, async () => {
    console.log(chalk.blue(`Server running on port ${process.env.PORT} ...`));
    cronTasks.forEach(task => task.start());
});

process.on('SIGTERM', () => server.close());
process.on('uncaughtException', e => {
    console.log(chalk.bgRed('Uncaught Error'));
    console.log(chalk.red(e.stack));
    server.close();
});