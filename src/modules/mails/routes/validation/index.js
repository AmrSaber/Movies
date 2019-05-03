const Joi = require('joi');

const bodyMailValidation = {
    body: {
        email: Joi.string().email().required(),
    }
}

const idMailValidation = {
    params: {
        id: Joi.string().hex().length(24).required(),
    }
}

module.exports = {
    bodyMailValidation,
    idMailValidation,
}