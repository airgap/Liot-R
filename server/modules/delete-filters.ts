/**
 * Delete one or more packet filters.
 * @name Database: Delete Filters
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} filters - List of filter IDs to delete
 */
export const deleteFilters = (r, filters) =>
    r.table('Filters')
        .filter(doc => {
            return r.expr(filters).contains(doc('id'))
        })
        .delete();
