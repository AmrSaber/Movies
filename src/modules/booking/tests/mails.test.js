const _ = require('lodash');
const faker = require('faker');
const request = require('supertest');

const Mails = require('../db/models/mails');
const app = require('../../../app');

describe('Tests mails integration', () => {

    let dbServer;
    const fakeMail = { email: 'fake.email.address@fake.com' };
    let fakeMailRegex = /^fake\..+@fake.com$/i;

    beforeAll(async () => {
        // start mongoose connection
        dbServer = await require('../../../common/mongoose-connection');
    });

    afterAll(async () => {
        await dbServer.disconnect();
    });

    beforeEach(async () => {
        await Mails.create(_.times(4).map(_i => {
            return { email: `fake.${faker.name.firstName()}@fake.com` };
        }));
    });

    afterEach(async () => {
        await Mails.deleteMany({ email: { $regex: fakeMailRegex } });
    });

    describe('GET /booking/mails', () => {
        test('it gets all mails successfully', async () => {
            const response = await request(app)
                .get('/api/booking/mails');

            const { status, body } = response;
            expect(status).toBe(200);

            const mailsCount = await Mails.countDocuments();
            expect(body).toHaveLength(mailsCount);
        });
    });

    describe('POST /booking/mails', () => {
        test('it adds a new mail successfully', async () => {
            const response = await request(app)
                .post('/api/booking/mails')
                .send({
                    mail: fakeMail.email
                });

            const { status } = response;
            expect(status).toBe(200);

            const addedMail = Mails.findOne(fakeMail);
            expect(addedMail).not.toBeNil();
        });

        test('it ignores duplicate mail', async () => {
            await Mails.create(fakeMail);

            const response = await request(app)
                .post('/api/booking/mails')
                .send({
                    mail: fakeMail.email
                });

            const { status } = response;
            expect(status).toBe(200);

            const matchCount = await Mails.countDocuments(fakeMail);
            expect(matchCount).toBe(1);
        });
    });

    describe('DELETE /booking/mails', () => {
        test('it deletes a mail successfully', async () => {
            const { email } = await Mails.findOne({ email: { $regex: fakeMailRegex } });

            const response = await request(app)
                .delete(`/api/booking/mails`)
                .send({
                    mail: email
                });

            const { status } = response;
            expect(status).toBe(200);

            const deletedMail = await Mails.findOne({ email });
            expect(deletedMail).toBeNil();
        });

        test('it fails to delete non-existing mail', async () => {
            const response = await request(app)
                .delete('/api/booking/mails')
                .send({
                    mail: 'non.existing.email@somewhere.com'
                });

            const { status } = response;
            expect(status).toBe(404);
        });
    });

});