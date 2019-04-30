const _ = require('lodash');
const { Router } = require('express');
const expressJoi = require('express-joi-validator');

const auth = require('../../../common/middleware/authentication');
const { getMails, removeMail } = require('../services');
const { mailIdValidation } = require('./validation');

const router = new Router();

router.get('/', auth, async (req, res) => {
    const mails = await getMails();
    res.json(mails);
});

router.delete('/:id', expressJoi(mailIdValidation), auth, async (req, res) => {
    const { id } = req.params;
    const mail = await removeMail(id);

    if (_.isNil(mail)) return res.status(404).send();
    res.json(mail);
});

module.exports = router;