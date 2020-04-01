function PushHandlers(opts){

    const { pushService } = opts
    
    this.create = async function create(request, reply) {
        const { clientId, userId, body, params } = request;
        const args = {
            clientId,
            userId,
            ...body,
            ...params
        };

        const register = await pushService.create(args);

        reply.send({
            register
        })
    };
    
    this.fetch = async function fetch(request, reply) {
        const { clientId, userId, body, params } = request;
        
        const args = {
            clientId,
            userId,
            ...body,
            ...params
        };

        const register = await pushService.fetch(args);

        reply.send({
            register
        })
    };
};

module.exports = PushHandlers;