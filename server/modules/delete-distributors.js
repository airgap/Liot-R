var r = require('rethinkdb')
/**
 * Delete one or more packet distributors.
 * @name Database: Delete Distributors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} distributors - List of distributor IDs to delete
 * @param {function} callback - Function(error, result) to execute upon success or error
 */

function deleteDistributors(CONNECTION, distributors, callback) {
  r.table('Distributors')
    .filter(doc=>{return r.expr(distributors).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteDistributors
