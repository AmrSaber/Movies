const express = require('express')
const validator = require('validator')

const { getMails, addMail, removeMail } = require('../common/mails')

const router = new express.Router()

// TODO validate email
router.post('/', (req, res) => {
    const { mail } = req.body

    if (mail == undefined) {
        return res.status(400).send({
            error: `Field 'mail' required.`
        })
    }

    if (!validator.isEmail(mail)) {
        return res.status(400).send({
            error: 'Invalid Email'
        })
    }

    addMail(mail)
    res.send()
})

router.get('/', (req, res) => {
    res.send({
        mails: getMails()
    })
})

router.delete('/', (req, res) => {
    
    const { mail } = req.body

    if (mail == undefined) {
        return res.status(400).send({
            error: `Field 'mail' required.`
        })
    }

    try{
        removeMail(mail)
        res.send()
    } catch (e) {
        if (process.env.DEV) {
            console.log(e)
        }
        res.status(404).send()
    }
})

module.exports = router