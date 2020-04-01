/* eslint-disable array-callback-return */
const fp = require('fastify-plugin');

const headlocker = (fastify, opts, next) => {

    fastify.decorate('verifyApiKey', async function verifyApiKey(request, reply) {

        const { authService } = this.di().cradle;

        const { headers } = request;
        
        const api_key = headers['xt-api-key'];
        const host = headers['host'];

        const serviceArgs = {
            api_key,
            host,
        };

        const client = await authService.verifyApiKey(serviceArgs); 

        request.clientId = client.id;

        return;
    });

    fastify.decorate('verifyClientToken', async function verifyClientToken(request, reply) {

        const { Boom } = this.di().cradle;

        const token = request.headers['xt-client-token'];

        const { client, uuid } = this.jwt.verify(token);

        request.clientId = client;

        return;
    });

    fastify.decorate('verifyUserToken', async function verifyUserToken(request, reply) {

        const { Boom } = this.di().cradle;

        const token = request.headers['xt-user-token'];

        const { client, actor } = this.jwt.verify(token);

        request.clientId = client;
        request.userId = actor;

        return;
    });
    
    next();
};

module.exports = fp(headlocker, {
    name: 'headlocker',
    fastify: '2.x',
});