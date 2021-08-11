/**
 * Retreive the contents of one or more packet filters.
 * @name Database: Get Filters
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} filters - list of filters to retrieve
 * @param {function} callback - Function(error, result) to execute upon success or error
 */



export const getFilters = async (r, filters) =>
    r.table('Filters')
        .filter(doc => r.expr(filters).contains(doc('id')));
