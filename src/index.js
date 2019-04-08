const chalk = require('chalk')

const app = require('./app')
const checkBooking = require('./check')

// TODO: Optimize checking to not check when there is nothing to check for

// start checking for bookings
checkBooking()

// start the server
const server = app.listen(process.env.PORT, () => {
    if (process.env.DEV) {
        console.log(chalk.blue(`Server running on port ${process.env.PORT} ...`))
    }
})

process.on('SIGTERM', () => server.close())
process.on('uncaughtException', () => server.close())
