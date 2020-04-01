const path = require('path');
const fs = require('fs');

function Autoloader(opts) {

    const { logger } = opts;

    const autoloadModels = async (dictionary) => {
        const modelsPath = path.join(__dirname, '../models');

        logger.info('Loading Models From Path >', modelsPath);

        const list = fs.readdirSync(modelsPath);

        list.forEach(model => {
            const modelPath = path.join(modelsPath, model);

            if (fs.lstatSync(modelPath).isFile()) {
                let fnModel = require(modelPath);

                fnModel = new fnModel();

                if (fnModel.hasOwnProperty('name')) {
                    if (fnModel.hasOwnProperty('sql')) {
                        
                        fnModel.sql.forEach(query => {
                            fnModel.queries[query.simple_name] = {
                                text: query.text,
                                name: query.name,
                                values: []
                            }
                        });

                        dictionary[fnModel.name] = fnModel.queries;
                    }
                }
            }
        });

        return dictionary;
    };

    this.autoload = async function autoload(type, dictionary) {
        if (type === 'models') return await autoloadModels(dictionary);
    };

    return this;
};

module.exports = Autoloader;