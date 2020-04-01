function CommonRequestParameters(opts) {

    const { Joi } = opts;

    this.apiKeyOnly = () => {
        return Joi.object().keys({
            'xt-api-key': Joi.string().required().trim().label('API Key')
        }).unknown(true);
    };

    this.userTokenOnly = () => {
        return Joi.object().keys({
            'xt-user-token': Joi.string().required().trim()
        }).unknown(true);
    };

    this.clientTokenOnly = () => {
        return Joi.object().keys({
            'xt-client-token': Joi.string().required().trim()
        }).unknown(true);
    };

};

module.exports = CommonRequestParameters;