const _ = require('lodash');
const { Router } = require('express');
const expressJoi = require('express-joi-validator');

const auth = require('../../../common/middleware/authentication');
const { getMails, removeServiceFromMail, addMail } = require('../../mails/services');
const { bodyMailValidation, idMailValidation } = require('./validation');

const createGenericRouterForService = (serviceName) => {
    const router = new Router();

    router.get('/', auth, async (req, res) => {
        const mails = await getMails(serviceName);
        res.json(mails);
    });

    router.post('/', expressJoi(bodyMailValidation), async (req, res) => {
        const { email: address } = req.body;
        const mail = await addMail({ address, serviceType: serviceName });
        res.json(mail);
    });

    router.delete('/:id', auth, expressJoi(idMailValidation), async (req, res) => {
        const { id } = req.params;
        const mail = await removeServiceFromMail(id, serviceName);
        if (_.isNil(mail)) {
            res.status(404).send();
        } else {
            res.json(mail);
        }
    });

    return router;
}

module.exports = {
    createGenericRouterForService,
}