const bookingTask = require('./modules/booking/tasks');
const ytsTask = require('./modules/yts/tasks');

tasks = [
    bookingTask,
    ytsTask,
];

module.exports = tasks;