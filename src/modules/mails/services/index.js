const _ = require('lodash');

const Mails = require('../db/mails');

const getMails = async (service) => {
    let mails;

    if (_.isNil(service)) mails = await Mails.find();
    else mails = await Mails.find({ 'services.name': service });

    return mails.map(mail => mail.toJSON());
};

const getMail = async ({ id, address }) => {
    if (!_.isNil(id)) return Mails.findOne({ _id: id });
    if (!_.isNil(address)) return Mails.findOne({ address });
}

const getServices = async (address, service) => {
    const mail = getMail({ address });
    if (_.isNil(mail)) return;
    return mail.services.map(s => s.name);
}

const addMail = async ({ address, serviceType }) => {
    let mail = await Mails.findOne({ address });
    if (_.isNil(mail)) {
        mail = new Mails({ address });
        console.log(`Create Mail ${mail.address}`);
    }

    if (!mail.services.map(s => s.name).includes(serviceType)) {
        mail.services.push({ name: serviceType });
        await mail.save();
    }

    console.log(`Update Mail ${mail.toJSON()} - Service: ${serviceType}`);
    return mail;
};

const getMailId = async (address) => {
    const mail = await Mails.findOne({ address }, { _id: 1 });
    if (_.isNil(mail)) return;
    return mail._id.toString();
}

const removeServiceFromMail = async (id, serviceType) => {
    const mail = await Mails.findOne({ _id: id });
    if (_.isNil(mail)) return;

    mail.services = mail.services.filter(service => service.name != serviceType);

    if (mail.services.length == 0) {
        await mail.remove();
    } else {
        await mail.save();
    }

    console.log(`Remove Service ${serviceType} From Mail ${mail.address}`);
    return mail;
};

const removeMail = async (id) => {
    const mail = await Mails.findOneAndRemove({ _id: id });

    console.log(`Remove Mail ${mail.toJSON()}`);
    return mail;
}

module.exports = {
    getMails,
    getMail,
    getServices,
    addMail,
    removeServiceFromMail,
    removeMail,
    getMailId,
};