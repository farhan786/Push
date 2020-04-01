function AuthRequestHandlers(opts) {

    const { authService, aclService } = opts;

    this.login = async function login (request, reply) {
        const { clientId, body } = request;

        const args = { ...body };

        const user = await authService.verifyCredentials(args);

        const acl = await aclService.byUserId({
            userId: user.id,
        })

        const time = new Date().getTime();

        const token = this.jwt.sign({
            client: clientId,
            actor: user.id,
            time,
        });

        reply.send({
            token,
            user,
            acl,
        });
    };

    this.authenticate = async function authenticate (request, reply) {
        const { clientId, headers } = request;

        const client = await authService.verifyApiKey({
            api_key: headers['xt-api-key'],
            host: 'localhost',
        });

        const { uuid } = client;

        const time = new Date().getTime();

        const token = this.jwt.sign({
            client: clientId,
            uuid,
            time,
        });

        reply.send({
            token
        });
    };


};

module.exports = AuthRequestHandlers;