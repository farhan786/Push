function CrudResolver(opts) {

    const { query } = opts;

    const _count = async function _count({ model, columns, values, where }) {
        const countSql = query.prepare({
            model,
            name: 'count',
            values,
            columns,
            where,
        });

        const [count] = await query.query(countSql);

        if (count) return count.count;

        return 0;
    }

    //Unpaginated Data
    const _fetch = async function _fetch({ model, columns, values, where, single = false }) {
        const fetchSql = query.prepare({
            model,
            name: 'fetch',
            values,
            where,
            columns,
        });

        const rows = await query.query(fetchSql);

        if (single) {
            const [row] = rows;

            if (row) return row;

            return null;
        }

        return rows;
    };

    const _create = async function _create({ model, insert, columns, values, returns }) {
        const createSql = query.prepare({
            model,
            name: 'create',
            insert,
            columns,
            values,
            returns
        });

        const [row] = await query.query(createSql);

        return row;
    };

    const _update = async function _update({ model, columns, values, where, returns }) {
        const updateSql = query.prepare({
            model,
            name: 'update',
            columns,
            values,
            where,
            returns
        });

        const [row] = await query.query(updateSql);

        if (returns) return row;

        return true;
    };

    //Paginated Data
    const _listing = async function _listing({ model, columns, values, where, page, limit, sortby, orderby }) {

        if (page === 0 && limit === 0) return [];

        const records = await _count({
            model,
            columns: 'id',
            values,
            where,
        })

        const currentPage = parseInt(page);
        const _orderby = (!orderby) ? 'id' : orderby;
        const _sortby = (!sortby) ? 'ASC' : sortby;
        const offset = (currentPage -1) * limit;
        const _where = `${where} ORDER BY ${_orderby} ${_sortby} LIMIT ${limit} OFFSET ${offset}`;

        const rows = await _fetch({
            model,
            columns,
            where: _where,
            values,
        });

        const total = rows.length;

        return {
            records,
            total,
            pages: Math.ceil(total / limit),
            page,
            limit,
            rows,
        };
    };

    const _remove = async function _remove({ model, values, where, returns }) {
        const removeSql = query.prepare({
            model,
            name: 'remove',
            values,
            where,
            returns
        });

        const [row] = await query.query(removeSql);
        
        if (returns) return row;

        return true;
    };

    const crud = {
        create: async function create(args) {
            return await _create(args);
        },
        update: async function update(args) {
            return await _update(args);
        },
        listing: async function listing(args) {
            return await _listing(args);
        },
        fetch: async function fetch(args) {
            return await _fetch(args);
        },
        count: async function count(args) {
            return await _count(args);
        },
        remove: async function remove(args) {
            return await _remove(args);
        }
    };

    this.resolve = async function resolve(args) {
        const {
            type,
        } = args;

        const _type = crud[type];

        delete args.type;

        return await _type.apply(this, [args]);
    };
}

module.exports = CrudResolver;