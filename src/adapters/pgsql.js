const monitor = require('pg-monitor');
const pgp = require('pg-promise');
const Promise = require('bluebird');

module.exports = (logger, config) => {
    const dbConfig = config.get('storage').pgsql;

    const initOptions = {
        promiseLib: Promise,
    };

    const pgsql = pgp(initOptions);

    if (!monitor.isAttached()) monitor.attach(initOptions, ['query', 'error', 'connect', 'disconnect']);

    const db = pgsql(dbConfig);

    const check = checkConnectivity(db);
        
    check.then(() => {
        logger.info('[\u2713] Postgres [ready]');
    }).catch((_error) => {
        logger.info('[\u2a2f] Postgres is not running ', _error);
    });

    return db;
};

function checkConnectivity(db) {
    return db.query('SELECT 1');
}