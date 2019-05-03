const moment = require('moment');

const { encrypt } = require('./encryption/aes');
const { BASE_API_URL, ACTION_UNSUBSCRIBE } = require('./constants')

const createUnsubscribeLink = (mailId, service) => {
    const encryptedData = encrypt({
        expiresAt: moment().add({ minutes: 5 }).valueOf(),
        type: 'ACTION',
        action: ACTION_UNSUBSCRIBE,
        mailId: mailId.toString(),
        service,
    });

    const link = `${process.env.HOSTNAME}${BASE_API_URL}/actions/${encryptedData}`;
    return link;
}

module.exports = {
    createUnsubscribeLink,
}