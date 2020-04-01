const pgsql = require('./pgsql');

module.exports = (logger, config) => ({
    db: {
        primary: pgsql(logger, config)
    }
});
