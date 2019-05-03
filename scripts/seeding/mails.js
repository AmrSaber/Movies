const _ = require('lodash');

const Mails = require('../../src/modules/mails/db/mails');
const { SERVICES } = require('../../src/common/constants');


const seedMails = async () => {
    const mail = { address: 'amr.m.saber.mail@gmail.com', services: SERVICES.map(s => ({ name: s })) };

    await Mails.findOneAndRemove({ address: mail.address });
    await Mails.create(mail);
};

module.exports = seedMails();