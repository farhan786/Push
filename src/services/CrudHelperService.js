function CrudHelperService(opts) {

    const { crudResolver } = opts;

    this.all = async function (model, columns, values, where) {
        return await crudResolver.resolve({
            type: 'fetch',
            model,
            values,
            where,
            columns,
        });
    }

    //General Fetch By Id Method
    this.byId = async function byId(id, model, columns) {
        return crudResolver.resolve({
            type: 'fetch',
            model,
            values: [
                id
            ],
            where: 'id = $1',
            columns,
            single: true
        }); 
    };

    this.byColumn = async function byColumn(column, values, model, columns) {
        return crudResolver.resolve({
            type: 'fetch',
            model,
            values,
            where: `${column} = $1`,
            columns,
            single: false
        });
    }

    //General Filter For All Models
    this.byFilter = async function (filters, values, model, columns, single = false) {
        return crudResolver.resolve({
            type: 'fetch',
            model,
            values,
            where: filters,
            columns,
            single
        });
    };

};

module.exports = CrudHelperService;