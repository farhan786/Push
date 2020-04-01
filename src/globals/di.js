const awilix = require('awilix');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const _ = require('lodash');

const container = awilix.createContainer();

module.exports = function _ServerDI(options = {}) {
    const logger = _.get(options, 'logger', undefined);
    const config = _.get(options, 'config', undefined);
    const adapters = _.get(options, 'adapters', undefined);

    if (logger === undefined) throw new Error('Server DI is dependent on [logger] instance');

    if (config === undefined) throw new Error('Server DI is dependent on [config] instance');

    if (adapters === undefined) throw new Error('Server DI can not initialize without storage [adapters]');

    container.register({
        config: awilix.asValue(config),
        logger: awilix.asValue(logger),
        db: awilix.asFunction(() => adapters.db).singleton(),
        Joi: awilix.asValue(Joi),
        Boom: awilix.asValue(Boom),
        _: awilix.asValue(_),
    });

    container.loadModules(
        [
            '../services/**/*.js',
            '../helpers/**/*.js',
            '../resolvers/**/*.js',
            '../schema/**/*.js',
            '../handlers/**/*.js',
            '../decorators/**/*.js',
        ],
        {
            cwd: __dirname,
            formatName: 'camelCase',
            resolverOptions: {
                lifetime: awilix.Lifetime.SINGLETON,
                register: awilix.asClass,
            },
        },
    );

    this._container = () => container;

    this.register = function register(asType, typeValue) {
        let type = null;

        switch (asType) {
            case 'value':
                type = awilix.asValue(typeValue);
                break;
        }

        container.register(asType, type);
    };

    return this;
};