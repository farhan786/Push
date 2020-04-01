function PushHandlerSchema(opts){

    const {pushHandlers} = opts;
    
    this.create = () => {
        return {
            method: 'POST',
            url: '/register',
            handler: pushHandlers.create,
        };
    };
    
    this.fetch = () => {
        return {
            method: 'GET',
            url: '/send',
            handler: pushHandlers.fetch,
        };
    };
}

module.exports = PushHandlerSchema;