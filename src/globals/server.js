const fastify = require('fastify');
const helmet = require('fastify-helmet');
const fastifyJWT = require('fastify-jwt');
const fastifyCors = require('fastify-cors');
const fileUpload = require('fastify-file-upload')

const config = require('./config');
const di = require('./di');
const adapters = require('../adapters');

const backendRoutes = require('../routes/backend');
const frontendRoutes = require('../routes/frontend');

module.exports = function _Server(options) {
    const process = options.process;
    let userOptions = options.options;

    if (userOptions === undefined) userOptions = {};

    if (process === undefined) throw new Error('Server is dependent on [process]');

    let _server = null;
    let _adapters = null;

    const defaultOptions = {
        logger: {
            level: config.get("fastify").log_level,
            prettyPrint: true,
            serializers: {
                res(res) {
                    return {
                        code: res.code,
                        body: res.body
                    }
                },
                req(req) {
                    return {
                        method: req.method,
                        url: req.url,
                        path: req.path,
                        parameters: req.parameters,
                        headers: req.headers
                    }
                }
            }
        }
    };

    const serverOptions = { ...defaultOptions, ...userOptions };

    const defaultStorageInitialization = () => {
        _adapters = adapters(_server.log, config);
    };

    const defaultInitialization = () => {
        const _di = di({
            logger: _server.log,
            config,
            adapters: _adapters
        });

        const { modelResolver} = _di._container().cradle;

        this.decorateServer('di', () => _di._container());

        _server.schemaCompiler = schema => data => schema.validate(data);

        _server.decorateRequest('clientId', 0);
        _server.decorateRequest('userId', 0);

    };

    const defaultMiddleware = () => {
        _server.register(fastifyJWT, {
            secret: config.get('jwt').secret,
        });

        _server.register(helmet, {
            hidePoweredBy: {
                setTo: `${config.get('server').name} ${config.get('server').version}`,
            },
        });
        _server.register(fastifyCors);
        _server.register(fileUpload);

    };

    const defaultRouting = () => {
        const backendPrefix = config.get('server').api.prefixes.backend;
        const frontendPrefix = config.get('server').api.prefixes.frontend;

        _server.register(backendRoutes, { prefix: backendPrefix });
        _server.register(frontendRoutes, { prefix: frontendPrefix });
    };

    this.addRoute = function addRoute() { };

    this.addMiddleware = function addMiddleware(middleware, options = {}) {
        _server.register(middleware, options);
    };

    this.decorateServer = function decorate(key, value) {
        _server.decorate(key, value);
    };

    this.init = function init() {
        _server = fastify(serverOptions);
    };

    this.start = async function start() {
        try {

            defaultStorageInitialization();
            defaultInitialization();
            defaultMiddleware();
            defaultRouting();

            await _server.listen(config.get('server').port, config.get('server').host);

        } catch (_error) {
            console.error("Shutting Down Due To Fatal Exception >");
            console.error("Server Initialization Error >", _error);
            process.exit(1);
        }

        return _server;
    };

    if (_server === null) this.init();

    return this;
};