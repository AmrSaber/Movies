const { encrypt } = require('./encryption/aes');
const { BASE_API_URL, ACTION_UNSUBSCRIBE } = require('./constants')

const createUnsubscribeLink = (mailId, service) => {
    const encryptedData = encrypt({
        type: 'ACTION',
        action: ACTION_UNSUBSCRIBE,
        mailId: mailId.toString(),
        service,
    });

    return `${BASE_API_URL}/actions/${encryptedData}`;
}

module.exports = {
    createUnsubscribeLink,
}