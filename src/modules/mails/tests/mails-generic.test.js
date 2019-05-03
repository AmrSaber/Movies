const _ = require('lodash');
const faker = require('faker');
const request = require('supertest');

const app = require('../../../app');
const Mails = require('../db/mails');
const { SERVICES, SERVICE_TYPE_BOOKING, SERVICE_TYPE_YTS } = require('../../../common/constants');

describe('Mails Module - Tests generic mails routes integration (using booking service)', () => {

    let dbServer;
    const fakeAddress = 'booking-fake.email.address@fake.com';
    const allServices = SERVICES.map(s => ({ name: s }));
    let fakeMailRegex = /^booking-fake\..+@fake.com$/i;

    beforeAll(async () => {
        // start mongoose connection
        dbServer = await require('../../../common/mongoose-connection');
    });

    afterAll(async () => {
        await dbServer.disconnect();
    });

    beforeEach(async () => {
        await Mails.create(_.times(4).map(_i => {
            return { address: `booking-fake.${faker.name.firstName()}@fake.com`, services: [_.sample(allServices)] };
        }));
    });

    afterEach(async () => {
        await Mails.deleteMany({ address: { $regex: fakeMailRegex } });
    });

    describe('GET /booking/mails', () => {
        test('it gets all mails successfully', async () => {
            const response = await request(app)
                .get('/api/booking/mails')
                .set('Authorization', process.env.PASSWORD);

            const { status, body } = response;
            expect(status).toBe(200);

            const mailsCount = await Mails.countDocuments({ 'services.name': SERVICE_TYPE_BOOKING });
            expect(body).toHaveLength(mailsCount);
        });
    });

    describe('POST /booking/mails', () => {
        beforeAll(async () => {
            await Mails.findOneAndRemove({ address: fakeAddress });
        });

        test('it adds a new mail successfully', async () => {
            const response = await request(app)
                .post('/api/booking/mails')
                .send({
                    email: fakeAddress,
                });

            const { status } = response;
            expect(status).toBe(200);

            const addedMail = await Mails.findOne({ address: fakeAddress });
            expect(addedMail.address).toBe(fakeAddress);
        });

        test('it adds the service to an existing email successfully', async () => {
            const existing = await Mails.create({ address: fakeAddress, services: [{ name: SERVICE_TYPE_YTS }] });

            const response = await request(app)
                .post('/api/booking/mails')
                .send({
                    email: fakeAddress
                });

            const { body, status } = response;
            expect(status).toBe(200);
            expect(body._id).toBe(existing._id.toString());

            const updatedMail = await Mails.findOne({ _id: existing._id });
            expect(updatedMail.services.map(s => s.name)).toIncludeAllMembers([SERVICE_TYPE_BOOKING]);
        });
    });

    describe('DELETE /booking/mails', () => {
        test('it removes service from a mail successfully', async () => {
            const existing = await Mails.create({ address: fakeAddress, services: allServices });

            const response = await request(app)
                .delete(`/api/booking/mails/${existing._id}`)
                .set('Authorization', process.env.PASSWORD);

            const { body, status } = response;
            expect(status).toBe(200);
            expect(body._id).toBe(existing._id.toString());

            const updatedMail = await Mails.findOne({ _id: existing._id });
            const filteredServices = updatedMail.services.filter(s => s.name == SERVICE_TYPE_BOOKING)
            expect(filteredServices).toHaveLength(0);
        });

        test('it fails to delete non-existing mail', async () => {
            let id = ''
            _.times(24, () => { id += 1 });

            const response = await request(app)
                .delete(`/api/booking/mails/${id}`)
                .set('Authorization', process.env.PASSWORD);

            const { status } = response;
            expect(status).toBe(404);
        });

        test('it deletes an email subscribed to only this service', async () => {
            const existing = await Mails.create({ address: fakeAddress, services: [{ name: SERVICE_TYPE_BOOKING }] });

            const response = await request(app)
                .delete(`/api/booking/mails/${existing._id}`)
                .set('Authorization', process.env.PASSWORD);

            const { body, status } = response;
            expect(status).toBe(200);
            expect(body._id).toBe(existing._id.toString());

            const deletedMail = await Mails.findOne({ _id: existing._id });
            expect(deletedMail).toBeNil();
        });
    });

});