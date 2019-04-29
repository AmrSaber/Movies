const express = require('express');
const validator = require('validator');
const _ = require('lodash');

const auth = require('../../../common/middleware/authentication');
const { getMails, addMail, removeMail } = require('../services/mails');

const router = new express.Router();

router.post('/', auth, async (req, res) => {
    const { mail } = req.body;

    if (_.isNil(mail)) {
        return res.status(400).send({
            error: `Field 'mail' required.`
        });
    }

    if (!validator.isEmail(mail)) {
        return res.status(400).send({
            error: 'Invalid Email'
        });
    }

    await addMail(mail);
    res.send();
});

router.get('/', auth, (req, res) => {
    getMails().then(mails => res.json(mails));
});

router.delete('/', auth, async (req, res) => {

    const { mail } = req.body;

    if (mail == undefined) {
        return res.status(400).send({
            error: `Field 'mail' required.`
        });
    }

    const removedMail = await removeMail(mail);
    if (removedMail == null) {
        res.status(404).send();
    } else {
        res.send();
    }
});

module.exports = router;