const _ = require('lodash');
const { Router } = require('express');

const { decrypt } = require('../common/encryption/aes');
const { ACTION_UNSUBSCRIBE, servicesMap } = require('../common/constants');
const { removeServiceFromMail } = require('../modules/mails/services')

const router = new Router();

const respondNotFound = (res) => res.status(404).send("Endpoint not found");

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
            const { mailId, service } = data;
            await removeServiceFromMail(mailId, service);
            return res.send(`Unsubscribed from ${servicesMap[service]} service successfully`);
        default:
            return respondNotFound(res);
    }
});

router.get('/*', (req, res) => respondNotFound(res));

module.exports = router;
