const express = require('express');

// import booking routers
const bookingMovieRouter = require('./modules/booking/routers/movie');
const bookingMailRouter = require('./modules/booking/routers/mail');

const app = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// use the routers
app.use('/api/booking/movies', bookingMovieRouter);
app.use('/api/booking/mails', bookingMailRouter);

// app.get('/*', (req, res) => res.status(404).send("Endpoint not found"));

module.exports = app;