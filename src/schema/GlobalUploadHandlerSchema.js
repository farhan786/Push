function GlobalUploadHandlerSchema(opts) {

    const { globalUploadHandlers, commonRequestParameters } = opts;

    this.upload = () => {
        return {
            method: 'POST',
            url: '/upload',
            schema: {
                headers: commonRequestParameters.userTokenOnly(),
            },
            handler: globalUploadHandlers.upload
        }
    };

}

module.exports = GlobalUploadHandlerSchema;