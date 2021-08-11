/**
 * Inserts one or more packet filters.
 * @name Database: Insert Filters
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} filters - List of filters to insert
 */
export const insertFilters = (r, filters) =>
    r.table('Filters').insert(filters, {conflict: 'replace'})

