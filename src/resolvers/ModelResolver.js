function ModelResolver(opts) {

    const { autoloader, logger, Boom } = opts;

    const models = {};

    this.resolve = (name, query, sql = true) => {
        if (models.hasOwnProperty(name)) {
            if (models[name].hasOwnProperty(query)) {
                return models[name][query];
            } else throw Boom.badData(`Model resolver failed to resolve query [${query}] for model [${name}]`)
        } else throw Boom.badData(`Model resolver failed to resolve model [${name}]`);
    };

    autoloader.autoload('models', models).then((_models) => {
        logger.info("[\u2713] Models Initialization Successfull");
    })
    .catch(_error => {
        logger.error('Model Initialization Error >', _error);
    });

    return this;
};

module.exports = ModelResolver;