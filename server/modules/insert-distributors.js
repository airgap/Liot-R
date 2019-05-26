var r = require('rethinkdb')
/**
 *
 * @name Database: Insert Distributors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} distributors - List of distributors to insert
 * @param {function} callback - Function(error, result) to execute upon success or error
 */

function insertDistributors(CONNECTION, distributors, callback) {
  r.table('Distributors').insert(distributors, { conflict: 'replace' }).run(CONNECTION, callback)
}
module.exports = insertDistributors
