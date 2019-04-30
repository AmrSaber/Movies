const Joi = require('joi');

const mailIdValidation = {
    params: {
        id: Joi.string().hex().length(24).required(),
    }
}

module.exports = {
    mailIdValidation,
}