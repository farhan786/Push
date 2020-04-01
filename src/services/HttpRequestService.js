const request = require('request-promise');

function HttpRequestService(opts) {
    const { config, logger, Boom } = opts;

    const _config = config.get('emporos');

    const types = {
        post_body: 'body',
    };

    const options = {
        method: 'GET',
        uri: `${_config.api_url}`,
        headers: {
            'Authorization': `${_config.token}`
        },
        json: true
    };

    this.send = async function send(uri, method, type, params) {
        const _options = { ...options };

        if (uri.includes(':bot-id')) uri = uri.replace(':bot-id', _config.bot_id);

        _options.uri = `${_options.uri}${uri}`;
        _options.method = method;

        if(params && type) _options[types[type]] = params;

        if(params) {
            if (params.message) {
                if (params.message.filename) delete params.message.filename;
                if (params.message.mime_type) delete params.message.mime_type;
            }
        }

        logger.trace('WT_REQUEST_OPTIONS >', _options);

        try {
            const _response = await request(_options);

            return _response;
        } catch (error) {
            throw Boom.badGateway(`Endpoint exception : [${error.statusCode}]`, error.error);
        }
    };
};

module.exports = HttpRequestService;