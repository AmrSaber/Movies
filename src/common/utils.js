const axios = require('axios');

const sendMail = async (emails, title, body) => {
    params = { emails, title, body };

    if (process.env.DEV) {
        const chalk = require('chalk');
        console.log(chalk.yellow.inverse(`Should send mail`));
        return;
    }

    let url = process.env.MAIL_FORWARD_URL + '?';

    Object.keys(params).forEach(key => {

        const value = params[key];
        if (typeof value === 'string') {
            url += `${key}=${value}&`;
        } else {
            value.forEach(item => {
                url += `${key}=${item}&`;
            });
        }
    });

    url = url.substr(0, url.length - 1);

    await axios.get(url);
    return true;
}

module.exports = {
    sendMail
};