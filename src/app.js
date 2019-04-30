const express = require('express');

// booking module
const bookingMovieRouter = require('./modules/booking/routers/movies');

// mails module
const mailsRouter = require('./modules/mails/routers');

const app = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use the routers
app.use('/api/booking/movies', bookingMovieRouter);
app.use('/api/mails', mailsRouter);

// respond for validation error
app.use((err, req, res, nxt) => {
    const data = {
        error: err,
        path: req.originalPath,
        params: req.params,
        body: req.body,
        query: req.query,
    };
    
    console.log(JSON.stringify(data, null, 2));
    
    res.status(400).send();
})

// app.get('/*', (req, res) => res.status(404).send("Endpoint not found"));

module.exports = app;