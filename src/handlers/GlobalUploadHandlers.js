const fs = require('fs');
const rp = require('request-promise');
const btoa = require('btoa')
const path = require('path');

function GlobalUploadHandlers(opts) {

    const { _, Boom } = opts;

    this.upload = async function upload(request, reply) {

        const _file = request.raw.files.file;

        const _path = path.join(__dirname, '../uploads');

        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }

        fs.writeFileSync(`${path.join(__dirname, '../uploads', _file.name)}`, _file.data);

        const options = {
            method: 'POST',
            uri: `https://arifmustafa.smartfile.com/api/2/path/data/whatsapp`,
            headers: {
                'Authorization': `Basic ${btoa(`oaLWSTVdga8Ko6yLzT64WCNtgVMWjw:Kg7fCE3zdqlrXiwbQAQBdAiGXm35qy`)}`
            },
            formData: {
                file: fs.createReadStream(`${path.join(__dirname, '../uploads', _file.name)}`)
            },
            json: true
        };

        const linkOptions = {
            method: 'POST',
            uri: `https://arifmustafa.smartfile.com/api/2/link/`,
            headers: {
                'Authorization': `Basic ${btoa(`oaLWSTVdga8Ko6yLzT64WCNtgVMWjw:Kg7fCE3zdqlrXiwbQAQBdAiGXm35qy`)}`
            },
            body: { },
            json: true
        };

        try {
            const _response = await rp(options);

            linkOptions.body['path'] = _.head(_response).path;

            const link = await rp(linkOptions);
            
            fs.unlinkSync(`${path.join(__dirname, '../uploads', _file.name)}`);

            const filePath = `${link.href}${_file.name}`;

            reply.send({
                upload: filePath
            })
        } catch (error) {
            throw Boom.badGateway(`Endpoint exception : [${error.statusCode}]`, error.error);
        }
    };

};

module.exports = GlobalUploadHandlers;