function AuthRequestHandlerSchema(opts) {
    const { authRequestHandlers, commonRequestParameters } = opts;

    this.login = () => {
        return {
            method: 'POST',
            url: '/auth/user',
            schema: {
                headers: commonRequestParameters.clientTokenOnly(),
            },
            handler: authRequestHandlers.login,
        };
    };

    this.authenticate = () => {
        return {
            method: 'GET',
            url: '/authenticate',
            schema: {
                headers: commonRequestParameters.apiKeyOnly(),
            },
            handler: authRequestHandlers.authenticate,
        };
    };
};

module.exports = AuthRequestHandlerSchema;