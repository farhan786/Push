/* eslint-disable no-console */
const Bootstrap = require('./bootstrap');

module.exports.bootstrap = (process) => {
    try {
        Bootstrap(process);
    } catch (_error) {
        console.error("Fatal Error During Application Bootstrap >", _error);
        process.exit(1);
    }
};
