const gcm = require('node-gcm');

function SendAndroid(devices) {
    let message = new gcm.Message({
        notification : {
            title : 'Hello, World!'
        }
    });

    let sender = new gcm.sender('<YOUR_API_KEY_HERE>');

    sender.send(message, {
        registrationTokens : devices
    }, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(response);
        }
    });
}

module.exports = SendAndroid;