const apns = require('apns');

const options = {
    keyFile  : 'key.pem',
    certFile : 'cert.pem',
    debug    : true,
    gateway  : 'gateway.sandbox.push.apple.com',
    errorCallback : function(num, err) {
        console.error(err);
    }
};

async function SendIOS(deviceId) {
    let connection = new apns.Connection(options);

    let notification = new apns.Notification();
    notification.device = new apns.Device(deviceId);
    notification.alert = 'Hello World !';

    connection.sendNotification(notification);
}

module.exports = SendIOS;