const chalk = require('chalk')

const check = require('./checkContent')
const { getMovies, removeMovie } = require('../common/movies')
const { sendMail, getMails } = require('../common/mails')
const { bookLink } = require('../common/constants')

const delay = (process.env.DEV) ? 5 * 1000 : 5 * 60 * 1000

const doCheck = () => {
    setTimeout(
        () => {
            const movies = getMovies()
            movies.forEach(movie => {

                const { title, id } = movie

                check(id)
                .then(canBook => {
                    if (canBook) {
                        if (process.env.DEV) {
                            console.log(chalk.blue(`Can Book "${title}"`))
                        }

                        const mails = getMails()

                        sendMail(
                            mails,
                            `Book "${title}" Now!`,
                            `Booking is now available for "${title}".<br/>
                            you can book <a href="${bookLink + id}">Here</a>.`
                        )

                        removeMovie(id)
                    } else {
                        if (process.env.DEV) {
                            console.log(chalk.yellow(`Can\'t book "${title}"`))
                        }
                    }
                })
                .catch(e => {
                    if (process.env.DEV) {
                        console.log(chalk.red(e))
                    }
                })
            })

            doCheck()
        }, delay
    )
}

module.exports = doCheck