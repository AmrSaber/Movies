const _ = require('lodash');
const { Router } = require('express');
const expressJoi = require('express-joi-validator');

const auth = require('../../../common/middleware/authentication');
const { getMails, removeServiceFromMail, addMail, getMail } = require('../../mails/services');
const { sendMail } = require('../utils');
const { bodyMailValidation, idMailValidation } = require('./validation');
const { createUnsubscribeLink } = require('../../../common/utils')
const { servicesMap } = require('../../../common/constants');

const createGenericRouterForService = (serviceId) => {
    const router = new Router();
    const serviceName = servicesMap[serviceId];

    router.get('/', auth, async (req, res) => {
        const mails = await getMails(serviceId);
        res.json(mails);
    });

    router.post('/', expressJoi(bodyMailValidation), async (req, res) => {
        const { email: address } = req.body;
        const mail = await addMail({ address, serviceType: serviceId });
        res.json(mail);
    });

    router.delete('/:id', auth, expressJoi(idMailValidation), async (req, res) => {
        const { id } = req.params;
        const mail = await removeServiceFromMail(id, serviceId);
        if (_.isNil(mail)) {
            res.status(404).send();
        } else {
            res.json(mail);
        }
    });

    router.post('/unsubscribe', expressJoi(bodyMailValidation), async (req, res) => {
        const { email } = req.body;
        const mail = await getMail({ address: email });
        if (_.isNil(mail)) return res.status(422).send(`Mail not subscribed to ${serviceName} service`);
        
        const mailServices = mail.services.map(s => s.name);
        if (!mailServices.includes(serviceId)) return res.status(422).send(`Mail not subscribed to ${serviceName} service`);

        const unsubscribeLink = createUnsubscribeLink(mail._id, serviceId);

        const title = `Unsubscribe from ${serviceName} service`;
        const body = `To unsubscribe from ${serviceName} service, please click <a href='${unsubscribeLink}'>here</a>.`;
        await sendMail(email, title, body);

        res.send(`Mail sent to ${email} to confirm unsubscribing.`);
    });

    return router;
}

module.exports = {
    createGenericRouterForService,
}