function Query(opts) {
    const { logger, db, modelResolver, Boom } = opts;

    this.setTableName = (args) => {
        const placeholder = '#TABLE_NAME';

        const {
            query,
            table,
        } = args;

        query.text = query.text.replace(placeholder, table);

        return query;
    };

    this.prepare = (args) => {
        const { 
            model, 
            name, 
            values,
            insert, 
            columns, 
            where, 
            returns 
        } = args;

        const query = { ...modelResolver.resolve(model, name) };

        query.values = values;

        if (query.text.includes('#RETURNS') && returns !== undefined) query.text = query.text.replace('#RETURNS', `RETURNING ${returns}`);

        if (query.text.includes('#RETURNS') && returns === undefined) query.text = query.text.replace('#RETURNS', '');

        if (query.text.includes('#COLUMNS') && columns !== undefined) query.text = query.text.replace('#COLUMNS', columns);

        if (query.text.includes('#VALUES') && insert !== undefined) query.text = query.text.replace('#VALUES', insert);

        if (query.text.includes('#WHERE') && where !== undefined) query.text = query.text.replace('#WHERE', `WHERE ${where}`);


        if (query.text.includes('#WHERE') && where === undefined) query.text = query.text.replace('#WHERE', ``);

        if (query.text.includes('#')) {

            if (query.text.includes('#TYPE_ID') || query.text.includes('#TABLE_NAME')) return query;
            
            logger.error('Malformed Query >' , query.text);

            throw Boom.badData(`Malformed query during query preparation [${query.text}]`);
        }

        return query;
    };

    this.query = async (query) => {
        const currentTime = new Date().getTime();
        
        query.name = `${query.name}_${currentTime}`;

        return await db.primary.any(query);
    };

    return this;
};

module.exports = Query;