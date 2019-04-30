const _ = require('lodash');

const Mails = require('../db/models/mails');

const getMails = async () => {
    const mails = await Mails.find();
    return mails.map(mail => mail.toJSON());
};

const addMail = async (email) => {
    let mail = await Mails.findOne({ email });
    if (_.isNil(mail)) mail = await Mails.create({ email });
    if (!process.env.DEV) console.log(`Add Mail ${JSON.stringify(mail)}`);
    return mail;
};

const removeMail = async (email) => {
    const mail = await Mails.findOneAndDelete({ email });
    if (!process.env.DEV) console.log(`Remove Mail ${JSON.stringify(mail)}`);
    return mail;
};

module.exports = {
    getMails,
    addMail,
    removeMail,
};