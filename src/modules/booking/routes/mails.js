const _ = require('lodash');
const { Router } = require('express');
const expressJoi = require('express-joi-validator');

const auth = require('../../../common/middleware/authentication');
const { getMails, removeServiceFromMail, addMail } = require('../../mails/services');
const { deleteMailValidation, mailIdValidation } = require('./validation');
const { SERVICE_TYPE_BOOKING } = require('../../../common/constants');

const router = new Router();

router.get('/', auth, async (req, res) => {
    const mails = await getMails(SERVICE_TYPE_BOOKING);
    res.json(mails);
});

router.post('/', expressJoi(deleteMailValidation), async (req, res) => {
    const { email: address } = req.body;
    const mail = await addMail({ address, serviceType: SERVICE_TYPE_BOOKING });
    res.json(mail);
});

router.delete('/:id', auth, expressJoi(mailIdValidation), async (req, res) => {
    const { id } = req.params;
    const mail = await removeServiceFromMail({ id, serviceType: SERVICE_TYPE_BOOKING });
    if (_.isNil(mail)) {
        res.status(404).send();
    } else {
        res.json(mail);
    }
});

module.exports = router;