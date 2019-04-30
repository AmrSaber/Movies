const _ = require('lodash');

const Mails = require('../db/mails');

const getMails = async (service) => {
    let mails;

    if (_.isNil(service)) mails = await Mails.find();
    else mails = await Mails.find({ 'services.name': service });

    return mails.map(mail => mail.toJSON());
};

const addMail = async (address, serviceType) => {
    let mail = await Mails.findOne({ address });
    if (_.isNil(mail)) {
        mail = new Mails({ address });
        if (!process.env.DEV) console.log(`Create Mail ${mail.address}`);
    }

    if (!mail.services.includes(serviceType)) {
        mail.services.push(serviceType);
        await mail.save();
    }

    if (!process.env.DEV) console.log(`Update Mail ${mail.toJSON()} - Service: ${serviceType}`);
    return mail;
};

const removeServiceFromMail = async (id, serviceType) => {
    const mail = await Mails.findOne({ _id: id });
    if (_.isNil(mail)) return;

    mail.services = mail.services.filter(service => service == serviceType);

    if (mail.services.length == 0) {
        await mail.remove;
    } else {
        await mail.save();
    }

    if (!process.env.DEV) console.log(`Remove Service ${serviceType} From Mail ${mail.address}`);
    return mail;
};

const removeMail = async (id) => {
    const mail = await Mails.findOneAndRemove({ _id: id });

    if (!process.env.DEV) console.log(`Remove Mail ${mail.toJSON()}`);
    return mail;
}

module.exports = {
    getMails,
    addMail,
    removeServiceFromMail,
    removeMail,
};