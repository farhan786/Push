const _Server = require('./globals/server');
const headlocker = require('./middleware/Headlocker');
const errorDecorator = require ('./middleware/ErrorDecorator');
const responseDecorator = require('./middleware/ResponseDecorator');

module.exports = (process) => {
    try {
        
        let server = _Server({
            process
        });

        server.addMiddleware(headlocker);
        server.addMiddleware(errorDecorator);
        server.addMiddleware(responseDecorator);

        server = server.start();
    } catch (_error) {
        console.error("Fatal Error In Bootstrap > ", _error);
        process.exit(1);
    }
};

