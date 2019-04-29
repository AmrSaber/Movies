const _ = require('lodash');

const Mails = require('../db/models/mails');

const getMails = async () => {
    const mails = await Mails.find();
    return mails.map(mail => mail.toJSON());
};

const addMail = async (email) => {
    let mail = Mails.findOne({ email });
    if (_.isNil(mail)) mail = await Mails.create({ email });
    return mail;
};

const removeMail = async (email) => {
    return Mails.findOneAndDelete({ email });
};

module.exports = {
    getMails,
    addMail,
    removeMail,
};