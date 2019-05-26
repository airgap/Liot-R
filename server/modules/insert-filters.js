var r = require('rethinkdb')
/**
 * Inserts one or more packet filters.
 * @name Database: Insert Filters
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} filters - List of filters to insert
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function insertFilters(CONNECTION, filters, callback) {
  r.table('Filters').insert(filters, { conflict: 'replace' }).run(CONNECTION, callback)
}
module.exports = insertFilters
