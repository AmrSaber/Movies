const aesjs = require('aes-js');

const slashReplacement = '-';

const encrypt = (obj) => {
    // convert object to string then to bytes
    const text = JSON.stringify(obj);
    const textBytes = aesjs.utils.utf8.toBytes(text);

    // get secret key and iv environment variables
    const key = Buffer.from(process.env.AES_PUBLIC_SECRET, 'hex');
    const iv = Buffer.from(process.env.AES_PUBLIC_IV, 'hex');

    // encrypt the object using OFB (Output FeedBack) mode
    const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
    const encryptedBytes = aesOfb.encrypt(textBytes);

    // convert the encryption into base64 (replacement is done to make it applicable to links)
    return Buffer.from(encryptedBytes).toString('base64').replace(/\//g, slashReplacement);
};

const decrypt = (cypher) => {
    // parse the cypher into bytes
    const replacementPattern = new RegExp(slashReplacement, 'g');
    const encryptedBuffer = Buffer.from(cypher.replace(replacementPattern, '/'), 'base64');
    const encryptedBytes = new Uint8Array(encryptedBuffer);

    // get secret key and iv environment variables
    const key = Buffer.from(process.env.AES_PUBLIC_SECRET, 'hex');
    const iv = Buffer.from(process.env.AES_PUBLIC_IV, 'hex');
    
    // decrypt the object using OFB (Output FeedBack) mode
    const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
    const decryptedBytes = aesOfb.decrypt(encryptedBytes);

    // return the decrypted object
    const decryptedText = Buffer.from(decryptedBytes).toString('ascii');
    return JSON.parse(decryptedText);
};

module.exports = {
    encrypt,
    decrypt,
};