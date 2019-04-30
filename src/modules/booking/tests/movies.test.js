const _ = require('lodash');
const faker = require('faker');
const request = require('supertest');

const Movies = require('../db/models/movies');
const app = require('../../../app');

describe('Tests movies integration', () => {

    let dbServer;
    const fakeMovie = { title: 'fake-My Movie Title', movieId: 12345678 };
    let fakeTitleRegex = /^fake-.+$/i;

    beforeAll(async () => {
        // start mongoose connection
        dbServer = await require('../../../common/mongoose-connection');
    });

    afterAll(async () => {
        await dbServer.disconnect();
    });

    beforeEach(async () => {
        await Movies.create(_.times(4).map(_i => {
            return { movieId: _.random(10000), title: 'fake-' + faker.lorem.sentence() };
        }));
    });

    afterEach(async () => {
        await Movies.deleteMany({ title: { $regex: fakeTitleRegex } });
    });

    describe('GET /booking/movies', () => {
        test('it gets all movies successfully', async () => {
            const response = await request(app)
                .get('/api/booking/movies');

            const { status, body } = response;
            expect(status).toBe(200);

            const fakeMoviesCount = await Movies.countDocuments();
            expect(body).toHaveLength(fakeMoviesCount);
        });
    });

    describe('POST /booking/movies', () => {
        test('it adds a new movie successfully', async () => {
            const response = await request(app)
                .post('/api/booking/movies')
                .set('Authorization', process.env.BOOKING_PASSWORD)
                .send({
                    title: fakeMovie.title,
                    id: fakeMovie.movieId
                });

            const { status } = response;
            expect(status).toBe(200);

            const addedMovie = await Movies.findOne({ movieId: fakeMovie.movieId });
            expect(addedMovie).not.toBeNil();
        });

        test('it ignores duplicate movie', async () => {
            await Movies.create(fakeMovie);

            const response = await request(app)
                .post('/api/booking/movies')
                .set('Authorization', process.env.BOOKING_PASSWORD)
                .send({
                    title: fakeMovie.title,
                    id: fakeMovie.movieId
                });

            const { status } = response;
            expect(status).toBe(200);

            const matchCount = await Movies.countDocuments(fakeMovie);
            expect(matchCount).toBe(1);
        });
    });

    describe('DELETE /booking/movies', () => {
        test('it deletes a movie successfully', async () => {
            const { movieId } = await Movies.findOne({ title: { $regex: fakeTitleRegex } });

            const response = await request(app)
                .delete(`/api/booking/movies/${movieId}`)
                .set('Authorization', process.env.BOOKING_PASSWORD);

            const { status } = response;
            expect(status).toBe(200);

            const deletedMovie = await Movies.findOne({ movieId });
            expect(deletedMovie).toBeNil();
        });

        test('it fails to delete non-existing movie', async () => {
            const response = await request(app)
                .delete(`/api/booking/movies/123456789876543`)
                .set('Authorization', process.env.BOOKING_PASSWORD);

            const { status } = response;
            expect(status).toBe(404);
        });
    });

});