var r = require('rethinkdb')
/**
 * Inserts one or more packet collectors.
 * @name Database: Insert Collectors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} collectors - List of collectors to insert
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function insertCollectors(CONNECTION, collectors, callback) {
  r.table('Collectors').insert(collectors, { conflict: 'replace' }).run(CONNECTION, callback);
}
module.exports = insertCollectors
