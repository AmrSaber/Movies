# Movies App
This is a `node.js` application (server) dedicated to movies-related automation.  
Currently it consists of one module but it is planned to have another one; modules are explained below.

## Application's Current Module(s)
### Booking Module
The core task of this module is to use a cron-job to repeatedly check [El Cinema](https://www.elcinema.com/en/) site to check whether specific movies are available for booking or not; if the movie is available for booking it sends notification email to all the emails registered in the mailing list.   
This module is currently done and it's unlikely if I will add any feature to it.  
It also uses 2 routers with 3 endpoints each.

#### Endpoints
- `GET /api/booking/movies` get the current checking list.
- `POST /api/booking/movies` add a movie to the checking list.
- `DELETE /api/booking/movies/:id` remove a movie from the list.
- `GET /api/booking/mails` get the current mailing list.
- `POST /api/booking/mails` add a mail to the mailing list.
- `DELETE /api/booking/mails` removes a mail from mailing list.

Please check the code for the details of every endpoint.
## How To Use
Like any `node.js` application, first you must install the dependencies with `npm` as follows
```bash
npm i
```
then there are -currently- 6 scripts that can be run:
- `npm start` and it's preserved for deployment server (and I user [Heroku](https://www.heroku.com)).
- `npm run dev` runs the local development server (see more below).
- `npm run dev:watch` runs the local development server in _watch_ mode, that is the server restarts with any edit in any .js file the project.
- `npm run seed` seeds the database with testing data (currently my email and testing movies).
- `npm run test` runs the [**Jest**](https://www.npmjs.com/package/jest) test cases.
- `npm run test:watch` runs the **Jest** test cases in _watch_ mode, will restart the tests with any update.

## Running Notes
- To start the development server you will need to do 2 things:
    1. Start a local [**MongoDb**](https://www.mongodb.com) database
    2. Provide .env file in the path `project/config/main.env` with the following [environment variables](https://en.wikipedia.org/wiki/Environment_variable) (see a tutorial [here](https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html)):
        - `PORT`: the port number for the server
        - `DEV=true`: used for telling the app that it's running in development mode.
        - `MONGODB_URL`: the url for connecting mongoose to the local db, should be something like "mongodb://127.0.0.1:27017/movies".
        - `BOOKING_PASSWORD`: the `Authorization` header of the endpoints that need authentication is compared against this string.
        - `MAIL_FORWARD_URL` (see next note).
- The Application depends in sending mails on [google script](https://www.google.com/script/start) that takes the info for the email as a get request and sends the emails, I made this script a couple of years ago (I will link to it if I upload it to github) and it prevents the mail from going into spam like any known service, you should provide your own script for this task and also you may consider editing `/src/common/utils` to fit your choice for email sending service.

## Final Notes
The project is currently deployed [Here](http://saber-movies.herokuapp.com), thought that's not very useful right now as (almost) all the endpoints need password authentication.