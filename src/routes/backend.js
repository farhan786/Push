module.exports = (fastify, opts, next) => {
    const di = fastify.di();
    
    const {
        pushHandlerSchema
    } = di.cradle;

    fastify.route({ ...pushHandlerSchema.fetch(), onRequest: fastify.verifyUserToken });

    fastify.route({ ...pushHandlerSchema.create(), onRequest: fastify.verifyUserToken }); 

    next();
};
