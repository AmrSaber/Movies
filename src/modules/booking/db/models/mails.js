const mongoose = require('mongoose')

const mailsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

mailsSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject()
    return { ...rest }
}

const mails = new mongoose.model('booking-mails', mailsSchema)

module.exports = mails