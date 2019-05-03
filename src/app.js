const express = require('express');

const { SERVICE_TYPE_BOOKING, SERVICE_TYPE_YTS, BASE_API_URL } = require('./common/constants');
const { createGenericRouterForService } = require('./modules/mails/routes/generic');

// misc
const miscRouter = require('./misc/router');

// booking module
const bookingMovieRouter = require('./modules/booking/routes');

// mails module
const mailsRouter = require('./modules/mails/routes');

// generic mail routers
const bookingMailsRouter = createGenericRouterForService(SERVICE_TYPE_BOOKING);
const ytsMailsRouter = createGenericRouterForService(SERVICE_TYPE_YTS);

const app = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use the routers
app.use(`${BASE_API_URL}/booking/movies`, bookingMovieRouter);
app.use(`${BASE_API_URL}/booking/mails`, bookingMailsRouter);
app.use(`${BASE_API_URL}/yts/mails`, ytsMailsRouter);
app.use(`${BASE_API_URL}/mails`, mailsRouter);

// this must be called in the end
app.use(BASE_API_URL, miscRouter);

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

    console.log('Validation Error');
    console.log(JSON.stringify(data, null, 2));

    res.status(400).send();
});

module.exports = app;