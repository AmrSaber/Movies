const fs = require('fs')
const axios = require('axios')

const fileName = __dirname + '/mails.json'

const getMails = () => {
    const data = fs.readFileSync(fileName).toString()
    return JSON.parse(data)
}

const addMail = (mail) => {
    const mails = getMails()
    
    // if mail already exists, return
    if (mails.indexOf(mail) != -1) return
    
    mails.push(mail)
    fs.writeFileSync(fileName, JSON.stringify(mails))
}

const removeMail = (mail) => {
    const mails = getMails()
    const indexToDelete = mails.indexOf(mail)
    
    if (indexToDelete == -1) throw new Error('Mail not found')

    mails.splice(indexToDelete, 1)
    fs.writeFileSync(fileName, JSON.stringify(mails))
}

const sendMail = async (emails, title, body) => {
    params = { emails, title, body }

    let url = process.env.MAIL_FORWARD_URL + '?'

    Object.keys(params).forEach(key => {

        const value = params[key]
        if (typeof value === 'string') {
            url += `${key}=${value}&`
        } else {
            value.forEach(item => {
                url += `${key}=${item}&`
            })
        }
    })

    url = url.substr(0, url.length - 1)

    await axios.get(url)
    return true
}

module.exports = {
    getMails,
    addMail,
    removeMail,
    sendMail,
}