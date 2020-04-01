const _crypto = require('crypto');
const uuidv4 = require('uuid/v4');

function Crypto() {

    this.randomString = (str_length) => {
        return _crypto.randomBytes(str_length).toString('hex');
    };

    this.salt = () => {
        return this.randomString(16);
    };

    this.generateApiKey = (host, number, uuid, salt) => {
        const plainText = `${host}:${number}:${uuid}`;

        return _crypto.createHmac('sha256', salt).update(plainText).digest('hex');
    };

    this.generatePasswordHash = (password, salt) => {
        const plainText = `${password}:${salt}`;

        return _crypto.createHmac('sha256', salt).update(plainText).digest('hex');
    };

    this.uuid = () => {
        return uuidv4();
    };

    return this;
};

module.exports = Crypto;