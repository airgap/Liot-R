var r = require('rethinkdb')
/**
 * Delete one or more packet collectors.
 * @name Database: Delete Collectors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} collectors - List of collector IDs to delete
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function deleteCollectors(CONNECTION, collectors, callback) {
  r.table('Collectors')
    .filter(doc=>{return r.expr(collectors).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteCollectors
