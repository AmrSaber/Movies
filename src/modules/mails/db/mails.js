const validator = require('validator');
const mongoose = require('mongoose');

const constants = require('../../../common/constants');

const mailsSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate(value) {
            return validator.isEmail(value);
        },
    },
    services: {
        type: [{
            _id: false,
            name: {
                type: String,
                enum: constants.SERVICES,
                required: true,
            },
        }],
        required: true,
        validate(value) {
            return (value.length > 0);
        },
    }
});

mailsSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject();
    return { _id: _id.toString(), ...rest };
}

const mails = new mongoose.model('mails', mailsSchema);

module.exports = mails;