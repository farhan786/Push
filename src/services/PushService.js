function PushService(opts){

    const { crudResolver, iosService, androidService } = opts;

    this.create = async function create(args) {
        const {
           device_platform,
           device_id
        } = args;

        const device = await crudResolver.resolve({
            type:'create',
            model:'device',
            values: [
                device_platform,
                device_id
            ],
            insert: '$1, $2',
            columns: 'device_platform, device_id',
            returns: 'id'
        });

        return device;
    };

    this.fetch = async function fetch(args) {
        const {
            device_platform,
            device_id
        } = args;

        if(device_platform === 'ios'){
            await iosService.SendIOS(device_id)
        }
        else if(device_platform === 'android'){
            await androidService.SendAndroid(device_id)
        }
    }
};

module.exports = PushService;