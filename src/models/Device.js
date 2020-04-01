function Device() {
    this.name = 'device';

    this.queries = {};

    this.sql = [
        {
            text: 'SELECT #COLUMNS FROM device #RETURNS',
            name: 'create-device',
            simple_name: 'create',
        }
    ];
}

module.exports = Device;