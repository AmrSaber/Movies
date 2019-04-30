const express = require('express');

// booking module
const bookingMovieRouter = require('./modules/booking/routes/movies');
const bookingMailsRouter = require('./modules/booking/routes/mails');

// mails module
const mailsRouter = require('./modules/mails/routes');

const app = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use the routers
app.use('/api/booking/movies', bookingMovieRouter);
app.use('/api/booking/mails', bookingMailsRouter);
app.use('/api/mails', mailsRouter);

// respond for validation error
app.use((err, req, res, nxt) => {
    const { url, method, params, body, query } = req;

    const data = {
        method,
        url,
        error: err.data,
        params,
        body,
        query,
    };

    console.log(JSON.stringify(data, null, 2));

    res.status(400).send();
})

// app.get('/*', (req, res) => res.status(404).send("Endpoint not found"));

module.exports = app;