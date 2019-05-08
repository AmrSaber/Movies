# Movies App
This is a `node.js` application (server) dedicated to movies-related automation.  
Currently it consists of one module but it is planned to have another one; modules are explained below.

The project is currently deployed [Here](http://saber-movies.herokuapp.com), you can use public (open) endpoints to subscribe/unsubscribe to any module.

Simple front end for the application will be available soon.

## Application's Modules
This section describes the technical internals of each module.

All endpoints having the :lock: symbol need authorization, the authorization is a header "Authorization" with the value of the admin's secret password

### Mails Module
Previously this was included in the [Booking module](#booking-module), but I refactored it (in several stages) to be a stand-alone module on its own and it's responsible for all the mail-related logic through the app.

This module has 2 main routers:
- Mails management router
- Generic router

#### Mail management router
has 2 end points
- :lock: `GET /api/mails`  
Used to get all the registered mails().

- :lock: `DELETE /api/mails/:id`  
Deletes a mail from the mailing list by its id.

#### Generic router
This is more like router generator for each module that deals with mailing list, it contains 4 endpoints...

- :lock: `GET /api/{module_name}/mails`   
Gets all mails subscribed to this module.

- `POST /api/{module_name}/mails`  
Body: `{email: String}` - Subscribes mail to the module.

- :lock: `DELETE /{module_name}/mails/:id`  
Unsubscribe given mail from module.

- `POST /api/{module_name}/mails/unsubscribe`  
Body: `{email: String}` - Send mail with a link to unsubscribe.

This router is used for **Booking** and **YTS** modules with _module_name_ equal to **booking** and **yts** respectively.


### Booking Module
The core task of this module is to use a cron-job to repeatedly check [El Cinema](https://www.elcinema.com/en/) site to check whether specific movies are available for booking or not; if the movie is available for booking it sends notification email to all the emails registered in the mailing list.   
  
In addition to the generic mailing router, this module has 1 router with 3 endpoints.

The _id_ parameter used in the end points is the movie's Id from elcinema site (last part of the movie's url)

#### Endpoints
- `GET /api/booking/movies`  
Get the current checking list.

- :lock: `POST /api/booking/movies`  
Body: `{title: String, id: Number}` - Adds a movie to the checking list.

- :lock: `DELETE /api/booking/movies/:id`  
Remove a movie from the list.

### YTS Module
This module has no endpoints, it currently only scraps [YTS](https://yts.am/) site and reads the current available movies, adds them to my database (adds title and id) and sends mail to subscribed users with the new movies.

## How To Run (Optional)
Like any `node.js` application, first you must install the dependencies with `npm` as follows
```bash
npm i
```
then there are - currently - 6 scripts that can be run:
- `npm start` reserved for [Heroku](https://www.heroku.com) deployment server.
- `npm run dev` runs the local development server (see more below).
- `npm run dev:watch` runs the local development server in _watch_ mode, that is the server restarts with any edit in any **.js** file in the project.
- `npm run seed` seeds the database with testing data (currently my email and some testing movies for booking module).
- `npm run test` runs the [**Jest**](https://www.npmjs.com/package/jest) test cases, to ensure all endpoints are working proberly and nothing is broken.
- `npm run test:watch` runs the **Jest** test cases in _watch_ mode, will restart the tests with any updates in the project.

## Running Notes
- To start the development server you will need to do 2 things:
    1. Start a local [**MongoDb**](https://www.mongodb.com) database
    2. Provide .env file in the path `project/config/main.env` with the following [environment variables](https://en.wikipedia.org/wiki/Environment_variable) (see a tutorial [here](https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html)):
        - `PORT`: the port number for the server
        - `DEV=true`: used for telling the app that it's running in development mode.
        - `HOSTNAME`: the full link to the base url of the application, used for unsubscribe mail.
        - `MONGODB_URL`: the url for connecting mongoose to the local db, should be something like "mongodb://127.0.0.1:27017/movies".
        - `MAIL_FORWARD_URL` (see next note).
        - `PASSWORD`: the **Authorization** header of the endpoints that need authentication is compared against this string.
        - `AES_PUBLIC_SECRET`: used for the construction of the unsubscribe link.
        - `AES_PUBLIC_IV`: used for the construction of the unsubscribe link.

- The Application depends in sending mails on [google script](https://www.google.com/script/start) that takes the info for the email as a get request and sends the emails, I made this script a couple of years ago (I will link to it if I upload it to github) and it prevents the mail from going into spam like any known service, you should provide your own script for this task and also you may consider editing `/src/common/utils` to fit your choice for email sending service.