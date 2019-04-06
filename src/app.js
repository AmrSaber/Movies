const express = require('express')

// import routers
const movieRouter = require('./routers/movie')
const mailRouter = require('./routers/mail')

const app = express()

// parsers
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// use the routers
app.use('/api/movies', movieRouter)
app.use('/api/mails/', mailRouter)

module.exports = app