const _ = require('lodash');
const moment = require('moment');
const { Router } = require('express');

const { decrypt } = require('../common/encryption/aes');
const { ACTION_UNSUBSCRIBE, servicesMap } = require('../common/constants');
const { removeServiceFromMail } = require('../modules/mails/services')

const router = new Router();

const respondNotFound = (res) => res.status(404).send('Endpoint not found!');

// handle application actions
router.get('/actions/:secret', async (req, res) => {
    const { secret } = req.params;
    if (_.isNil(secret)) return res.status(400).send();

    let data;
    try {
        data = decrypt(secret);
        if (data.type !== 'ACTION') throw new Error();
    } catch (e) {
        return respondNotFound(res);
    }

    const { action } = data;

    switch (action) {
        case ACTION_UNSUBSCRIBE:
            const { mailId, service, expiresAt } = data;
            if (moment().valueOf() > expiresAt) return res.status(410).send('Request expired!');
            
            const mail = await removeServiceFromMail(mailId, service);
            if (_.isNil(mail)) return res.status(404).send('Mail not found!');
            
            return res.send(`Unsubscribed from ${servicesMap[service]} service successfully.`);
        default:
            return respondNotFound(res);
    }
});

// router.get('/*', (req, res) => respondNotFound(res));

module.exports = router;
