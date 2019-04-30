const Joi = require('joi');

const deleteMailValidation = {
    body: {
        email: Joi.string().email().required(),
    }
}

const mailIdValidation = {
    params: {
        id: Joi.string().hex().required(),
    }
}

module.exports = {
    deleteMailValidation,
    mailIdValidation,
}