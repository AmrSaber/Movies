const axios = require('axios');
const _ = require('lodash');

const sendMail = async (emails, title, body) => {
    if (_.isEmpty(emails)) return;
    params = { emails, title, body };

    if (process.env.DEV) {
        const chalk = require('chalk');
        console.log(chalk.yellow.inverse(`Should send mail`));
        return;
    }

    let url = process.env.MAIL_FORWARD_URL + '?';

    Object.keys(params).forEach(key => {
        const value = params[key];
        if (_.isArray(value)) {
            value.forEach(item => {
                url += `${key.toString()}=${item.toString()}&`;
            });
        } else {
            url += `${key}=${value}&`;
        }
    });

    url = url.substr(0, url.length - 1);

    await axios.get(url);
}

module.exports = {
    sendMail
};