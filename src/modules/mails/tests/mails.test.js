const _ = require('lodash');
const faker = require('faker');
const request = require('supertest');

const Mails = require('../../mails/db/mails');
const app = require('../../../app');
const { SERVICES } = require('../../../common/constants');

describe('Mail Module - Tests mails integration', () => {

    let dbServer;
    // const fakeMail = { address: 'fake.email.address@fake.com', services: SERVICES.map(s => ({ name: s })) };
    let fakeMailRegex = /^mails-fake\..+@fake.com$/i;

    beforeAll(async () => {
        // start mongoose connection
        dbServer = await require('../../../common/mongoose-connection');
    });

    afterAll(async () => {
        await dbServer.disconnect();
    });

    beforeEach(async () => {
        await Mails.create(_.times(4).map(_i => {
            return { address: `mails-fake.${faker.name.firstName()}@fake.com`, services: SERVICES.map(s => ({ name: s })) };
        }));
    });

    afterEach(async () => {
        await Mails.deleteMany({ address: { $regex: fakeMailRegex } });
    });

    describe('GET /mails', () => {
        test('it gets all mails successfully', async () => {
            const response = await request(app)
                .get('/api/mails')
                .set('Authorization', process.env.PASSWORD);

            const { body, status } = response;
            expect(status).toBe(200);

            const allMailsCount = await Mails.countDocuments();
            expect(body.length).toBe(allMailsCount);
        });
    });

    describe('DELETE /mails/:id', () => {
        test('it deletes a mail successfully', async () => {
            const mail = await Mails.findOne({ address: { $regex: fakeMailRegex } });

            const response = await request(app)
                .delete(`/api/mails/${mail._id.toString()}`)
                .set('Authorization', process.env.PASSWORD);

            const { body, status } = response;
            expect(status).toBe(200);
            expect(body).toEqual(mail.toJSON());

            const deletedMail = await Mails.findOne({ _id: mail._id });
            expect(deletedMail).toBeNil();
        });

        test('it fails to delete a non-existent mail', async () => {
            let id = ''
            _.times(24, () => { id += 1 });
            const response = await request(app)
                .delete(`/api/mails/${id}`)
                .set('Authorization', process.env.PASSWORD);

            const { status } = response;
            expect(status).toBe(404);
        });
    });

});

